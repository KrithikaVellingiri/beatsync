require("dotenv").config();
const prisma = require("./src/lib/prisma");

async function run() {
  const idsToDelete = [1, 2, 3];
  for (const id of idsToDelete) {
    try {
      await prisma.distributor.delete({
        where: { id }
      });
      console.log(`Deleted Distributor ID ${id}`);
    } catch (err) {
      console.log(`Could not delete Distributor ID ${id}:`, err.message);
    }
  }
}
run().catch(console.error);
