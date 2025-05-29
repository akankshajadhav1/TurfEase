const express = require("express");
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validationMiddleware");
const {
  userRegisterSchema,
  userLoginSchema,
  userUpdateSchema,
} = require("../utils/validationSchemas");

const router = express.Router();

// Public routes
router.post("/register", validate(userRegisterSchema), register);
router.post("/login", validate(userLoginSchema), login);

// Protected routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, validate(userUpdateSchema), updateProfile);

module.exports = router;
