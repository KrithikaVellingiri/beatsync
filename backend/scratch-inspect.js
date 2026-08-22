require("dotenv").config();
const prisma = require("./src/lib/prisma");
const { signToken } = require("./src/utils/jwt");

async function run() {
  const token = signToken({
    userId: 7,
    distributorId: 4,
    role: "owner",
  });
  console.log("Token:", token);

  const res = await globalThis.fetch("http://localhost:5000/api/stores", {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  console.log("Stores response:", JSON.stringify(data, null, 2));
}
run();
