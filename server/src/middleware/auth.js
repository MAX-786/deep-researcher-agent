import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler.js';

/**
 * Middleware to verify JWT token
 */
export const authenticateToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (!token) {
    throw new ApiError('Authentication token is required', 401);
  }
  
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new ApiError('Invalid or expired token', 401);
  }
};

/**
 * Optional authentication - doesn't throw error if token is missing
 */
export const optionalAuth = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN format
  
  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Just continue without setting user
    }
  }
  
  next();
};
