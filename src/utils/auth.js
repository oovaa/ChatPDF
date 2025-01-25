import { sign, verify } from 'jsonwebtoken'

function signJWT(obj) {
  return sign(obj, getJWTsecret(), {
    expiresIn: '15d',
  })
}

/**
 * Retrieves the JWT secret from the environment variables.
 *
 * @returns {string} The JWT secret.
 * @throws Will terminate the process if the JWT secret is not found in the environment variables.
 */
function getJWTsecret() {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    console.error('no secret')
    process.exit(1)
  }
  return secret
}

function verifyJWT(token) {
  return verify(token, getJWTsecret())
}

export { signJWT, verifyJWT }
