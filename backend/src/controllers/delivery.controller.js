const prisma = require("../lib/prisma");

// ---------------------------------------------------------
// GET MY BEAT
// ---------------------------------------------------------

async function getMyBeat(req, res, next) {
  try {
    const deliveryBoyId = req.user.id;
    const distributorId = req.user.distributorId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const beat = await prisma.beat.findFirst({
      where: {
        distributorId,
        date: {
          gte: today,
          lt: tomorrow,
        },
        status: "published",
      },
      include: {
        assignments: {
          where: {
            deliveryBoyId,
          },
          include: {
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
                },
              },
            },
          },
        },
      },
    });

    if (!beat || beat.assignments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No published beat found for today",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        beat,
        assignment: beat.assignments[0],
      },
    });
  } catch (err) {
    next(err);
  }
}


// ---------------------------------------------------------
// GET STORE VISIT DETAILS
// ---------------------------------------------------------

async function getVisitDetails(req, res, next) {
  try {
    const deliveryBoyId = req.user.id;
    const assignmentStoreId = Number(req.params.assignmentStoreId);

    if (Number.isNaN(assignmentStoreId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assignment store ID",
      });
    }

    const assignmentStore =
      await prisma.beatAssignmentStore.findFirst({
        where: {
          id: assignmentStoreId,
          beatAssignment: {
            deliveryBoyId,
            beat: {
              distributorId: req.user.distributorId,
              status: "published",
            },
          },
        },
        include: {
          store: true,
          beatAssignment: {
            include: {
              beat: true,
            },
          },
          plannedDeliveryItems: {
            include: {
              sku: true,
            },
          },
        },
      });

    if (!assignmentStore) {
      return res.status(404).json({
        success: false,
        message: "Store is not assigned to you",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        assignmentStore,
      },
    });
  } catch (err) {
    next(err);
  }
}


// ---------------------------------------------------------
// START STORE VISIT
// ---------------------------------------------------------

async function startVisit(req, res, next) {
  try {
    const deliveryBoyId = req.user.id;
    const assignmentStoreId = Number(req.params.assignmentStoreId);

    const assignmentStore =
      await prisma.beatAssignmentStore.findFirst({
        where: {
          id: assignmentStoreId,
          beatAssignment: {
            deliveryBoyId,
            beat: {
              distributorId: req.user.distributorId,
              status: "published",
            },
          },
        },
      });

    if (!assignmentStore) {
      return res.status(404).json({
        success: false,
        message: "Store is not assigned to you",
      });
    }

    const existingVisit = await prisma.storeVisit.findFirst({
      where: {
        beatAssignmentStoreId: assignmentStoreId,
      },
    });

    if (existingVisit) {
      return res.status(200).json({
        success: true,
        message: "Visit already started",
        data: {
          visit: existingVisit,
        },
      });
    }

    const visit = await prisma.storeVisit.create({
      data: {
        beatAssignmentStoreId: assignmentStoreId,
        deliveryBoyId,
        status: "in_progress",
        startedAt: new Date(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Store visit started",
      data: {
        visit,
      },
    });
  } catch (err) {
    next(err);
  }
}


// ---------------------------------------------------------
// COMPLETE STORE VISIT
// ---------------------------------------------------------

async function completeVisit(req, res, next) {
  try {
    const deliveryBoyId = req.user.id;
    const visitId = Number(req.params.visitId);

    const visit = await prisma.storeVisit.findFirst({
      where: {
        id: visitId,
        deliveryBoyId,
      },
      include: {
        beatAssignmentStore: {
          include: {
            store: true,
          },
        },
      },
    });

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Visit not found",
      });
    }

    if (visit.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Visit is already completed",
      });
    }

    const completedVisit = await prisma.storeVisit.update({
      where: {
        id: visitId,
      },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    });

    // Update store last visited timestamp
    await prisma.store.update({
      where: {
        id: visit.beatAssignmentStore.storeId,
      },
      data: {
        lastVisitedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Store visit completed",
      data: {
        visit: completedVisit,
      },
    });
  } catch (err) {
    next(err);
  }
}


// ---------------------------------------------------------
// RECORD DELIVERY ITEMS
// ---------------------------------------------------------

