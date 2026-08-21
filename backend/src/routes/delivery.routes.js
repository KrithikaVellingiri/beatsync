const express = require("express");

const {
  getMyBeat,
  getVisitDetails,
  getProducts,
  startVisit,
  completeVisit,
  addDeliveryItems,
  updateDeliveryItem,
  removeDeliveryItem,
  addPayment,
  addReturn,
  addCreditPromise,
  getOwnerContact,
} = require("../controllers/delivery.controller");

const {
  authenticate,
  authorize,
} = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

// ---------------------------------------------------------
// DELIVERY BOY'S BEAT
// ---------------------------------------------------------

router.get(
  "/my-beat",
  authorize("delivery_boy"),
  getMyBeat
);

// ---------------------------------------------------------
// STORE
// ---------------------------------------------------------

router.get(
  "/stores/:assignmentStoreId",
  authorize("delivery_boy"),
  getVisitDetails
);

// ---------------------------------------------------------
// START VISIT
// ---------------------------------------------------------

router.post(
  "/visits/:assignmentStoreId/start",
  authorize("delivery_boy"),
  startVisit
);

// ---------------------------------------------------------
// PRODUCTS
// ---------------------------------------------------------

router.get(
  "/visits/:visitId/products",
  authorize("delivery_boy"),
  getProducts
);

// ---------------------------------------------------------
// ACTUAL DELIVERY
// ---------------------------------------------------------

router.post(
  "/visits/:visitId/items",
  authorize("delivery_boy"),
  addDeliveryItems
);

// ---------------------------------------------------------
// PAYMENT
// ---------------------------------------------------------

router.post(
  "/visits/:visitId/payment",
  authorize("delivery_boy"),
  addPayment
);

// ---------------------------------------------------------
// RETURNS
// ---------------------------------------------------------

router.post(
  "/visits/:visitId/returns",
  authorize("delivery_boy"),
  addReturn
);

// ---------------------------------------------------------
// CREDIT PROMISE
// ---------------------------------------------------------

router.post(
  "/visits/:visitId/credit",
  authorize("delivery_boy"),
  addCreditPromise
);

// ---------------------------------------------------------
// COMPLETE VISIT
// ---------------------------------------------------------

router.post(
  "/visits/:visitId/complete",
  authorize("delivery_boy"),
  completeVisit
);
router.put(
  "/visits/:visitId/items/:skuId",
  authorize("delivery_boy"),
  updateDeliveryItem
);

router.delete(
  "/visits/:visitId/items/:skuId",
  authorize("delivery_boy"),
  removeDeliveryItem
);
router.get(
  "/owner-contact",
  authorize("delivery_boy"),
  getOwnerContact
);

module.exports = router;