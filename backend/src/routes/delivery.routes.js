const express = require("express");

const {
  getMyBeat,
  getVisitDetails,
  startVisit,
  completeVisit,
  addDeliveryItems,
  addPayment,
  addReturn,
  addCreditPromise,
} = require("../controllers/delivery.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

// Delivery boy's published beat
router.get(
  "/my-beat",
  authorize("delivery_boy"),
  getMyBeat
);

// Open a specific assigned store
router.get(
  "/stores/:assignmentStoreId",
  authorize("delivery_boy"),
  getVisitDetails
);

// Start visit
router.post(
  "/visits/:assignmentStoreId/start",
  authorize("delivery_boy"),
  startVisit
);

// Record delivered products
router.post(
  "/visits/:visitId/items",
  authorize("delivery_boy"),
  addDeliveryItems
);

// Record payment
router.post(
  "/visits/:visitId/payment",
  authorize("delivery_boy"),
  addPayment
);

// Record return
router.post(
  "/visits/:visitId/returns",
  authorize("delivery_boy"),
  addReturn
);

// Record credit promise
router.post(
  "/visits/:visitId/credit",
  authorize("delivery_boy"),
  addCreditPromise
);

// Complete visit
router.post(
  "/visits/:visitId/complete",
  authorize("delivery_boy"),
  completeVisit
);

module.exports = router;