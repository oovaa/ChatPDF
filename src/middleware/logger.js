/**
 * Enhanced middleware function to log HTTP requests with colors and timing.
 *
 * Logs the request method, URL, body, and response time with colored output
 * and structured formatting for better development experience.
 *
 * @param {import('express').Request} req - The HTTP request object.
 * @param {import('express').Response} res - The HTTP response object.
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 */
const logger = (req, res, next) => {
  const startTime = Date.now()
  
  // Colors for different HTTP methods
  const colors = {
    GET: '\x1b[32m',    // Green
    POST: '\x1b[33m',   // Yellow
    PUT: '\x1b[34m',    // Blue
    DELETE: '\x1b[31m', // Red
    PATCH: '\x1b[35m',  // Magenta
    reset: '\x1b[0m'    // Reset
  }
  
  const methodColor = colors[req.method] || colors.reset
  
  // Log request
  console.log(
    `${methodColor}${req.method}${colors.reset} ${req.path}` +
    `${req.body && Object.keys(req.body).length > 0 ? ` - Body: ${JSON.stringify(req.body)}` : ''}`
  )
  
  // Override res.end to log response time
  const originalEnd = res.end
  res.end = function(...args) {
    const duration = Date.now() - startTime
    const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m' // Red for errors, green for success
    
    console.log(
      `${methodColor}${req.method}${colors.reset} ${req.path} - ` +
      `${statusColor}${res.statusCode}${colors.reset} - ${duration}ms`
    )
    
    originalEnd.apply(this, args)
  }
  
  next()
}

export default logger
