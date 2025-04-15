import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { optionalAuth } from '../middleware/auth.js';
import { ApiError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';
import { documentService } from '../services/documentService.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// File filter to only allow PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new ApiError('Only PDF files are allowed', 400), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

/**
 * @route POST /api/upload
 * @desc Upload a PDF document
 * @access Public (with optional auth)
 */
router.post('/', optionalAuth, upload.single('file'), async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      throw new ApiError('No file uploaded', 400);
    }
    
    // Log the upload
    logger.info('File upload received', {
      filename: req.file.originalname,
      size: req.file.size,
      userId: req.user?.id || 'anonymous'
    });
    
    // Process the uploaded document
    const document = await documentService.processDocument(req.file);
    
    // Return document info
    res.status(201).json({
      message: 'File uploaded successfully',
      document
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET /api/upload/:id
 * @desc Get document information
 * @access Public (with optional auth)
 */
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Get document info
    const document = await documentService.getDocument(id);
    
    if (!document) {
      throw new ApiError('Document not found', 404);
    }
    
    // Return document info
    res.json(document);
  } catch (error) {
    next(error);
  }
});

export default router;
