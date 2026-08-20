const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

function generateStoreOwnerToken(storeOwner) {
  return jwt.sign(
    {
      storeOwnerId: storeOwner.id,
      storeId: storeOwner.storeId,
      type: "store_owner",
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

// POST /api/store-owner/register
async function registerStoreOwner(req, res, next) {
  try {
    const {
      storeId,
      name,
      phone,
      email,
      password,
    } = req.body;

    if (!storeId || !name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "storeId, name, phone and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const store = await prisma.store.findUnique({
      where: {
        id: Number(storeId),
      },
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    if (!store.isActive) {
      return res.status(400).json({
        success: false,
        message: "Store is inactive",
      });
    }

    const existingPhone = await prisma.storeOwner.findUnique({
      where: {
        phone,
      },
    });

    if (existingPhone) {
      return res.status(409).json({
        success: false,
        message: "Store owner with this phone already exists",
      });
    }

    const existingStoreOwner = await prisma.storeOwner.findUnique({
      where: {
        storeId: Number(storeId),
      },
    });

    if (existingStoreOwner) {
      return res.status(409).json({
        success: false,
        message: "This store already has a store owner account",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const storeOwner = await prisma.storeOwner.create({
      data: {
        storeId: Number(storeId),
        name,
        phone,
        email: email || undefined,
        passwordHash,
      },
    });

    const token = generateStoreOwnerToken(storeOwner);

    return res.status(201).json({
      success: true,
      message: "Store owner account created",
      data: {
        token,
        storeOwner: {
          id: storeOwner.id,
          storeId: storeOwner.storeId,
          name: storeOwner.name,
          phone: storeOwner.phone,
          email: storeOwner.email,
          isActive: storeOwner.isActive,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/store-owner/login
async function loginStoreOwner(req, res, next) {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "phone and password are required",
      });
    }

    const storeOwner = await prisma.storeOwner.findUnique({
      where: {
        phone,
      },
    });

    if (!storeOwner) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone or password",
      });
    }

    if (!storeOwner.isActive) {
      return res.status(403).json({
        success: false,
        message: "Store owner account is inactive",
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      storeOwner.passwordHash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone or password",
      });
    }

    const token = generateStoreOwnerToken(storeOwner);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        storeOwner: {
          id: storeOwner.id,
          storeId: storeOwner.storeId,
          name: storeOwner.name,
          phone: storeOwner.phone,
          email: storeOwner.email,
          isActive: storeOwner.isActive,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/store-owner/me
async function getMe(req, res, next) {
  try {
    const storeOwner = req.storeOwner;

    return res.status(200).json({
      success: true,
      data: {
        storeOwner: {
          id: storeOwner.id,
          storeId: storeOwner.storeId,
          name: storeOwner.name,
          phone: storeOwner.phone,
          email: storeOwner.email,
          isActive: storeOwner.isActive,
          store: {
            id: storeOwner.store.id,
            name: storeOwner.store.name,
            address: storeOwner.store.address,
            locality: storeOwner.store.locality,
          },
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  registerStoreOwner,
  loginStoreOwner,
  getMe,
};