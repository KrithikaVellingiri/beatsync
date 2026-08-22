const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const dists = await prisma.distributor.findMany({
    select: { code: true, name: true, ownerId: true }
  });
  console.log("DISTRIBUTORS:", dists);

  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true }
  });
  console.log("USERS:", users);
}

main().finally(() => prisma.$disconnect());
