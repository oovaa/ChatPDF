import tempWrite from 'temp-write'
import { Router } from 'express'
import upload from '../middleware/multerMiddleWare'
import { parser } from '../utils/fileProcessing.js'

export const router = Router()

router.get('/', (req, res) => {
  console.log(res.locals.parsed)

  res.status(200).send('all good')
})
router.post('/', (req, res) => {
  res.status(200).send('all good ')
})

router.post('/send', (req, res) => {
  console.log(req)
  res.send('ok')
})

router.post('/upload', upload, async (req, res) => {
  const filePath = tempWrite.sync(req.file.buffer, req.file.originalname)
  const parsed = await parser(filePath)
  console.log(parsed)

  res.status(200).send('all good file')
})
