import express from 'express';
import { optionalAuth } from '../middleware/auth.js';
import { ApiError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { llmService } from '../services/llmService.js';

const router = express.Router();

/**
 * @route POST /api/chat
 * @desc Process a chat message and get AI response
 * @access Public (with optional auth)
 */
router.post('/', optionalAuth, async (req, res, next) => {
  try {
    const { messages } = req.body;
    
    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new ApiError('Messages array is required', 400);
    }
    
    // Log the request (excluding sensitive data)
    logger.info('Chat request received', {
      messageCount: messages.length,
      userId: req.user?.id || 'anonymous'
    });
    
    // Process the message through the LLM service
    const response = await llmService.generateResponse(messages);
    
    // Return the response
    res.json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST /api/chat/with-context
 * @desc Process a chat message with document context
 * @access Public (with optional auth)
 */
router.post('/with-context', optionalAuth, async (req, res, next) => {
  try {
    const { messages, documentIds } = req.body;
    
    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      throw new ApiError('Messages array is required', 400);
    }
    
    if (!documentIds || !Array.isArray(documentIds)) {
      throw new ApiError('Document IDs array is required', 400);
    }
    
    // Log the request
    logger.info('Chat with context request received', {
      messageCount: messages.length,
      documentCount: documentIds.length,
      userId: req.user?.id || 'anonymous'
    });
    
    // Process the message with context through the LLM service
    const response = await llmService.generateResponseWithContext(messages, documentIds);
    
    // Return the response
    res.json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
