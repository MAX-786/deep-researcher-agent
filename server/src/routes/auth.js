import express from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../middleware/errorHandler.js';

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @desc Authenticate user & get token
 * @access Public
 */
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    
    // For demo purposes only - in production, validate against database
    if (username === 'demo' && password === 'password') {
      // Create JWT payload
      const payload = {
        user: {
          id: '1',
          username: 'demo'
        }
      };
      
      // Sign the token
      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } else {
      throw new ApiError('Invalid credentials', 401);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/auth/user
 * @desc Get user data
 * @access Private
 */
router.get('/user', async (req, res, next) => {
  try {
    // This route would normally use the authenticateToken middleware
    // and return user data from the database
    res.json({
      message: 'Protected route - user data would be returned here'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
