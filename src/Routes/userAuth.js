import { Router } from 'express'
import { getUserByEmail, getUserByUsername, addUser } from '../db/sqlite.js'
import { verifyHash, hashStr } from '../utils/hash.js'
import { signJWT } from '../utils/auth.js'
import log from 'node-gyp/lib/log.js'

const userAuthRouter = Router()

userAuthRouter.post('/signin', async (req, res) => {
  const { login, password } = req.body
  if (!login || !password) res.status(400).send('Missing login or password')

  const storedUser = getUserByEmail(login) || getUserByUsername(login)
  if (!storedUser)
    res.status(403).json({
      error: 'no user with this data',
    })

  if (!verifyHash(password, storedUser.password))
    res.status(403).json({
      error: 'invalid cradentials',
    })

  delete storedUser.password

  console.log(storedUser)

  const token = signJWT(storedUser)

  res.status(200).json({ user: storedUser, token })
})

userAuthRouter.post('/signup', async (req, res) => {
  const { username, password, email } = req.body
  if (!username || !password || !email)
    return res.status(400).send('Missing username, email or password')

  const existing = getUserByEmail(email) || getUserByUsername(username)
  if (existing) return res.status(403).json({ error: 'user already exists' })

  const hashedPass = await hashStr(password)

  const user = addUser(username, email, hashedPass)
  console.log(user)

  const token = signJWT(user)

  res.status(200).send({ token })
})

export { userAuthRouter }
