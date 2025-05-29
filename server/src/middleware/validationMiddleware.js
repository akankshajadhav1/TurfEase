/**
 * Validate request data against a Joi schema
 * @param {Object} schema - Joi schema
 * @param {String} source - Request property to validate (body, params, query)
 * @returns {Function} Express middleware
 */
const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(", ");
      return res.status(400).json({
        message: "Validation error",
        errors: errorMessage,
      });
    }

    next();
  };
};

module.exports = validate;
