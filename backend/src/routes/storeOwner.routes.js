const express = require("express");

const {
  registerStoreOwner,
  loginStoreOwner,
  getMe,
} = require("../controllers/storeOwner.controller");

const {
  authenticateStoreOwner,
} = require("../middleware/storeOwner.middleware");

const router = express.Router();

router.post("/register", registerStoreOwner);

router.post("/login", loginStoreOwner);

router.get("/me", authenticateStoreOwner, getMe);

module.exports = router;