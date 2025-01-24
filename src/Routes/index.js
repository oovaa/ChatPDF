import tempWrite from 'temp-write'
import { Router } from 'express'
import upload from '../middleware/multerMiddleWare'
import { StoreFileInVDB } from '../db/hnsw.js'
import { main_chain, no_doc_chain } from '../utils/chains.js'
import { addUser, getUserByEmail, getUserByUsername } from '../db/sqlite.js'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { signJWT } from './auth.js'

export const router = Router()
let history = ''

router.post('/signin', async (req, res) => {
  const { login, password } = req.body
  if (!login || !password) res.status(400).send('Missing login or password')

  const storedUser = getUserByEmail(login) || getUserByUsername(login)
  if (!storedUser)
    res.status(403).json({
      error: 'no user with this data',
    })

  if (storedUser.password != password)
    res.status(403).json({
      error: 'invalid cradentials',
    })

  const token = signJWT(storedUser)

  delete storedUser.password
  console.log(storedUser)

  res.status(200).json({ user: storedUser, token })
})

router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body
  if (!username || !password || !email)
    return res.status(400).send('Missing username, email or password')

  const existing = getUserByEmail(email) || getUserByUsername(username)
  if (existing) return res.status(403).json({ error: 'user already exists' })

  addUser(username, email, password)
  const user = {
    username,
    email,
  }
  const token = signJWT(user)

  console.log(username)
  res.status(200).send({ token })
})

router.use(authenticateToken)

router.post('/send', async (req, res) => {
  const { question } = req.body
  const { noDoc } = req.body

  let chain

  if (!question)
    return res.status(400).json({ error: 'Missing question parameter' })

  try {
    chain = noDoc ? no_doc_chain : main_chain
    const answer = await chain.invoke({
      question,
      history,
    })

    history += `Human: ${question}\nAI: ${answer}\n`

    res.status(200).json({ answer })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      error: `An error occurred while processing your request: ${error.message}`,
    })
  }
})

router.post('/upload', upload, async (req, res, next) => {
  const sucessMsg = `file ${req.file.originalname} stored in the vector db`
  try {
    if (!req.file) throw new Error('no file uploaded')
    const filePath = tempWrite.sync(req.file.buffer, req.file.originalname)
    await StoreFileInVDB(filePath)

    console.log(sucessMsg)
    res.status(200).send({ file: req.file.originalname, sucessMsg })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error: `An error occurred while uploading the file: ${error.message}`,
    })
  }

  res.status(200).send(sucessMsg)
})
