/**
 * Middleware function to log HTTP requests.
 *
 * Logs the request method, URL, and body to a log file with a timestamp.
 *
 * @param {RequestHandler} req - The HTTP request RequestHandler.
 * @param {RequestHandler} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 */
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.path} - body: ${JSON.stringify(req.body)}`)
  next()
}

export default logger
