const Joi = require("joi");

// User validation schemas
const userRegisterSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const userUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional(),
});

// Turf validation schemas
const turfCreateSchema = Joi.object({
  name: Joi.string().required().min(3).max(100),
  location: Joi.string().required(),
  description: Joi.string().required(),
  type: Joi.string().valid("TURF", "STADIUM", "PLAYGROUND").required(),
  pricePerHour: Joi.number().required().min(0),
  imageUrl: Joi.string().uri().optional(),
});

const turfUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  location: Joi.string().optional(),
  description: Joi.string().optional(),
  type: Joi.string().valid("TURF", "STADIUM", "PLAYGROUND").optional(),
  pricePerHour: Joi.number().min(0).optional(),
  imageUrl: Joi.string().uri().optional(),
});

// Booking validation schemas
const bookingCreateSchema = Joi.object({
  turfId: Joi.number().integer().required(),
  date: Joi.date().iso().required(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().required(),
  eventName: Joi.string().optional(),
}).custom((value, helpers) => {
  const { startTime, endTime } = value;

  if (new Date(startTime) >= new Date(endTime)) {
    return helpers.error("any.invalid", {
      message: "End time must be after start time",
    });
  }

  return value;
});

const bookingAvailabilitySchema = Joi.object({
  date: Joi.date().iso().required(),
});

module.exports = {
  userRegisterSchema,
  userLoginSchema,
  userUpdateSchema,
  turfCreateSchema,
  turfUpdateSchema,
  bookingCreateSchema,
  bookingAvailabilitySchema,
};
