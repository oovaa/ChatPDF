import { Router } from 'express'
import { authenticateToken } from '../middleware/authMiddleware.js'
import { userAuthRouter } from './userAuth.js'
import { uploadRouter } from './upload.js'
import { messageRouter } from './messaging.js'
import { adminRouter } from './admin.js'
import { OauthRouter } from './OauthRouter.js'

export const router = Router()

const apiStr = '/api/v1/'

router.use(`${apiStr}/`, userAuthRouter)
router.use(`/`, OauthRouter)

router.use(authenticateToken)

router.use(`${apiStr}/`, uploadRouter)
router.use(`${apiStr}/`, messageRouter)
router.use(`${apiStr}/`, adminRouter)
