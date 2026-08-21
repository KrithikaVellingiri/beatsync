const express = require("express");

const {
  getReconciliation,
} = require("../controllers/reconciliation.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.get(
  "/beats/:beatId",
  authorize("owner"),
  getReconciliation
);

module.exports = router;