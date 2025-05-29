const { verifyToken } = require("../utils/jwtUtils");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Protect routes - Verify if user is authenticated
 */
const protect = async (req, res, next) => {
  try {
    // 1) Get token from Authorization header
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "You are not logged in! Please log in to get access.",
      });
    }

    // 2) Verify token
    const decoded = verifyToken(token);

    // 3) Check if user still exists
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!currentUser) {
      return res.status(401).json({
        message: "The user belonging to this token no longer exists.",
      });
    }

    // 4) Grant access to protected route
    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token. Please log in again.",
    });
  }
};

/**
 * Restrict routes to specific roles
 * @param  {...String} roles - Roles allowed to access the route
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo,
};
