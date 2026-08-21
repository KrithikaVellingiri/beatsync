const prisma = require("../lib/prisma");

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

// ---------------------------------------------------------
// OWNER DASHBOARD
// ---------------------------------------------------------

async function getOwnerDashboard(req, res, next) {
  try {
    const distributorId = req.user.distributorId;

    if (req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only owners can access the dashboard",
      });
    }

    const today = startOfDay();
    const tomorrow = endOfDay();

    const beat = await prisma.beat.findFirst({
      where: {
        distributorId,
        date: {
          gte: today,
          lte: tomorrow,
        },
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
                visit: {
                  include: {
                    deliveryItems: {
                      include: {
                        sku: true,
                      },
                    },
                    returnItems: {
                      include: {
                        sku: true,
                      },
                    },
                    payments: true,
                    creditPromise: true,
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
        message: "No beat found for today",
      });
    }

    let totalStores = 0;
    let completedStores = 0;
    let inProgressStores = 0;
    let pendingStores = 0;

    let totalSales = 0;
    let totalReturns = 0;
    let totalPayments = 0;
    let totalCredit = 0;

    const deliveryBoys = [];

    for (const assignment of beat.assignments) {
      let boyCompleted = 0;
      let boyInProgress = 0;
      let boyPending = 0;

      for (const assignmentStore of assignment.stores) {
        totalStores++;

        const visit = assignmentStore.visit;

        if (!visit) {
          pendingStores++;
          boyPending++;
          continue;
        }

        if (visit.status === "completed") {
          completedStores++;
          boyCompleted++;
        } else if (visit.status === "in_progress") {
          inProgressStores++;
          boyInProgress++;
        } else {
          pendingStores++;
          boyPending++;
        }

        if (visit.deliveryItems) {
          for (const item of visit.deliveryItems) {
            totalSales +=
              Number(item.quantity) *
              Number(item.sku.price);
          }
        }

        if (visit.returnItems) {
          for (const item of visit.returnItems) {
            totalReturns +=
              Number(item.quantity) *
              Number(item.sku.price);
          }
        }

        if (visit.payments) {
          for (const payment of visit.payments) {
            totalPayments += Number(payment.amount);
          }
        }

        if (visit.creditPromise) {
          totalCredit +=
            Number(visit.creditPromise.amount);
        }
      }

      deliveryBoys.push({
        deliveryBoy: assignment.deliveryBoy,

        totalStores: assignment.stores.length,

        completedStores: boyCompleted,

        inProgressStores: boyInProgress,

        pendingStores: boyPending,

        progressPercentage:
          assignment.stores.length === 0
            ? 0
            : Number(
                (
                  (boyCompleted /
                    assignment.stores.length) *
                  100
                ).toFixed(2)
              ),
      });
    }

    const stores = await prisma.store.findMany({
      where: {
        distributorId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        locality: true,
        outstandingBalance: true,
        overdueDays: true,
      },
      orderBy: {
        outstandingBalance: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        beat: {
          id: beat.id,
          date: beat.date,
          status: beat.status,
          publishedAt: beat.publishedAt,
        },

        summary: {
          totalStores,
          completedStores,
          inProgressStores,
          pendingStores,

          progressPercentage:
            totalStores === 0
              ? 0
              : Number(
                  (
                    (completedStores / totalStores) *
                    100
                  ).toFixed(2)
                ),

          totalSales: Number(totalSales.toFixed(2)),

          totalReturns: Number(
            totalReturns.toFixed(2)
          ),

          totalPayments: Number(
            totalPayments.toFixed(2)
          ),

          totalCredit: Number(
            totalCredit.toFixed(2)
          ),
        },

        deliveryBoys,

        stores,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getOwnerDashboard,
};