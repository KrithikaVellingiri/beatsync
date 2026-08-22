const express = require("express");

const {
  registerOwner,
  registerDeliveryBoy,
  login,
  googleAuth,
  me,
} = require("../controllers/auth.controller");

const { authenticate, authorize } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register-owner", registerOwner);

router.post("/register-delivery-boy", registerDeliveryBoy);

router.post("/login", login);

router.post("/google", googleAuth);

router.get(
  "/me",
  authenticate,
  me
);

module.exports = router;