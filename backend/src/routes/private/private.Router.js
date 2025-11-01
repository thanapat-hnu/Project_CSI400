import express from 'express'
import { authJWT, authRole } from '../../middlewares/auth.middleware.js'
import productRoutes from './productRoutes.js'

const router = express.Router()


router.use(authJWT)
router.use(authRole('admin'))

router.use('/product', productRoutes)

export default router
