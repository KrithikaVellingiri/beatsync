const express = require("express");
const {
  createStore,
  listStores,
  getStore,
  updateStore,
  deleteStore,
} = require("../controllers/store.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const { resolveDistributorContext } = require("../middleware/distributor-context.middleware");

const router = express.Router();

// All store routes require a logged-in user
router.use(authenticate);

// Both owner and delivery_boy can view stores (delivery boys need this for "My Beat")
router.get("/", resolveDistributorContext, listStores);
router.get("/:id", resolveDistributorContext, getStore);

// Only owners can manage store data
router.post("/", authorize("owner"), createStore);
router.put("/:id", authorize("owner"), updateStore);
router.delete("/:id", authorize("owner"), deleteStore);

module.exports = router;