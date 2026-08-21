const express = require("express");

const {
  getStoreLedger,
} = require("../controllers/ledger.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.get(
  "/stores/:storeId",
  authorize("owner"),
  getStoreLedger
);

module.exports = router;