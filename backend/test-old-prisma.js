require('dotenv').config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

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
