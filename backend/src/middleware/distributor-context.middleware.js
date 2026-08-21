const prisma = require("../lib/prisma");

async function resolveDistributorContext(req, res, next) {
  try {
    if (req.user.role === "owner") {
      if (!req.user.distributorId) {
        return res.status(403).json({
          success: false,
          message: "Owner distributor context is unavailable",
        });
      }

      req.context = { distributorId: req.user.distributorId };
      return next();
    }

    const headerValue = req.get("X-Distributor-Id");
    const distributorId = Number(headerValue);

    if (!headerValue || !Number.isInteger(distributorId)) {
      return res.status(400).json({
        success: false,
        message: "A valid X-Distributor-Id header is required",
      });
    }

    const membership = await prisma.distributorMember.findUnique({
      where: {
        userId_distributorId: {
          userId: req.user.id,
          distributorId,
        },
      },
      select: { status: true },
    });

    if (!membership || membership.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "You are not an active member of this distributor",
      });
    }

    req.context = { distributorId };
    return next();
  } catch (error) {
    next(error);
  }
}

module.exports = { resolveDistributorContext };