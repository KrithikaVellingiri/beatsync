const prisma = require("../lib/prisma");

// ---------------------------------------------------------
// GET STORE LEDGER
// ---------------------------------------------------------

async function getStoreLedger(req, res, next) {
  try {
    const storeId = Number(req.params.storeId);

    if (!Number.isInteger(storeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid store ID",
      });
    }

    const store = await prisma.store.findFirst({
      where: {
        id: storeId,
        distributorId: req.user.distributorId,
      },
      select: {
        id: true,
        name: true,
        ownerName: true,
        phone: true,
        locality: true,
        outstandingBalance: true,
        overdueDays: true,
      },
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const entries =
      await prisma.storeLedgerEntry.findMany({
        where: {
          storeId,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          storeVisit: {
            include: {
              deliveryBoy: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                },
              },
            },
          },
        },
      });

    return res.status(200).json({
      success: true,
      data: {
        store,
        ledger: entries,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStoreLedger,
};