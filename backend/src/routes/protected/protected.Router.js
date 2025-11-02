import express from 'express'
import { authJWT } from '../../middlewares/auth.middleware.js'
import paymentRoutes from './paymentRoutes.js'
import shippingRoutes from './shippingRoutes.js'
import refundRoutes from './refundRoutes.js'
import notificationRoutes from './notificationRoutes.js'
import promotionRoutes from './promotionRoutes.js'
import reviewRoutes from './reviewRoutes.js'
import wishlistRoutes from './wishlistRoutes.js'

const router = express.Router()
router.use(authJWT)

router.use('/payment', paymentRoutes)
router.use('/shipping', shippingRoutes)
router.use('/refund', refundRoutes)
router.use('/notification', notificationRoutes)
router.use('/promotion', promotionRoutes)
router.use('/reviews', reviewRoutes)
router.use('/wishlist', wishlistRoutes)
export default router