async function addDeliveryItems(req, res, next) {
  try {
    const deliveryBoyId = req.user.id;
    const visitId = Number(req.params.visitId);

    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "items array is required",
      });
    }

    const visit = await prisma.storeVisit.findFirst({
      where: {
        id: visitId,
        deliveryBoyId,
        status: "in_progress",
      },
      include: {
        beatAssignmentStore: {
          include: {
            plannedDeliveryItems: true,
          },
        },
      },
    });

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Active visit not found",
      });
    }

    const createdItems = [];

    for (const item of items) {
      const skuId = Number(item.skuId);
      const quantity = Number(item.quantity);

      if (!skuId || Number.isNaN(quantity) || quantity < 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid SKU or quantity",
        });
      }

      const plannedItem =
        visit.beatAssignmentStore.plannedDeliveryItems.find(
          (planned) => planned.skuId === skuId
        );

      const deliveryItem = await prisma.deliveryItem.create({
        data: {
          storeVisitId: visitId,
          skuId,
          quantity,
          plannedDeliveryItemId: plannedItem
            ? plannedItem.id
            : undefined,
        },
      });

      createdItems.push(deliveryItem);
    }

    return res.status(201).json({
      success: true,
      message: "Delivery items recorded",
      data: {
        items: createdItems,
      },
    });
  } catch (err) {
    next(err);
  }
}


// ---------------------------------------------------------
// RECORD PAYMENT
// ---------------------------------------------------------

async function addPayment(req, res, next) {
  try {
    const deliveryBoyId = req.user.id;
    const visitId = Number(req.params.visitId);

    const { amount, method, reference } = req.body;

    if (amount === undefined || !method) {
      return res.status(400).json({
        success: false,
        message: "amount and method are required",
      });
    }

    const validMethods = ["cash", "upi"];

    if (!validMethods.includes(method)) {
      return res.status(400).json({
        success: false,
        message: "Payment method must be cash or upi",
      });
    }

    const visit = await prisma.storeVisit.findFirst({
      where: {
        id: visitId,
        deliveryBoyId,
        status: "in_progress",
      },
    });

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Active visit not found",
      });
    }

    const payment = await prisma.payment.create({
      data: {
        storeVisitId: visitId,
        amount: Number(amount),
        method,
        reference: reference || undefined,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Payment recorded",
      data: {
        payment,
      },
    });
  } catch (err) {
    next(err);
  }
}


// ---------------------------------------------------------
// RECORD RETURN
// ---------------------------------------------------------

async function addReturn(req, res, next) {
  try {
    const deliveryBoyId = req.user.id;
    const visitId = Number(req.params.visitId);

    const { skuId, quantity, reason } = req.body;

    if (!skuId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "skuId and quantity are required",
      });
    }

    const visit = await prisma.storeVisit.findFirst({
      where: {
        id: visitId,
        deliveryBoyId,
        status: "in_progress",
      },
    });

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Active visit not found",
      });
    }

    const returnItem = await prisma.returnItem.create({
      data: {
        storeVisitId: visitId,
        skuId: Number(skuId),
        quantity: Number(quantity),
        reason: reason || undefined,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Return recorded",
      data: {
        returnItem,
      },
    });
  } catch (err) {
    next(err);
  }
}


// ---------------------------------------------------------
// RECORD CREDIT PROMISE
// ---------------------------------------------------------

async function addCreditPromise(req, res, next) {
  try {
    const deliveryBoyId = req.user.id;
    const visitId = Number(req.params.visitId);

    const { amount, promisedDate, note } = req.body;

    if (amount === undefined || !promisedDate) {
      return res.status(400).json({
        success: false,
        message: "amount and promisedDate are required",
      });
    }

    const visit = await prisma.storeVisit.findFirst({
      where: {
        id: visitId,
        deliveryBoyId,
        status: "in_progress",
      },
    });

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Active visit not found",
      });
    }

    const creditPromise = await prisma.creditPromise.create({
      data: {
        storeVisitId: visitId,
        amount: Number(amount),
        promisedDate: new Date(promisedDate),
        note: note || undefined,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Credit promise recorded",
      data: {
        creditPromise,
      },
    });
  } catch (err) {
    next(err);
  }
}


module.exports = {
  getMyBeat,
  getVisitDetails,
  startVisit,
  completeVisit,
  addDeliveryItems,
  addPayment,
  addReturn,
  addCreditPromise,
};