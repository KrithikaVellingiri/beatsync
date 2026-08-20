const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

async function authenticateStoreOwner(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type !== "store_owner") {
      return res.status(403).json({
        success: false,
        message: "Store owner access required",
      });
    }

    const storeOwner = await prisma.storeOwner.findUnique({
      where: {
        id: decoded.storeOwnerId,
      },
      include: {
        store: true,
      },
    });

    if (!storeOwner || !storeOwner.isActive) {
      return res.status(401).json({
        success: false,
        message: "Store owner account is inactive or not found",
      });
    }

    req.storeOwner = storeOwner;

    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Authentication token expired",
      });
    }

    next(err);
  }
}

module.exports = {
  authenticateStoreOwner,
};