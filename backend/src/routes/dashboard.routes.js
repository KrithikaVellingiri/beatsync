const express = require("express");

const {
  getOwnerDashboard,
} = require("../controllers/dashboard.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.get(
  "/owner",
  authorize("owner"),
  getOwnerDashboard
);

module.exports = router;