/**
 * @fileoverview Main entry point for the ChatPDF application.
 * Sets up the Express server, middleware, and routes with enhanced logging and error handling.
 */

import express from 'express'
import logger from './src/middleware/logger.js'
import { clerkMiddleware } from '@clerk/express'
import { router } from './src/Routes/index.js'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

// ASCII Art Logo
console.log(`
  ╔═══╗╔╗ ╔╗╔═══╗╔════╗╔═══╗╔═══╗╔═══╗
  ║╔═╗║║║ ║║║╔═╗║║╔╗╔╗║║╔═╗║║╔═╗║║╔══╝
  ║║ ║║║╚═╝║║║ ║║╚╝║║╚╝║╚═╝║║║ ║║║╚══╗
  ║║ ║║║╔═╗║║╚═╝║  ║║  ║╔══╝║║ ║║║╔══╝
  ║╚═╝║║║ ║║║╔═╗║  ║║  ║║   ║╚═╝║║║  
  ╚═══╝╚╝ ╚╝╚╝ ╚╝  ╚╝  ╚╝   ╚═══╝╚╝  
  
  🤖 ChatPDF - Intelligent Document Chat Interface
  📄 Created by Omar, Husam, Mohayyad & Hassan
`)

/**
 * Security middleware - Helmet for security headers
 */
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}))

/**
 * CORS configuration for cross-origin requests
 */
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}))

/**
 * Compression middleware for response optimization
 */
app.use(compression())

/**
 * Clerk authentication middleware
 */
app.use(clerkMiddleware())

/**
 * Body parsing middleware
 */
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * Custom logger middleware with enhanced formatting
 */
app.use(logger)

/**
 * Enhanced health check endpoint with system information
 * @name /z
 * @function
 * @memberof module:app
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
app.get('/z', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'ChatPDF API is running smoothly',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100,
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024 * 100) / 100,
      unit: 'MB'
    },
    environment: process.env.NODE_ENV || 'development'
  })
})

/**
 * API routes with enhanced error handling
 * @name /api/v1/
 * @function
 * @memberof module:app
 * @inner
 */
app.use('/api/v1/', router)

/**
 * 404 handler for undefined routes
 */
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: [
      'GET /z - Health check',
      'POST /api/v1/upload - Upload documents',
      'POST /api/v1/send - Chat with documents',
      'POST /api/v1/signin - User authentication',
      'POST /api/v1/signup - User registration'
    ],
    timestamp: new Date().toISOString()
  })
})

/**
 * Global error handler
 */
app.use((error, req, res, next) => {
  console.error('🚨 Unhandled error:', error)
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred',
    timestamp: new Date().toISOString(),
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  })
})

/**
 * Graceful shutdown handler
 */
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received. Shutting down gracefully...')
  process.exit(0)
})

/**
 * Starts the Express server with enhanced startup messaging
 * @function
 * @memberof module:app
 * @inner
 * @param {number} PORT - The port number on which the server listens.
 * @returns {void}
 */
app.listen(PORT, () => {
  console.log(`
🚀 Server Status: ONLINE
🌐 Port: ${PORT}
🔗 Local URL: http://localhost:${PORT}
📚 API Docs: http://localhost:${PORT}/api/v1/
❤️  Health Check: http://localhost:${PORT}/z

📋 Available Endpoints:
   • POST /api/v1/upload  - Upload & process documents
   • POST /api/v1/send    - Chat with your documents  
   • POST /api/v1/signin  - User authentication
   • POST /api/v1/signup  - User registration
   • GET  /z              - Health check

🔧 Environment: ${process.env.NODE_ENV || 'development'}
💾 Memory Usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB

Ready to chat with your documents! 🎉
`)
})
