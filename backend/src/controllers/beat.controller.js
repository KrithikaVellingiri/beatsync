const prisma = require("../lib/prisma");

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date = new Date()) {
  const d = startOfDay(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function daysSince(date) {
  if (!date) return 999;

  const diff = Date.now() - new Date(date).getTime();

  return Math.max(0, Math.floor(diff / DAY_MS));
}

function calculateStoreScore(store) {
  const daysSinceVisit = daysSince(store.lastVisitedAt);

  const outstanding = Number(store.outstandingBalance || 0);
  const overdueDays = Number(store.overdueDays || 0);

  const visitScore = Math.min(daysSinceVisit / 7, 1);
  const outstandingScore = Math.min(outstanding / 10000, 1);
  const overdueScore = Math.min(overdueDays / 30, 1);
  const notVisitedScore = daysSinceVisit >= 5 ? 1 : 0;

  const score =
    visitScore * 0.30 +
    outstandingScore * 0.35 +
    overdueScore * 0.15 +
    notVisitedScore * 0.20;

  return {
    score: Number(score.toFixed(4)),
    daysSinceVisit,
  };
}

function calculateRiskLevel(store) {
  const outstanding = Number(store.outstandingBalance || 0);
  const overdueDays = Number(store.overdueDays || 0);

  // Informational only.
  // It does NOT block delivery.
  if (outstanding > 15000 || overdueDays > 60) {
    return "red";
  }

  if (
    (outstanding >= 5000 && outstanding <= 15000) ||
    (overdueDays >= 30 && overdueDays <= 60)
  ) {
    return "yellow";
  }

  return "green";
}

function chooseDeliveryBoy(deliveryBoys, workload, locality) {
  let bestBoy = null;
  let bestScore = Infinity;

  for (const boy of deliveryBoys) {
    const current = workload[boy.id] || {
      count: 0,
      localities: {},
    };

    const count = current.count;

    const localityAlreadyUsed =
      (current.localities[locality] || 0) > 0;

    // Strongly prefer boys who already serve the locality,
    // while still balancing the total store count.
    const localityPenalty = localityAlreadyUsed ? 0 : 0.5;

    const score = count + localityPenalty;

    if (score < bestScore) {
      bestScore = score;
      bestBoy = boy;
    }
  }

  return bestBoy;
}

async function generateBeat(req, res, next) {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only owners can generate a beat",
      });
    }

    const requestedDate = req.body.date
      ? new Date(req.body.date)
      : new Date();

    if (Number.isNaN(requestedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date",
      });
    }

    const date = startOfDay(requestedDate);

    const existingBeat = await prisma.beat.findFirst({
      where: {
        distributorId: req.user.distributorId,
        date,
      },
    });

    if (existingBeat) {
      return res.status(409).json({
        success: false,
        message: "A beat already exists for this date",
        data: {
          beatId: existingBeat.id,
        },
      });
    }

    const [stores, deliveryBoys] = await Promise.all([
      prisma.store.findMany({
        where: {
          distributorId: req.user.distributorId,
          isActive: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),

      prisma.user.findMany({
        where: {
          distributorId: req.user.distributorId,
          role: "delivery_boy",
          isActive: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

    if (deliveryBoys.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No active delivery boys found",
      });
    }

    if (stores.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No active stores found",
      });
    }

    // Calculate score for every store.
    const scoredStores = stores
      .map((store) => {
        const scoring = calculateStoreScore(store);

        return {
          store,
          ...scoring,
          riskLevel: calculateRiskLevel(store),
          locality: store.locality || "Unassigned",
        };
      })
      .sort((a, b) => b.score - a.score);

    // Workload state for each delivery boy.
    const workload = {};

    for (const boy of deliveryBoys) {
      workload[boy.id] = {
        count: 0,
        localities: {},
      };
    }

    // Automatically assign stores.
    const assignments = [];

    for (const item of scoredStores) {
      const boy = chooseDeliveryBoy(
        deliveryBoys,
        workload,
        item.locality
      );

      workload[boy.id].count += 1;

      workload[boy.id].localities[item.locality] =
        (workload[boy.id].localities[item.locality] || 0) + 1;

      assignments.push({
        ...item,
        deliveryBoyId: boy.id,
      });
    }

    // Create the Beat + assignments in one transaction.
    const beat = await prisma.$transaction(async (tx) => {
      const newBeat = await tx.beat.create({
        data: {
          distributorId: req.user.distributorId,
          date,
          status: "draft",
        },
      });

      // Group assigned stores by delivery boy.
      const byBoy = {};

      for (const item of assignments) {
        if (!byBoy[item.deliveryBoyId]) {
          byBoy[item.deliveryBoyId] = [];
        }

        byBoy[item.deliveryBoyId].push(item);
      }

      for (const boy of deliveryBoys) {
        const boyStores = byBoy[boy.id] || [];

        // Keep high-priority stores earlier,
        // then locality for grouping.
        boyStores.sort((a, b) => {
          if (a.locality !== b.locality) {
            return a.locality.localeCompare(b.locality);
          }

          return b.score - a.score;
        });

        const beatAssignment = await tx.beatAssignment.create({
          data: {
            beatId: newBeat.id,
            deliveryBoyId: boy.id,
          },
        });

        for (let i = 0; i < boyStores.length; i++) {
          const item = boyStores[i];

          await tx.beatAssignmentStore.create({
            data: {
              beatAssignmentId: beatAssignment.id,
              storeId: item.store.id,
              visitOrder: i + 1,
              outstandingSnapshot: item.store.outstandingBalance,
              overdueDaysSnapshot: item.store.overdueDays,
              riskLevel: item.riskLevel,
            },
          });
        }
      }

      return newBeat;
    });

    const result = await prisma.beat.findUnique({
      where: {
        id: beat.id,
      },
      include: {
        assignments: {
          include: {
            deliveryBoy: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
            stores: {
              orderBy: {
                visitOrder: "asc",
              },
              include: {
                store: true,
              },
            },
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Today's beat generated successfully",
      data: {
        beat: result,
        storeScores: scoredStores.map((item) => ({
          storeId: item.store.id,
          storeName: item.store.name,
          locality: item.locality,
          score: item.score,
          daysSinceVisit: item.daysSinceVisit,
          outstanding: Number(item.store.outstandingBalance),
          overdueDays: item.store.overdueDays,
          riskLevel: item.riskLevel,
        })),
      },
    });
  } catch (err) {
    next(err);
  }
}
async function getBeat(req, res, next) {
  try {
    const beatId = Number(req.params.id);

    if (!Number.isInteger(beatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid beat id",
      });
    }

    const beat = await prisma.beat.findFirst({
      where: {
        id: beatId,
        distributorId: req.user.distributorId,
      },
      include: {
        assignments: {
          include: {
            deliveryBoy: {
              select: {
                id: true,
                name: true,
                phone: true,
              },
            },
            stores: {
              orderBy: {
                visitOrder: "asc",
              },
              include: {
                store: true,
                plannedDeliveryItems: {
                  include: {
                    sku: true,
                  },
                  orderBy: {
                    id: "asc",
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!beat) {
      return res.status(404).json({
        success: false,
        message: "Beat not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        beat,
      },
    });
  } catch (err) {
    next(err);
  }
}
async function reassignStore(req, res, next) {
  try {
    const beatId = Number(req.params.beatId);
    const assignmentStoreId = Number(req.params.assignmentStoreId);
    const deliveryBoyId = Number(req.body.deliveryBoyId);

    if (
      !Number.isInteger(beatId) ||
      !Number.isInteger(assignmentStoreId) ||
      !Number.isInteger(deliveryBoyId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid id",
      });
    }

    const beat = await prisma.beat.findFirst({
      where: {
        id: beatId,
        distributorId: req.user.distributorId,
      },
    });

    if (!beat) {
      return res.status(404).json({
        success: false,
        message: "Beat not found",
      });
    }

    if (beat.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft beats can be modified",
      });
    }

    const deliveryBoy = await prisma.user.findFirst({
      where: {
        id: deliveryBoyId,
        distributorId: req.user.distributorId,
        role: "delivery_boy",
        isActive: true,
      },
    });

    if (!deliveryBoy) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery boy",
      });
    }

    const assignmentStore =
      await prisma.beatAssignmentStore.findFirst({
        where: {
          id: assignmentStoreId,
          beatAssignment: {
            beatId,
          },
        },
      });

    if (!assignmentStore) {
      return res.status(404).json({
        success: false,
        message: "Beat store assignment not found",
      });
    }

    let targetAssignment =
      await prisma.beatAssignment.findFirst({
        where: {
          beatId,
          deliveryBoyId,
        },
      });

    if (!targetAssignment) {
      targetAssignment = await prisma.beatAssignment.create({
        data: {
          beatId,
          deliveryBoyId,
        },
      });
    }

    await prisma.beatAssignmentStore.update({
      where: {
        id: assignmentStore.id,
      },
      data: {
        beatAssignmentId: targetAssignment.id,
      },
    });

    // Recalculate visit order for both affected boys.
    const affectedAssignments = await prisma.beatAssignment.findMany({
      where: {
        beatId,
      },
      include: {
        stores: {
          orderBy: {
            visitOrder: "asc",
          },
          include: {
            store: true,
          },
        },
      },
    });

    for (const assignment of affectedAssignments) {
      const ordered = [...assignment.stores].sort((a, b) => {
        const localityA = a.store.locality || "";
        const localityB = b.store.locality || "";

        if (localityA !== localityB) {
          return localityA.localeCompare(localityB);
        }

        return Number(b.outstandingSnapshot) -
          Number(a.outstandingSnapshot);
      });

      for (let i = 0; i < ordered.length; i++) {
        await prisma.beatAssignmentStore.update({
          where: {
            id: ordered[i].id,
          },
          data: {
            visitOrder: i + 1,
          },
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Store reassigned successfully",
    });
  } catch (err) {
    next(err);
  }
}
async function setPlannedItems(req, res, next) {
  try {
    const beatId = Number(req.params.beatId);
    const assignmentStoreId = Number(
      req.params.assignmentStoreId
    );

    const { items } = req.body;

    if (
      !Number.isInteger(beatId) ||
      !Number.isInteger(assignmentStoreId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid id",
      });
    }

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "items must be an array",
      });
    }

    const beatStore =
      await prisma.beatAssignmentStore.findFirst({
        where: {
          id: assignmentStoreId,
          beatAssignment: {
            beatId,
            beat: {
              distributorId: req.user.distributorId,
            },
          },
        },
        include: {
          beatAssignment: true,
        },
      });

    if (!beatStore) {
      return res.status(404).json({
        success: false,
        message: "Beat store assignment not found",
      });
    }

    const beat = await prisma.beat.findFirst({
      where: {
        id: beatId,
        distributorId: req.user.distributorId,
      },
    });

    if (beat.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Products can only be planned on a draft beat",
      });
    }

    // Validate all SKUs belong to this distributor.
    const skuIds = items.map((item) => Number(item.skuId));

    const skus = await prisma.sKU.findMany({
      where: {
        id: {
          in: skuIds,
        },
        distributorId: req.user.distributorId,
        isActive: true,
      },
    });

    if (skus.length !== skuIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more SKUs are invalid",
      });
    }

    await prisma.$transaction(async (tx) => {
      // Replace today's planned items for this store.
      await tx.plannedDeliveryItem.deleteMany({
        where: {
          beatAssignmentStoreId: assignmentStoreId,
        },
      });

      if (items.length > 0) {
        await tx.plannedDeliveryItem.createMany({
          data: items.map((item) => ({
            beatAssignmentStoreId: assignmentStoreId,
            skuId: Number(item.skuId),
            plannedQuantity: Number(item.plannedQuantity),
          })),
        });
      }
    });

    const plannedItems =
      await prisma.plannedDeliveryItem.findMany({
        where: {
          beatAssignmentStoreId: assignmentStoreId,
        },
        include: {
          sku: true,
        },
      });

    return res.status(200).json({
      success: true,
      message: "Planned delivery items saved",
      data: {
        items: plannedItems,
      },
    });
  } catch (err) {
    next(err);
  }
}
async function publishBeat(req, res, next) {
  try {
    const beatId = Number(req.params.id);

    if (!Number.isInteger(beatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid beat id",
      });
    }

    const beat = await prisma.beat.findFirst({
      where: {
        id: beatId,
        distributorId: req.user.distributorId,
      },
      include: {
        assignments: {
          include: {
            stores: true,
          },
        },
      },
    });

    if (!beat) {
      return res.status(404).json({
        success: false,
        message: "Beat not found",
      });
    }

    if (beat.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft beats can be published",
      });
    }

    const totalStores = beat.assignments.reduce(
      (total, assignment) => total + assignment.stores.length,
      0
    );

    if (totalStores === 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot publish a beat with no stores",
      });
    }

    const publishedBeat = await prisma.beat.update({
      where: {
        id: beatId,
      },
      data: {
        status: "published",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Beat published successfully",
      data: {
        beat: publishedBeat,
      },
    });
  } catch (err) {
    next(err);
  }
}
module.exports = {
  generateBeat,
  getBeat,
  reassignStore,
  setPlannedItems,
  publishBeat,
};