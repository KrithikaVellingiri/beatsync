const prisma = require("../lib/prisma");

function normalizeCode(value) {
  return typeof value === "string" ? value.trim().toUpperCase() : "";
}

function requireDeliveryBoy(req, res) {
  if (req.user.role !== "delivery_boy") {
    res.status(403).json({ success: false, message: "Only delivery boys can join distributors" });
    return false;
  }
  return true;
}

async function previewDistributor(req, res, next) {
  try {
    if (!requireDeliveryBoy(req, res)) return;
    const code = normalizeCode(req.params.code);
    const distributor = await prisma.distributor.findUnique({
      where: { code },
      select: { id: true, name: true, code: true, phone: true, email: true },
    });

    if (!distributor) {
      return res.status(404).json({ success: false, message: "Invalid team code. Please check the code with your distributor." });
    }

    return res.json({ success: true, data: { distributor } });
  } catch (error) {
    next(error);
  }
}

async function listMyDistributors(req, res, next) {
  try {
    if (!requireDeliveryBoy(req, res)) return;
    const memberships = await prisma.distributorMember.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "asc" },
      include: { distributor: { select: { id: true, name: true, code: true, phone: true, email: true } } },
    });

    return res.json({ success: true, data: { distributors: memberships } });
  } catch (error) {
    next(error);
  }
}

async function joinDistributor(req, res, next) {
  try {
    if (!requireDeliveryBoy(req, res)) return;
    const code = normalizeCode(req.body.teamCode || req.body.code);
    if (!code) return res.status(400).json({ success: false, message: "teamCode is required" });

    const distributor = await prisma.distributor.findUnique({ where: { code } });
    if (!distributor) {
      return res.status(404).json({ success: false, message: "Invalid team code. Please check the code with your distributor." });
    }

    const existing = await prisma.distributorMember.findUnique({
      where: { userId_distributorId: { userId: req.user.id, distributorId: distributor.id } },
    });

    if (existing?.status === "active") {
      return res.status(409).json({ success: false, message: `You're already a member of ${distributor.name}.` });
    }

    const membership = await prisma.$transaction(async (tx) => {
      const createdMembership = await tx.distributorMember.upsert({
        where: { userId_distributorId: { userId: req.user.id, distributorId: distributor.id } },
        update: { status: "active" },
        create: { userId: req.user.id, distributorId: distributor.id, status: "active" },
        include: { distributor: { select: { id: true, name: true, code: true, phone: true, email: true } } },
      });

      // Keep the existing distributor-scoped APIs usable as the default context.
      await tx.user.updateMany({
        where: { id: req.user.id, distributorId: null },
        data: { distributorId: distributor.id },
      });

      return createdMembership;
    });

    return res.status(201).json({
      success: true,
      message: `Joined ${distributor.name}.`,
      data: {
        membership,
        activeDistributorId: distributor.id,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function getDistributorTeam(req, res, next) {
  try {
    if (req.user.role !== "owner") {
       return res.status(403).json({ success: false, message: "Only owners can view the team" });
    }
    
    const team = await prisma.user.findMany({
      where: {
        memberships: {
          some: {
            distributorId: req.user.distributorId,
            status: "active",
          },
        },
        role: "delivery_boy",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return res.json({ success: true, data: { team } });
  } catch (error) {
    next(error);
  }
}

module.exports = { previewDistributor, listMyDistributors, joinDistributor, getDistributorTeam };