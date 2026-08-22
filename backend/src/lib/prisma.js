const { PrismaClient } = require("@prisma/client");
const { PrismaPostgresAdapter } = require("@prisma/adapter-ppg");

const adapter = new PrismaPostgresAdapter({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

module.exports = prisma;