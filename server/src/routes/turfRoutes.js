const express = require("express");
const {
  addTurf,
  updateTurf,
  deleteTurf,
  getAllTurfs,
  searchTurfs,
  getTurfById,
} = require("../controllers/turfController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");
const {
  turfCreateSchema,
  turfUpdateSchema,
} = require("../utils/validationSchemas");

const router = express.Router();

// Public routes
router.get("/", getAllTurfs);
router.get("/search", searchTurfs);
router.get("/:id", getTurfById);

// Admin routes
router.post(
  "/",
  protect,
  restrictTo("ADMIN"),
  validate(turfCreateSchema),
  addTurf
);
router.put(
  "/:id",
  protect,
  restrictTo("ADMIN"),
  validate(turfUpdateSchema),
  updateTurf
);
router.delete("/:id", protect, restrictTo("ADMIN"), deleteTurf);

module.exports = router;
