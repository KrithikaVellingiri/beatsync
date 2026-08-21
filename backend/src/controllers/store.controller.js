const prisma = require("../lib/prisma");

// POST /api/stores
// Owner only
async function createStore(req, res, next) {
  try {
    const {
      name,
      ownerName,
      phone,
      address,
      latitude,
      longitude,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "name is required",
      });
    }

    const store = await prisma.store.create({
      data: {
        distributorId: req.user.distributorId,
        name,
        ownerName: ownerName || undefined,
        phone: phone || undefined,
        address: address || undefined,
        latitude:
          latitude !== undefined ? Number(latitude) : undefined,
        longitude:
          longitude !== undefined ? Number(longitude) : undefined,
      },
    });

    return res.status(201).json({
      success: true,
      data: {
        store,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/stores?isActive=true
// Owner + Delivery Boy
async function listStores(req, res, next) {
  try {
    const { isActive } = req.query;

    const where = {
      distributorId: req.context?.distributorId ?? req.user.distributorId,
      ...(isActive !== undefined
        ? { isActive: isActive === "true" }
        : {}),
    };

    const stores = await prisma.store.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        stores,
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/stores/:id
// Owner + Delivery Boy
async function getStore(req, res, next) {
  try {
    const store = await prisma.store.findFirst({
      where: {
        id: Number(req.params.id),
        distributorId: req.context?.distributorId ?? req.user.distributorId,
      },
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        store,
      },
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/stores/:id
// Owner only
async function updateStore(req, res, next) {
  try {
    const storeId = Number(req.params.id);

    const existing = await prisma.store.findFirst({
      where: {
        id: storeId,
        distributorId: req.user.distributorId,
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const {
      name,
      ownerName,
      phone,
      address,
      latitude,
      longitude,
      isActive,
    } = req.body;

    const store = await prisma.store.update({
      where: {
        id: existing.id,
      },
      data: {
        name: name ?? undefined,
        ownerName: ownerName ?? undefined,
        phone: phone ?? undefined,
        address: address ?? undefined,
        latitude:
          latitude !== undefined ? Number(latitude) : undefined,
        longitude:
          longitude !== undefined ? Number(longitude) : undefined,
        isActive: isActive ?? undefined,
      },
    });

    return res.status(200).json({
      success: true,
      data: {
        store,
      },
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/stores/:id
// Owner only
// Soft delete
async function deleteStore(req, res, next) {
  try {
    const storeId = Number(req.params.id);

    const existing = await prisma.store.findFirst({
      where: {
        id: storeId,
        distributorId: req.user.distributorId,
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    await prisma.store.update({
      where: {
        id: existing.id,
      },
      data: {
        isActive: false,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Store deactivated",
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createStore,
  listStores,
  getStore,
  updateStore,
  deleteStore,
};