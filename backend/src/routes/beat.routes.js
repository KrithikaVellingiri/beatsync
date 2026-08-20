const express = require("express");

const {
  generateBeat,
  getBeat,
  reassignStore,
  publishBeat,
} = require("../controllers/beat.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

// Generate today's beat
router.post(
  "/generate",
  authorize("owner"),
  generateBeat
);

// View complete beat
router.get(
  "/:id",
  authorize("owner"),
  getBeat
);

// Manually move a store to another delivery boy
router.put(
  "/:beatId/stores/:assignmentStoreId/assign",
  authorize("owner"),
  reassignStore
);

// Publish beat
router.post(
  "/:id/publish",
  authorize("owner"),
  publishBeat
);

module.exports = router;