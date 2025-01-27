import { Router } from 'express'
import tempWrite from 'temp-write'
import upload from '../middleware/multerMiddleWare'
import { StoreFileInVDB } from '../db/hnsw.js'

const uploadRouter = Router()

uploadRouter.post('/upload', upload, async (req, res, next) => {
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
})

export { uploadRouter }
