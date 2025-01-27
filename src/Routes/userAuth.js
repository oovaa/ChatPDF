import { Router } from 'express'
import { getUserByEmail, getUserByUsername, addUser } from '../db/index.js'
import { verifyHash, hashStr } from '../utils/hash.js'
import { signJWT } from '../utils/auth.js'

const userAuthRouter = Router()

userAuthRouter.post('/signin', async (req, res) => {
  try {
    const { login, password } = req.body
    if (!login || !password) {
      return res.status(400).send('Missing login or password')
    }

    // Check both email and username with await
    const userByEmail = await getUserByEmail(login)
    const userByUsername = await getUserByUsername(login)
    const storedUser = userByEmail || userByUsername

    if (!storedUser) {
      return res.status(403).json({
        error: 'No user with this credentials',
      })
    }

    const passwordValid = await verifyHash(password, storedUser.password)
    if (!passwordValid) {
      return res.status(403).json({
        error: 'Invalid credentials',
      })
    }

    // Create a copy without password
    const userWithoutPassword = { ...storedUser }
    delete userWithoutPassword.password

    const token = signJWT(userWithoutPassword)

    return res.status(200).json({ user: userWithoutPassword, token })
  } catch (error) {
    console.error('Signin error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

userAuthRouter.post('/signup', async (req, res) => {
  try {
    const { username, password, email } = req.body
    if (!username || !password || !email) {
      return res.status(400).send('Missing username, email or password')
    }

    // Check existing users with await
    const existingEmail = await getUserByEmail(email)
    const existingUsername = await getUserByUsername(username)
    if (existingEmail || existingUsername) {
      return res.status(403).json({ error: 'User already exists' })
    }

    const hashedPass = await hashStr(password)
    const newUser = await addUser(username, email, hashedPass)

    // Remove password before sending response
    const userWithoutPassword = { ...newUser }
    delete userWithoutPassword.password

    const token = signJWT(userWithoutPassword)

    return res.status(200).json({ user: userWithoutPassword, token })
  } catch (error) {
    console.error('Signup error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export { userAuthRouter }
