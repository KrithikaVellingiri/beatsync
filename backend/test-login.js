const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: '123' },
          { email: '123' }
        ]
      }
    });
    console.log(user);
  } catch (e) {
    console.log("PRISMA ERROR:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
