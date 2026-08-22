const bcrypt = require("bcrypt");
const { randomInt } = require("crypto");
const { OAuth2Client } = require("google-auth-library");

const prisma = require("../lib/prisma");
const { signToken } = require("../utils/jwt");
const { sanitizeUser } = require("../utils/sanitize");

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const SALT_ROUNDS = 10;

async function createDistributorCode(name, client = prisma) {
  const prefix = (name || "TEAM")
    .replace(/[^a-z0-9]/gi, "")
    .slice(0, 5)
    .toUpperCase()
    .padEnd(4, "X");

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = `${prefix}${randomInt(10, 100)}`;
    const existing = await client.distributor.findUnique({ where: { code } });
    if (!existing) return code;
  }

  throw new Error("Unable to generate a unique distributor code");
}

// POST /api/auth/register-owner
async function registerOwner(req, res, next) {
  try {
    const {
      distributorName,
      ownerName,
      phone,
      email,
      password,
    } = req.body;

    if (!distributorName || !ownerName || !phone || !password) {
      return res.status(400).json({
        success: false,
        message:
          "distributorName, ownerName, phone and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this phone number already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const result = await prisma.$transaction(async (tx) => {
      const distributor = await tx.distributor.create({
        data: {
          name: distributorName,
          code: await createDistributorCode(distributorName, tx),
          phone,
          email: email || null,
        },
      });

      const user = await tx.user.create({
        data: {
          distributorId: distributor.id,
          name: ownerName,
          phone,
          email: email || null,
          passwordHash,
          role: "owner",
        },
      });

      return {
        distributor,
        user,
      };
    });

    const token = signToken({
      userId: result.user.id,
      distributorId: result.distributor.id,
      role: result.user.role,
    });

    return res.status(201).json({
      success: true,
      message: "Owner and distributor account created",
      data: {
        token,
        isNewUser: true,
        user: sanitizeUser(result.user),
        distributor: result.distributor,
      },
    });
  } catch (error) {
    next(error);
  }
}


// POST /api/auth/register-delivery-boy
async function registerDeliveryBoy(req, res, next) {
  try {
    const {
      name,
      phone,
      email,
      password,
    } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "name, phone and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this phone number already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        distributorId: null,
        name,
        phone,
        email: email || null,
        passwordHash,
        role: "delivery_boy",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Delivery boy account created",
      data: {
        token: signToken({
          userId: user.id,
          distributorId: null,
          role: user.role,
        }),
        isNewUser: true,
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
}


// POST /api/auth/login
async function login(req, res, next) {
  try {
    const {
      phone,
      password,
    } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: "phone and password are required",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: phone },
          { email: phone }
        ]
      },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone number or password",
      });
    }

    const passwordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid phone number or password",
      });
    }

    const token = signToken({
      userId: user.id,
      distributorId: user.distributorId,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        isNewUser: false,
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
}


// GET /api/auth/me
async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        distributor: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/google
async function googleAuth(req, res) {
  try {
    const { token: idToken, role } = req.body;

    if (!idToken || !role) {
      return res.status(400).json({ success: false, message: "token and role are required" });
    }
    if (role !== "owner" && role !== "delivery_boy") {
      return res.status(400).json({ success: false, message: "Invalid role" });
    }

    const client = new OAuth2Client();
    
    const ticket = await client.verifyIdToken({
      idToken,
      audience: [
        process.env.GOOGLE_CLIENT_ID_WEB,
        process.env.GOOGLE_CLIENT_ID_ANDROID,
        process.env.GOOGLE_CLIENT_ID_IOS
      ].filter(Boolean)
    });
    const payload = ticket.getPayload();
    const email = payload.email;

    if (!email) {
      return res.status(400).json({ success: false, message: "Google account has no email" });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { phone: email }
        ]
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "No active account found with this Google email. Please sign up first.",
      });
    }

    const token = signToken({
      userId: user.id,
      distributorId: user.distributorId,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      message: "Google Login successful",
      data: {
        token,
        isNewUser: false,
        user: sanitizeUser(user),
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(401).json({ success: false, message: "Invalid Google Token" });
  }
}

module.exports = {
  registerOwner,
  registerDeliveryBoy,
  login,
  googleAuth,
  me,
};