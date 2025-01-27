import { verify } from 'jsonwebtoken'
import { getUserById } from '../db'
import { error } from 'node-gyp/lib/log'

/**
 * Middleware function to authenticate a JWT token from the request headers.
 * If the token is valid, the user information is attached to the request object.
 * If the token is missing or invalid, an appropriate HTTP status code is sent.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']

  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)

  try {
    const payload = verify(token, process.env.JWT_SECRET)
    const user = getUserById(payload.id)

    if (!user) throw new Error('user not found')
    req.user = user

    next()
  } catch (err) {
    return res.status(403).send({ error: 'Auth issue' })
  }
}

export { authenticateToken }
