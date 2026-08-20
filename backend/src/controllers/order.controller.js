const prisma = require("../lib/prisma");

// POST /api/orders
// Store owner creates an order for their own store
async function createOrder(req, res, next) {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one order item is required",
      });
    }

    // Remove duplicate SKU IDs
    const skuIds = items.map((item) => Number(item.skuId));

    if (new Set(skuIds).size !== skuIds.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate SKU in order",
      });
    }

    // Validate quantities
    for (const item of items) {
      if (!item.skuId || !Number.isInteger(Number(item.quantity))) {
        return res.status(400).json({
          success: false,
          message: "Each item requires skuId and integer quantity",
        });
      }

      if (Number(item.quantity) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be greater than 0",
        });
      }
    }

    // Get all requested SKUs
    const skus = await prisma.sKU.findMany({
      where: {
        id: {
          in: skuIds,
        },
        distributorId: req.storeOwner.store.distributorId,
        isActive: true,
      },
    });

    if (skus.length !== skuIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more SKUs are invalid or inactive",
      });
    }

    const skuMap = new Map(
      skus.map((sku) => [sku.id, sku])
    );

    let totalAmount = 0;

    const orderItems = items.map((item) => {
      const sku = skuMap.get(Number(item.skuId));
      const quantity = Number(item.quantity);

      totalAmount += sku.price * quantity;

      return {
        skuId: sku.id,
        quantity,
        unitPrice: sku.price,
      };
    });

    const order = await prisma.order.create({
      data: {
        storeId: req.storeOwner.storeId,
        storeOwnerId: req.storeOwner.id,
        status: "pending",
        totalAmount,

        items: {
          create: orderItems,
        },
      },

      include: {
        store: true,
        items: {
          include: {
            sku: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: {
        order,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/my-orders
async function getMyOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        storeOwnerId: req.storeOwner.id,
      },
      include: {
        items: {
          include: {
            sku: true,
          },
        },
      },
      orderBy: {
        orderedAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        orders,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/pending
// Distributor owner sees pending orders belonging to their distributor
async function getPendingOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      where: {
        status: "pending",
        store: {
          distributorId: req.user.distributorId,
        },
      },
      include: {
        store: {
          select: {
            id: true,
            name: true,
            ownerName: true,
            phone: true,
            address: true,
            locality: true,
            outstandingBalance: true,
            overdueDays: true,
          },
        },
        storeOwner: {
          select: {
            id: true,
            name: true,
            phone: true,
          },
        },
        items: {
          include: {
            sku: {
              select: {
                id: true,
                name: true,
                code: true,
                unit: true,
                price: true,
              },
            },
          },
        },
      },
      orderBy: {
        orderedAt: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        orders,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  getPendingOrders,
};