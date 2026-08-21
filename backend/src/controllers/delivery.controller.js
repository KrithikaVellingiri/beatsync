const prisma = require("../lib/prisma");
const { calculateVisitAmounts } = require("../utils/ledger");
const razorpay = require("../lib/razorpay");
const crypto = require("crypto");

// ---------------------------------------------------------
// GET MY BEAT
// ---------------------------------------------------------

async function getMyBeat(req, res, next) {
  try {
    const deliveryBoyId = req.user.id;
    const distributorId = req.context.distributorId;

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
              distributorId: req.context.distributorId,
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
            beatAssignmentStore: {
              beatAssignment: {
                beat: {
                  distributorId: req.context.distributorId,
                },
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

    const products = await prisma.sKU.findMany({
      where: {
        distributorId: req.context.distributorId,
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
              distributorId: req.context.distributorId,
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
    const distributorId = req.context.distributorId;
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
    const distributorId = req.context.distributorId;

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
    const distributorId = req.context.distributorId;

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

    if (method !== "cash") {
      return res.status(400).json({
        success: false,
        message: "Use the Razorpay payment flow for UPI",
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
              distributorId: req.context.distributorId,
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

    const payment = await prisma.payment.create({
      data: {
        storeVisitId: visitId,
        deliveryBoyId,
        amount: numericAmount,
        method: "cash",
        reference: reference || undefined,
      },
    });

    const io = req.app.get("io");

    if (io && req.context.distributorId) {
      io.to(`distributor:${req.context.distributorId}`)
        .emit("payment:recorded", {
          visitId,
          payment,
        });
    }

    return res.status(201).json({
      success: true,
      message: "Cash payment recorded",
      data: {
        payment,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function createRazorpayOrder(req, res, next) {
  try {
    const deliveryBoyId = req.user.id;
    const visitId = Number(req.params.visitId);
    const amount = Number(req.body.amount);

    if (!Number.isInteger(visitId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit ID",
      });
    }

    const amountInPaise = Math.round(amount * 100);

    if (!Number.isFinite(amount) || amount <= 0 || amountInPaise <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
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
              distributorId: req.context.distributorId,
            },
          },
        },
      },
      include: {
        deliveryItems: { include: { sku: true } },
        returnItems: { include: { sku: true } },
        payments: {
          where: { status: "captured" },
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
    const outstandingInPaise = Math.max(
      0,
      Math.round((amounts.expectedCollection - amounts.paymentAmount) * 100)
    );

    if (amountInPaise > outstandingInPaise) {
      return res.status(400).json({
        success: false,
        message: "Payment amount exceeds the visit outstanding amount",
      });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({
        success: false,
        message: "Razorpay is not configured",
      });
    }

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `visit_${visitId}_${Date.now()}`,
      notes: {
        visitId: String(visitId),
        deliveryBoyId: String(deliveryBoyId),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Razorpay order created",
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (err) {
    next(err);
  }
}
async function verifyRazorpayPayment(req, res, next) {
  try {
    const deliveryBoyId = req.user.id;
    const visitId = Number(req.params.visitId);

    const razorpayOrderId =
      req.body.razorpay_order_id || req.body.razorpayOrderId;
    const razorpayPaymentId =
      req.body.razorpay_payment_id || req.body.razorpayPaymentId;
    const razorpaySignature =
      req.body.razorpay_signature || req.body.razorpaySignature;

    if (!Number.isInteger(visitId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid visit ID",
      });
    }

    if (
      typeof razorpayOrderId !== "string" ||
      typeof razorpayPaymentId !== "string" ||
      typeof razorpaySignature !== "string" ||
      !razorpayOrderId ||
      !razorpayPaymentId ||
      !razorpaySignature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "razorpayOrderId, razorpayPaymentId and razorpaySignature are required",
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
              distributorId: req.context.distributorId,
            },
          },
        },
      },
      include: {
        deliveryItems: { include: { sku: true } },
        returnItems: { include: { sku: true } },
        payments: true,
        creditPromise: true,
      },
    });

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Active visit not found",
      });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({
        success: false,
        message: "Razorpay is not configured",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const expectedSignature = Buffer.from(generatedSignature, "utf8");
    const providedSignature = Buffer.from(razorpaySignature, "utf8");
    const isValid =
      expectedSignature.length === providedSignature.length &&
      crypto.timingSafeEqual(expectedSignature, providedSignature);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay payment signature",
      });
    }

    /*
     * IMPORTANT:
     * At this point Razorpay has authenticated
     * the payment response.
     *
     * We now need the actual order amount before
     * creating our Payment record.
     */

    const order = await razorpay.orders.fetch(razorpayOrderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Razorpay order not found",
      });
    }

    if (
      order.id !== razorpayOrderId ||
      order.status !== "paid" ||
      order.currency !== "INR" ||
      order.notes?.visitId !== String(visitId) ||
      order.notes?.deliveryBoyId !== String(deliveryBoyId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order does not belong to this visit",
      });
    }

    const paymentDetails = await razorpay.payments.fetch(
      razorpayPaymentId
    );

    if (
      !paymentDetails ||
      paymentDetails.id !== razorpayPaymentId ||
      paymentDetails.order_id !== razorpayOrderId ||
      paymentDetails.status !== "captured" ||
      paymentDetails.currency !== "INR" ||
      paymentDetails.amount !== order.amount
    ) {
      return res.status(400).json({
        success: false,
        message: "Razorpay payment is not a captured payment for this order",
      });
    }

    const amounts = calculateVisitAmounts(visit);
    const outstandingInPaise = Math.max(
      0,
      Math.round((amounts.expectedCollection - amounts.paymentAmount) * 100)
    );

    if (order.amount > outstandingInPaise) {
      return res.status(400).json({
        success: false,
        message: "Payment amount exceeds the visit outstanding amount",
      });
    }

    const existingPayment = await prisma.payment.findFirst({
      where: {
        OR: [
          { razorpayOrderId },
          { razorpayPaymentId },
        ],
      },
    });

    if (existingPayment) {
      return res.status(409).json({
        success: false,
        message: "This Razorpay payment has already been recorded",
      });
    }

    let payment;

    try {
      payment = await prisma.payment.create({
        data: {
          storeVisitId: visitId,
          deliveryBoyId,
          amount: order.amount / 100,
          method: "upi",
          status: "captured",
          reference: razorpayPaymentId,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
        },
      });
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(409).json({
          success: false,
          message: "This Razorpay payment has already been recorded",
        });
      }

      throw error;
    }

    const io = req.app.get("io");

    if (io && req.context.distributorId) {
      io.to(`distributor:${req.context.distributorId}`)
        .emit("payment:recorded", {
          visitId,
          payment,
        });
    }

    return res.status(201).json({
      success: true,
      message: "UPI payment verified and recorded",
      data: {
        payment,
        razorpay: {
          orderId: razorpayOrderId,
          paymentId: razorpayPaymentId,
        },
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
        beatAssignmentStore: {
          beatAssignment: {
            beat: {
              distributorId: req.context.distributorId,
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

    const sku = await prisma.sKU.findFirst({
      where: {
        id: numericSkuId,
        distributorId: req.context.distributorId,
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
        io.to(`distributor:${req.context.distributorId}`)
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
        beatAssignmentStore: {
          beatAssignment: {
            beat: {
              distributorId: req.context.distributorId,
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
        io.to(`distributor:${req.context.distributorId}`)
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
    const distributorId = req.context.distributorId;
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

    const completion = await prisma.$transaction(
      async (tx) => {
        const claimedVisit = await tx.storeVisit.updateMany({
          where: {
            id: visitId,
            deliveryBoyId,
            status: "in_progress",
            beatAssignmentStore: {
              beatAssignment: {
                beat: { distributorId },
              },
            },
          },
          data: {
            status: "completed",
            completedAt: new Date(),
          },
        });

        if (claimedVisit.count !== 1) {
          return null;
        }

        const completedVisit = await tx.storeVisit.findUnique({
          where: { id: visitId },
          include: {
            deliveryItems: { include: { sku: true } },
            payments: { where: { status: "captured" } },
            returnItems: { include: { sku: true } },
            creditPromise: true,
          },
        });

        const store = await tx.store.findUnique({
          where: { id: completedVisit.storeId },
        });

        if (!store) {
          throw new Error("Store not found");
        }

        const amounts = calculateVisitAmounts(completedVisit);
        const previousBalance = Number(store.outstandingBalance);
        const newBalance =
          previousBalance + amounts.netSales - amounts.paymentAmount;

        await tx.store.update({
          where: { id: completedVisit.storeId },
          data: {
            outstandingBalance: newBalance,
            lastVisitedAt: new Date(),
          },
        });

        await tx.storeLedgerEntry.create({
          data: {
            storeId: completedVisit.storeId,
            storeVisitId: visitId,
            previousBalance,
            salesAmount: amounts.salesAmount,
            returnAmount: amounts.returnAmount,
            paymentAmount: amounts.paymentAmount,
            creditAmount: amounts.creditAmount,
            newBalance,
          },
        });

        return {
          visit: completedVisit,
          amounts,
          previousBalance,
          newBalance,
        };
      },
      { isolationLevel: "Serializable" }
    );

    if (!completion) {
      return res.status(409).json({
        success: false,
        message: "Visit is already completed or no longer active",
      });
    }

    const { visit: completedVisit, amounts, previousBalance, newBalance } =
      completion;

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
          previousBalance,
          newBalance,
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
    const distributorId = req.context.distributorId;

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
  createRazorpayOrder,
  verifyRazorpayPayment,
  addReturn,
  addCreditPromise,
  completeVisit,
  getOwnerContact,
};