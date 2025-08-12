import { Router } from 'express'
import tempWrite from 'temp-write'
import upload from '../middleware/multerMiddleWare.js'
import { StoreFileInVDB } from '../db/hnsw.js'

const uploadRouter = Router()

// Supported file types and their MIME types
const SUPPORTED_TYPES = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
  'text/plain': 'TXT'
}

uploadRouter.post('/upload', upload, async (req, res) => {
  const startTime = Date.now()
  
  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a file to upload',
        supportedFormats: Object.values(SUPPORTED_TYPES)
      })
    }

    // Validate file type
    if (!SUPPORTED_TYPES[req.file.mimetype]) {
      return res.status(400).json({
        error: 'Unsupported file type',
        message: `File type '${req.file.mimetype}' is not supported`,
        supportedFormats: Object.values(SUPPORTED_TYPES),
        uploadedType: req.file.mimetype
      })
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (req.file.size > maxSize) {
      return res.status(400).json({
        error: 'File too large',
        message: `File size (${Math.round(req.file.size / 1024 / 1024 * 100) / 100}MB) exceeds the maximum limit of 10MB`,
        maxSizeAllowed: '10MB'
      })
    }

    // Create temporary file
    const filePath = tempWrite.sync(req.file.buffer, req.file.originalname)
    
    // Process and store in vector database
    console.log(`Processing file: ${req.file.originalname} (${SUPPORTED_TYPES[req.file.mimetype]})`)
    await StoreFileInVDB(filePath)

    const processingTime = Date.now() - startTime
    const successMsg = `File '${req.file.originalname}' successfully processed and stored in vector database`
    
    console.log(`✅ ${successMsg} (${processingTime}ms)`)
    
    res.status(200).json({ 
      success: true,
      file: {
        name: req.file.originalname,
        type: SUPPORTED_TYPES[req.file.mimetype],
        size: `${Math.round(req.file.size / 1024 * 100) / 100}KB`,
        mimetype: req.file.mimetype
      },
      message: successMsg,
      metadata: {
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
        status: 'indexed'
      }
    })
  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error('❌ File upload error:', error)
    
    // Determine error type and provide helpful message
    let errorMessage = 'An error occurred while processing the file'
    let statusCode = 500
    
    if (error.message.includes('parse') || error.message.includes('corrupt')) {
      errorMessage = 'File appears to be corrupted or unreadable'
      statusCode = 400
    } else if (error.message.includes('memory') || error.message.includes('space')) {
      errorMessage = 'Insufficient server resources to process file'
      statusCode = 507
    } else if (error.message.includes('timeout')) {
      errorMessage = 'File processing timed out. Please try a smaller file.'
      statusCode = 408
    }
    
    return res.status(statusCode).json({
      success: false,
      error: errorMessage,
      file: req.file ? {
        name: req.file.originalname,
        size: `${Math.round(req.file.size / 1024 * 100) / 100}KB`
      } : null,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      metadata: {
        processingTime: `${processingTime}ms`,
        timestamp: new Date().toISOString(),
        status: 'failed'
      },
      suggestion: 'Please ensure your file is not corrupted and try again. If the problem persists, contact support.'
    })
  }
})

// Health check endpoint for upload service
uploadRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'upload',
    supportedFormats: Object.values(SUPPORTED_TYPES),
    maxFileSize: '10MB',
    timestamp: new Date().toISOString()
  })
})

export { uploadRouter }
