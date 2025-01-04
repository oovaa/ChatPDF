import tempWrite from 'temp-write'
import { Router } from 'express'
import upload from '../middleware/multerMiddleWare'
import { StoreFileInVDB } from '../db/hnsw.js'
import { setVDB } from '../db/retriver.js'
import { chain } from '../utils/chains.js'

export const router = Router()
let history = ''

router.get('/z', (req, res) => {
  res.status(200).send('all good')
})

router.post('/send', async (req, res) => {
  const question = req.body.question

  try {
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
  try {
    if (!req.file) throw new Error('no file uploaded')

    const filePath = tempWrite.sync(req.file.buffer, req.file.originalname)
    const vdb = await StoreFileInVDB(filePath)
    setVDB(vdb)
    console.log('file stored in the vector db')
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({
        error: `An error occurred while uploading the file: ${
          (error.message)
        }`,
      })
  }

  res.status(200).send('file stored in the vector db')
})
