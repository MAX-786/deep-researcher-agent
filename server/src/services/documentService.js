import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';
import { ApiError } from '../middleware/errorHandler.js';

/**
 * Service for handling document processing and storage
 */
class DocumentService {
  constructor() {
    // In-memory document storage for demo purposes
    // In a real application, this would use a database
    this.documents = new Map();
    
    // Ensure uploads directory exists
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads', { recursive: true });
    }
  }
  
  /**
   * Process an uploaded document
   * @param {Object} file - The uploaded file object from multer
   * @returns {Object} - Document metadata
   */
  async processDocument(file) {
    try {
      logger.info('Processing document', { 
        filename: file.originalname,
        size: file.size
      });
      
      // Generate a unique ID for the document
      const documentId = uuidv4();
      
      // In a real implementation, this would:
      // 1. Extract text from the PDF
      // 2. Split the text into chunks
      // 3. Generate embeddings for each chunk
      // 4. Store the chunks and embeddings in a database
      
      // For demo purposes, we'll just store basic metadata
      const document = {
        id: documentId,
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimeType: file.mimetype,
        uploadDate: new Date(),
        status: 'processed',
        chunks: 0, // Would be the actual number of chunks in real implementation
      };
      
      // Store document metadata
      this.documents.set(documentId, document);
      
      logger.info('Document processed successfully', { documentId });
      
      return document;
    } catch (error) {
      logger.error('Error processing document', { error: error.message });
      throw new ApiError(`Failed to process document: ${error.message}`, 500);
    }
  }
  
  /**
   * Get document metadata by ID
   * @param {string} id - Document ID
   * @returns {Object|null} - Document metadata or null if not found
   */
  async getDocument(id) {
    return this.documents.get(id) || null;
  }
  
  /**
   * Get all documents
   * @returns {Array} - Array of document metadata
   */
  async getAllDocuments() {
    return Array.from(this.documents.values());
  }
  
  /**
   * Delete a document by ID
   * @param {string} id - Document ID
   * @returns {boolean} - True if document was deleted, false if not found
   */
  async deleteDocument(id) {
    const document = this.documents.get(id);
    
    if (!document) {
      return false;
    }
    
    // Delete the file
    try {
      fs.unlinkSync(document.path);
    } catch (error) {
      logger.error('Error deleting document file', { 
        documentId: id,
        error: error.message
      });
    }
    
    // Remove from in-memory storage
    this.documents.delete(id);
    
    logger.info('Document deleted', { documentId: id });
    
    return true;
  }
}

export const documentService = new DocumentService();
