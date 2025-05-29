const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createPaymentIntent,
  confirmPayment,
} = require("../controllers/paymentController");

const router = express.Router();

// Protected routes
router.post("/create-intent", protect, createPaymentIntent);
router.post("/confirm", protect, confirmPayment);

module.exports = router;
