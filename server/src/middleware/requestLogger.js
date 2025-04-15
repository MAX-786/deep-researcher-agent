import { logger } from '../utils/logger.js';

/**
 * Middleware to log all incoming requests
 */
export const requestLogger = (req, res, next) => {
  // Log request details
  logger.info(`Incoming request`, {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  next();
};
