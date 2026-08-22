const axios = require("axios");

const API = "http://localhost:5000/api/auth";

async function run() {
  console.log("--- Starting Test Flow ---");

  const ownerPhone = "1234567890";
  const ownerEmail = "owner@test.com";
  const deliveryPhone = "0987654321";
  const deliveryEmail = "delivery@test.com";
  const pass = "password123";

  const makeReq = async (url, payload) => {
    try {
      const { data } = await axios.post(url, payload);
      console.log("Success:", data.message || "OK");
    } catch (e) {
      console.log("Failed:", e.response?.data?.message || e.message);
    }
  };

  // 1. Owner Signup
  console.log("\n1. Owner Signup (Email + Phone)");
  await makeReq(`${API}/register-owner`, {
    distributorName: "Test Dist",
    ownerName: "Test Owner",
    email: ownerEmail,
    phone: ownerPhone,
    password: pass
  });

  // 2. Owner Login (Phone)
  console.log("\n2. Owner Login (Phone)");
  await makeReq(`${API}/login`, { phone: ownerPhone, password: pass });

  // 3. Owner Login (Email)
  console.log("\n3. Owner Login (Email)");
  await makeReq(`${API}/login`, { phone: ownerEmail, password: pass });

  // 4. Delivery Signup
  console.log("\n4. Delivery Signup (Email + Phone)");
  await makeReq(`${API}/register-delivery-boy`, {
    name: "Test Delivery",
    email: deliveryEmail,
    phone: deliveryPhone,
    password: pass
  });

  // 5. Delivery Login (Phone)
  console.log("\n5. Delivery Login (Phone)");
  await makeReq(`${API}/login`, { phone: deliveryPhone, password: pass });

  // 6. Delivery Login (Email)
  console.log("\n6. Delivery Login (Email)");
  await makeReq(`${API}/login`, { phone: deliveryEmail, password: pass });

  console.log("\n--- Finished Test Flow ---");
}

run().catch(console.error);
