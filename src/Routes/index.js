import tempWrite from 'temp-write'
import { Router } from 'express'
import upload from '../middleware/multerMiddleWare'
import { StoreFileInVDB } from '../db/hnsw.js'
import { main_chain, no_doc_chain } from '../utils/chains.js'

export const router = Router()
let history = ''

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
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error: `An error occurred while uploading the file: ${error.message}`,
    })
  }

  res.status(200).send(sucessMsg)
})
