/**
 * @fileoverview Main entry point for the ChatPDF application.
 * Sets up the Express server, middleware, and routes.
 */

import express, { json } from 'express'
import logger from './src/middleware/logger.js'
import { router } from './src/Routes/index.js'
import compression from 'compression'
import helmet from 'helmet'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3000

/**
 * Middleware to parse JSON bodies.
 */
app.use(express.json())

/**
 * Custom logger middleware.
 */
app.use(compression())
app.use(logger)
app.use(helmet())
app.use(cors())

/**
 * Health check endpoint.
 * @name /z
 * @function
 * @memberof module:app
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
app.get('/z', (req, res) => {
  res.status(200).send('all good')
})

/**
 * API routes.
 * @name /api/v1/
 * @function
 * @memberof module:app
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {void}
 */
app.use('/', router)

/**
 * Starts the Express server.
 * @function
 * @memberof module:app
 * @inner
 * @param {number} PORT - The port number on which the server listens.
 * @returns {void}
 */
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}
  access it with the link http://localhost:${PORT}/`)
})
