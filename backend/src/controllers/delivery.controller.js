const prisma = require("../lib/prisma");
const { calculateVisitAmounts } = require("../utils/ledger");

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
                visit: {
                  include: {
                    deliveryItems: {
                      include: {
                        sku: true,
                      },
                    },
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

    if (!Number.isInteger(assignmentStoreId)) {
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
// GET PRODUCTS AVAILABLE FOR DELIVERY
// ---------------------------------------------------------

async function getProducts(req, res, next) {
  try {
    const deliveryBoyId = req.user.id;
    const visitId = Number(req.params.visitId);

    if (!Number.isInteger(visitId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit ID",
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
        message: "Visit not found",
      });
    }

    const products = await prisma.sKU.findMany({
      where: {
        distributorId: req.user.distributorId,
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        code: true,
        unit: true,
        price: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        products,
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
    const assignmentStoreId = Number(
      req.params.assignmentStoreId
    );

    if (!Number.isInteger(assignmentStoreId)) {
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
        storeId: assignmentStore.storeId,
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
// RECORD / UPDATE DELIVERY ITEMS
// ---------------------------------------------------------

async function addDeliveryItems(req, res, next) {
  try {
    const deliveryBoyId = req.user.id;
    const distributorId = req.user.distributorId;
    const visitId = Number(req.params.visitId);

    const { items } = req.body;

    if (!Number.isInteger(visitId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit id",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "items array is required",
      });
    }

    // -----------------------------------------------------
    // FIND ACTIVE VISIT
    // -----------------------------------------------------

    const visit = await prisma.storeVisit.findFirst({
      where: {
        id: visitId,
        deliveryBoyId,
        status: "in_progress",

        beatAssignmentStore: {
          beatAssignment: {
            beat: {
              distributorId,
            },
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

    // -----------------------------------------------------
    // NORMALIZE INPUT
    // -----------------------------------------------------

    const normalizedItems = items.map((item) => ({
      skuId: Number(item.skuId),
      quantity: Number(item.quantity),
    }));

    // -----------------------------------------------------
    // VALIDATE INPUT
    // -----------------------------------------------------

    for (const item of normalizedItems) {
      if (
        !Number.isInteger(item.skuId) ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Each item must contain a valid skuId and quantity greater than 0",
        });
      }
    }

    // -----------------------------------------------------
    // CHECK DUPLICATE SKU IN REQUEST
    // -----------------------------------------------------

    const skuIds = normalizedItems.map((item) => item.skuId);

    const uniqueSkuIds = [...new Set(skuIds)];

    if (uniqueSkuIds.length !== skuIds.length) {
      return res.status(400).json({
        success: false,
        message: "The same SKU cannot be added more than once",
      });
    }

    // -----------------------------------------------------
    // VERIFY SKUS BELONG TO THIS DISTRIBUTOR
    // -----------------------------------------------------

    const skus = await prisma.sKU.findMany({
      where: {
        id: {
          in: uniqueSkuIds,
        },
        distributorId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        unit: true,
      },
    });

    if (skus.length !== uniqueSkuIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products are invalid",
      });
    }

    // -----------------------------------------------------
    // CREATE DELIVERY ITEMS
    // -----------------------------------------------------

    const createdItems = await prisma.$transaction(
      normalizedItems.map((item) =>
        prisma.deliveryItem.create({
          data: {
            storeVisitId: visitId,
            skuId: item.skuId,
            quantity: item.quantity,
          },
          include: {
            sku: true,
          },
        })
      )
    );

    return res.status(201).json({
      success: true,
      message: "Actual delivery recorded successfully",
      data: {
        items: createdItems,
      },
    });
  } catch (err) {
    next(err);
  }
}
async function updateDeliveryItem(req, res, next) {
  try {
    const deliveryBoyId = req.user.id;
    const distributorId = req.user.distributorId;

    const visitId = Number(req.params.visitId);
    const skuId = Number(req.params.skuId);

    const quantity = Number(req.body.quantity);

    if (!Number.isInteger(visitId) || !Number.isInteger(skuId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit id or SKU id",
      });
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than 0",
      });
    }

    // -----------------------------------------------------
    // VERIFY ACTIVE VISIT
    // -----------------------------------------------------

    const visit = await prisma.storeVisit.findFirst({
      where: {
        id: visitId,
        deliveryBoyId,
        status: "in_progress",

        beatAssignmentStore: {
          beatAssignment: {
            beat: {
              distributorId,
            },
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

    // -----------------------------------------------------
    // VERIFY SKU
    // -----------------------------------------------------

    const sku = await prisma.sKU.findFirst({
      where: {
        id: skuId,
        distributorId,
        isActive: true,
      },
    });

    if (!sku) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // -----------------------------------------------------
    // FIND EXISTING DELIVERY ITEM
    // -----------------------------------------------------

    const existingItem = await prisma.deliveryItem.findFirst({
      where: {
        storeVisitId: visitId,
        skuId,
      },
    });

    let deliveryItem;

    if (existingItem) {
      deliveryItem = await prisma.deliveryItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity,
        },
        include: {
          sku: true,
        },
      });
    } else {
      deliveryItem = await prisma.deliveryItem.create({
        data: {
          storeVisitId: visitId,
          skuId,
          quantity,
        },
        include: {
          sku: true,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery quantity updated",
      data: {
        item: deliveryItem,
      },
    });
  } catch (err) {
    next(err);
  }
}
async function removeDeliveryItem(req, res, next) {
  try {
    const deliveryBoyId = req.user.id;
    const distributorId = req.user.distributorId;

    const visitId = Number(req.params.visitId);
    const skuId = Number(req.params.skuId);

    if (!Number.isInteger(visitId) || !Number.isInteger(skuId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit id or SKU id",
      });
    }

    const visit = await prisma.storeVisit.findFirst({
      where: {
        id: visitId,
        deliveryBoyId,
        status: "in_progress",

        beatAssignmentStore: {
          beatAssignment: {
            beat: {
              distributorId,
            },
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

    const item = await prisma.deliveryItem.findFirst({
      where: {
        storeVisitId: visitId,
        skuId,
      },
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Delivery item not found",
      });
    }

    await prisma.deliveryItem.delete({
      where: {
        id: item.id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Product removed from delivery",
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

    const {
      amount,
      method,
      reference,
    } = req.body;

    if (!Number.isInteger(visitId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit ID",
      });
    }

    if (amount === undefined || !method) {
      return res.status(400).json({
        success: false,
        message: "amount and method are required",
      });
    }

    const numericAmount = Number(amount);

    if (
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
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

    const payment =
      await prisma.payment.create({
        data: {
          storeVisitId: visitId,
          deliveryBoyId,
          amount: numericAmount,
          method,
          reference: reference || undefined,
        },
      });
    const io = req.app.get("io");
    if (io) {
        io.to(`distributor:${req.user.distributorId}`)
            .emit("payment:recorded", {
            visitId,
            payment,
        });
    }

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

    const {
      skuId,
      quantity,
      reason,
    } = req.body;

    if (!Number.isInteger(visitId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit ID",
      });
    }

    if (
      skuId === undefined ||
      quantity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "skuId and quantity are required",
      });
    }

    const numericSkuId = Number(skuId);
    const numericQuantity = Number(quantity);

    if (
      !Number.isInteger(numericSkuId) ||
      !Number.isInteger(numericQuantity) ||
      numericQuantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "skuId and quantity must be valid positive values",
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

    const sku = await prisma.sKU.findFirst({
      where: {
        id: numericSkuId,
        distributorId: req.user.distributorId,
        isActive: true,
      },
    });

    if (!sku) {
      return res.status(400).json({
        success: false,
        message: "Invalid product",
      });
    }

    const returnItem =
      await prisma.returnItem.create({
        data: {
          storeVisitId: visitId,
          skuId: numericSkuId,
          quantity: numericQuantity,
          reason: reason || undefined,
        },
        include: {
          sku: true,
        },
      });
    const io = req.app.get("io");

    if (io) {
        io.to(`distributor:${req.user.distributorId}`)
        .emit("return:recorded", {
        visitId,
        returnItem,
        });
    }

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

    const {
      amount,
      promisedDate,
      note,
    } = req.body;

    if (!Number.isInteger(visitId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit ID",
      });
    }

    if (
      amount === undefined ||
      !promisedDate
    ) {
      return res.status(400).json({
        success: false,
        message:
          "amount and promisedDate are required",
      });
    }

    const numericAmount = Number(amount);

    if (
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    const parsedDate = new Date(promisedDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid promised date",
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

    const existingPromise =
      await prisma.creditPromise.findUnique({
        where: {
          storeVisitId: visitId,
        },
      });

    let creditPromise;

    if (existingPromise) {
      creditPromise =
        await prisma.creditPromise.update({
          where: {
            storeVisitId: visitId,
          },
          data: {
            amount: numericAmount,
            promisedDate: parsedDate,
            note: note || undefined,
          },
        });
    } else {
      creditPromise =
        await prisma.creditPromise.create({
          data: {
            storeVisitId: visitId,
            amount: numericAmount,
            promisedDate: parsedDate,
            note: note || undefined,
          },
        });
    }
    const io = req.app.get("io");

    if (io) {
        io.to(`distributor:${req.user.distributorId}`)
        .emit("credit:recorded", {
        visitId,
        creditPromise,
        });
    }

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

// ---------------------------------------------------------
// COMPLETE STORE VISIT
// ---------------------------------------------------------

async function completeVisit(req, res, next) {
  try {
    const deliveryBoyId = req.user.id;
    const distributorId = req.user.distributorId;
    const visitId = Number(req.params.visitId);

    if (!Number.isInteger(visitId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit ID",
      });
    }

    const visit = await prisma.storeVisit.findFirst({
      where: {
        id: visitId,
        deliveryBoyId,
        status: "in_progress",
        beatAssignmentStore: {
          beatAssignment: {
            beat: {
              distributorId,
            },
          },
        },
      },
      include: {
        beatAssignmentStore: {
          include: {
            store: true,
          },
        },
        deliveryItems: {
          include: {
            sku: true,
          },
        },
        payments: true,
        returnItems: {
          include: {
            sku: true,
          },
        },
        creditPromise: true,
      },
    });

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Active visit not found",
      });
    }

    const amounts = calculateVisitAmounts(visit);

    const completedVisit = await prisma.$transaction(
      async (tx) => {
        const store = await tx.store.findUnique({
          where: {
            id: visit.storeId,
          },
        });

        if (!store) {
          throw new Error("Store not found");
        }

        const previousBalance =
          Number(store.outstandingBalance);

        /*
         * New outstanding:
         *
         * previous outstanding
         * + today's net sales
         * - today's payments
         *
         * Credit remains outstanding, so it is NOT subtracted.
         */
        const newBalance =
          previousBalance +
          amounts.netSales -
          amounts.paymentAmount;

        const updatedVisit =
          await tx.storeVisit.update({
            where: {
              id: visitId,
            },
            data: {
              status: "completed",
              completedAt: new Date(),
            },
            include: {
              deliveryItems: {
                include: {
                  sku: true,
                },
              },
              payments: true,
              returnItems: {
                include: {
                  sku: true,
                },
              },
              creditPromise: true,
            },
          });

        await tx.store.update({
          where: {
            id: visit.storeId,
          },
          data: {
            outstandingBalance: newBalance,
            lastVisitedAt: new Date(),
          },
        });

        await tx.storeLedgerEntry.create({
          data: {
            storeId: visit.storeId,
            storeVisitId: visitId,

            previousBalance,

            salesAmount: amounts.salesAmount,
            returnAmount: amounts.returnAmount,
            paymentAmount: amounts.paymentAmount,
            creditAmount: amounts.creditAmount,

            newBalance,
          },
        });

        return updatedVisit;
      }
    );

    const io = req.app.get("io");

    if (io) {
      io.to(`distributor:${distributorId}`).emit(
        "visit:completed",
        {
          visitId,
          storeId: visit.storeId,
          deliveryBoyId,
          amounts,
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: "Store visit completed",
      data: {
        visit: completedVisit,
        summary: {
          ...amounts,
          previousBalance: Number(
            visit.beatAssignmentStore.store
              .outstandingBalance
          ),
          newBalance:
            Number(
              visit.beatAssignmentStore.store
                .outstandingBalance
            ) +
            amounts.netSales -
            amounts.paymentAmount,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}
// ---------------------------------------------------------
// GET OWNER CONTACT
// ---------------------------------------------------------

async function getOwnerContact(req, res, next) {
  try {
    const distributorId = req.user.distributorId;

    const distributor = await prisma.distributor.findUnique({
      where: {
        id: distributorId,
      },
      select: {
        name: true,
        phone: true,
      },
    });

    if (!distributor) {
      return res.status(404).json({
        success: false,
        message: "Distributor not found",
      });
    }

    if (!distributor.phone) {
      return res.status(404).json({
        success: false,
        message: "Owner phone number is not available",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        ownerName: distributor.name,
        phone: distributor.phone,
      },
    });
  } catch (err) {
    next(err);
  }
}
module.exports = {
  getMyBeat,
  getVisitDetails,
  getProducts,
  startVisit,
  addDeliveryItems,
  updateDeliveryItem,
  removeDeliveryItem,
  addPayment,
  addReturn,
  addCreditPromise,
  completeVisit,
  getOwnerContact,
};