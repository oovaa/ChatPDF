import tempWrite from 'temp-write'
import { Router } from 'express'
import upload from '../middleware/multerMiddleWare'
import { parser } from '../utils/fileProcessing.js'
import { StoreFileInVDB } from '../db/hnsw.js'
import { setVDB } from '../db/retriver.js'
import { chain } from '../utils/chains.js'

export const router = Router()
let history = ''

router.get('/', (req, res) => {
  res.status(200).send('all good')
})
router.post('/', (req, res) => {
  res.status(200).send('all good ')
})

router.post('/send', async (req, res) => {
  const question = req.body.question
  let answer

  try {
    answer = await chain.invoke({
      question,
      history,
    })

    history += `Human: ${question}\nAI: ${answer}\n`

    res.status(200).json({ answer })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'An error occurred while processing your request.' })
  }
})

router.post('/upload', upload, async (req, res, next) => {
  const filePath = tempWrite.sync(req.file.buffer, req.file.originalname)
  const vdb = await StoreFileInVDB(filePath)
  setVDB(vdb)

  res.status(200).send('file stored in the vector db')
})
