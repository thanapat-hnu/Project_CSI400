import express from 'express'

import { authJWT } from '../../middlewares/auth.middleware.js'
import addressRouter from './address.Router.js'
import userRouter from './user.Router.js'

const router = express.Router()

router.use(authJWT)

// address.controller.js
router.use('/address', addressRouter)
router.use('/user', userRouter)

export default router
