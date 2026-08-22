require('dotenv').config();
const prisma = require('./src/lib/prisma');

async function main() {
  try {
    const user = await prisma.user.findUnique({
      where: { phone: '123' }
    });
    console.log("USER:", user);
  } catch (e) {
    console.log("PRISMA ERROR:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
