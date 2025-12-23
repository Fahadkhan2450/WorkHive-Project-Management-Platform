import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

// Verify JWT Token Middleware
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(errorHandler(401, "Not authenticated"));
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    return next(errorHandler(401, "Token invalid or expired"));
  }
};

// Admin Only Middleware
export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return next(errorHandler(401, "Unauthorized"));
  }

  if (req.user.role !== "admin") {
    return next(errorHandler(403, "Access denied, admin only"));
  }

  next();
};
