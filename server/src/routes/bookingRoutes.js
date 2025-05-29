const express = require("express");
const {
  checkAvailability,
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookings,
} = require("../controllers/bookingController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");
const {
  bookingCreateSchema,
  bookingAvailabilitySchema,
} = require("../utils/validationSchemas");

const router = express.Router();

// Public routes
router.get(
  "/availability/:turfId",
  validate(bookingAvailabilitySchema, "query"),
  checkAvailability
);

// Protected routes
router.post("/", protect, validate(bookingCreateSchema), createBooking);
router.get("/", protect, getUserBookings);
router.delete("/:id", protect, cancelBooking);

// Admin routes
router.get("/admin", protect, restrictTo("ADMIN"), getAllBookings);

module.exports = router;
