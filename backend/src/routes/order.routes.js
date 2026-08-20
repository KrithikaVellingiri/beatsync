const express = require("express");

const {
  createOrder,
  getMyOrders,
  getPendingOrders,
} = require("../controllers/order.controller");

const {
  authenticateStoreOwner,
} = require("../middleware/storeOwner.middleware");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

// Store Owner
router.post(
  "/",
  authenticateStoreOwner,
  createOrder
);

router.get(
  "/my-orders",
  authenticateStoreOwner,
  getMyOrders
);

// Distributor Owner
router.get(
  "/pending",
  authenticate,
  authorize("owner"),
  getPendingOrders
);

module.exports = router;