const prisma = require('./src/lib/prisma');

async function main() {
  const dists = await prisma.distributor.findMany({
    select: { id: true, code: true, name: true }
  });
  console.log("DISTRIBUTORS:", dists);

  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true }
  });
  console.log("USERS:", users);
}

main().finally(() => prisma.$disconnect());
