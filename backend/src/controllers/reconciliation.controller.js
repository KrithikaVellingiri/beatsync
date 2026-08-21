const prisma = require("../lib/prisma");

function calculateVisit(visit) {
  let sales = 0;
  let returns = 0;
  let payments = 0;
  let credit = 0;

  for (const item of visit.deliveryItems) {
    sales +=
      Number(item.quantity) *
      Number(item.sku.price);
  }

  for (const item of visit.returnItems) {
    returns +=
      Number(item.quantity) *
      Number(item.sku.price);
  }

  for (const payment of visit.payments) {
    payments += Number(payment.amount);
  }

  if (visit.creditPromise) {
    credit =
      Number(visit.creditPromise.amount);
  }

  const netSales = sales - returns;

  const expectedCollection =
    Math.max(0, netSales - credit);

  const discrepancy =
    expectedCollection - payments;

  return {
    sales: Number(sales.toFixed(2)),
    returns: Number(returns.toFixed(2)),
    netSales: Number(netSales.toFixed(2)),
    credit: Number(credit.toFixed(2)),
    expectedCollection: Number(
      expectedCollection.toFixed(2)
    ),
    payments: Number(payments.toFixed(2)),
    discrepancy: Number(
      discrepancy.toFixed(2)
    ),
  };
}

// ---------------------------------------------------------
// RECONCILIATION
// ---------------------------------------------------------

async function getReconciliation(req, res, next) {
  try {
    const distributorId =
      req.user.distributorId;

    const beatId = Number(req.params.beatId);

    if (!Number.isInteger(beatId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid beat ID",
      });
    }

    const beat = await prisma.beat.findFirst({
      where: {
        id: beatId,
        distributorId,
      },
    });

    if (!beat) {
      return res.status(404).json({
        success: false,
        message: "Beat not found",
      });
    }

    const assignments =
      await prisma.beatAssignment.findMany({
        where: {
          beatId,
        },
        include: {
          deliveryBoy: {
            select: {
              id: true,
              name: true,
              phone: true,
            },
          },

          stores: {
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
      });

    const storeResults = [];

    let totalSales = 0;
    let totalReturns = 0;
    let totalPayments = 0;
    let totalCredit = 0;
    let totalExpected = 0;
    let totalDiscrepancy = 0;

    for (const assignment of assignments) {
      for (const assignmentStore of assignment.stores) {
        const visit = assignmentStore.visit;

        if (!visit) {
          storeResults.push({
            store: assignmentStore.store,
            deliveryBoy:
              assignment.deliveryBoy,
            status: "not_visited",
            reconciliation: null,
          });

          continue;
        }

        const result = calculateVisit(visit);

        totalSales += result.sales;
        totalReturns += result.returns;
        totalPayments += result.payments;
        totalCredit += result.credit;
        totalExpected +=
          result.expectedCollection;
        totalDiscrepancy +=
          result.discrepancy;

        storeResults.push({
          store: assignmentStore.store,

          deliveryBoy:
            assignment.deliveryBoy,

          visitId: visit.id,

          status: visit.status,

          reconciliation: result,

          deliveryItems:
            visit.deliveryItems,

          returnItems:
            visit.returnItems,

          payments:
            visit.payments,

          creditPromise:
            visit.creditPromise,
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        beatId,

        summary: {
          totalSales:
            Number(totalSales.toFixed(2)),

          totalReturns:
            Number(totalReturns.toFixed(2)),

          totalPayments:
            Number(totalPayments.toFixed(2)),

          totalCredit:
            Number(totalCredit.toFixed(2)),

          expectedCollection:
            Number(totalExpected.toFixed(2)),

          discrepancy:
            Number(totalDiscrepancy.toFixed(2)),
        },

        stores: storeResults,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getReconciliation,
};