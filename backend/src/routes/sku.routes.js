const express = require("express");
const {
  createSku,
  listSkus,
  getSku,
  updateSku,
  deleteSku,
} = require("../controllers/sku.controller");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const { resolveDistributorContext } = require("../middleware/distributor-context.middleware");

const router = express.Router();

// All SKU routes require a logged-in user
router.use(authenticate);

// Both owner and delivery_boy can view the product catalog
router.get("/", resolveDistributorContext, listSkus);
router.get("/:id", resolveDistributorContext, getSku);

// Only owners can manage the product catalog
router.post("/", authorize("owner"), createSku);
router.put("/:id", authorize("owner"), updateSku);
router.delete("/:id", authorize("owner"), deleteSku);

module.exports = router;