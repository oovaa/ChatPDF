import { Router } from 'express'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { userAuthRouter } from './userAuth.js'
import { uploadRouter } from './upload.js'
import { messageRouter } from './messaging.js'

export const router = Router()

router.use('/', userAuthRouter)

router.use(authenticateToken)

router.use('/', uploadRouter)
router.use('/', messageRouter)
