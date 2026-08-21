const prisma = require("../lib/prisma");

// POST /api/skus  (owner only)
async function createSku(req, res, next) {
  try {
    const { name, code, unit, price } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "name and price are required",
      });
    }

    const sku = await prisma.sKU.create({
      data: {
        distributorId: req.user.distributorId,
        name,
        code: code || undefined,
        unit: unit || undefined,
        price: Number(price),
      },
    });

    return res.status(201).json({ success: true, data: { sku } });
  } catch (err) {
    next(err);
  }
}

// GET /api/skus?isActive=true
async function listSkus(req, res, next) {
  try {
    const { isActive } = req.query;

    const where = {
      distributorId: req.context?.distributorId ?? req.user.distributorId,
      ...(isActive !== undefined ? { isActive: isActive === "true" } : {}),
    };

    const skus = await prisma.sKU.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, data: { skus } });
  } catch (err) {
    next(err);
  }
}

// GET /api/skus/:id
async function getSku(req, res, next) {
  try {
    const sku = await prisma.sKU.findFirst({
      where: { id: req.params.id, distributorId: req.context?.distributorId ?? req.user.distributorId },
    });

    if (!sku) {
      return res.status(404).json({ success: false, message: "SKU not found" });
    }

    return res.status(200).json({ success: true, data: { sku } });
  } catch (err) {
    next(err);
  }
}

// PUT /api/skus/:id  (owner only)
async function updateSku(req, res, next) {
  try {
    const existing = await prisma.sKU.findFirst({
      where: { id: req.params.id, distributorId: req.user.distributorId },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "SKU not found" });
    }

    const { name, code, unit, price, isActive } = req.body;

    const sku = await prisma.sKU.update({
      where: { id: existing.id },
      data: {
        name: name ?? undefined,
        code: code ?? undefined,
        unit: unit ?? undefined,
        price: price !== undefined ? Number(price) : undefined,
        isActive: isActive ?? undefined,
      },
    });

    return res.status(200).json({ success: true, data: { sku } });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/skus/:id  (owner only) — soft delete
async function deleteSku(req, res, next) {
  try {
    const existing = await prisma.sKU.findFirst({
      where: { id: req.params.id, distributorId: req.user.distributorId },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: "SKU not found" });
    }

    await prisma.sKU.update({
      where: { id: existing.id },
      data: { isActive: false },
    });

    return res.status(200).json({ success: true, message: "SKU deactivated" });
  } catch (err) {
    next(err);
  }
}

module.exports = { createSku, listSkus, getSku, updateSku, deleteSku };