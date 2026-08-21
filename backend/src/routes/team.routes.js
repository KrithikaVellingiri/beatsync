const express = require("express");
const { authenticate } = require("../middleware/auth.middleware");
const {
  previewDistributor,
  listMyDistributors,
  joinDistributor,
} = require("../controllers/team.controller");

const router = express.Router();
router.use(authenticate);

router.get("/distributor/mine", listMyDistributors);
router.post("/distributor/preview/:code", previewDistributor);
router.post("/distributor/join", joinDistributor);

module.exports = router;