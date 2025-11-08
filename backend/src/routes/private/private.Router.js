import express from 'express'
import { authJWT, authRole } from '../../middlewares/auth.middleware.js'
import productRoutes from './productRoutes.js'
import analyticsRoutes from './analyticsRoutes.js'
import promotionRoutes from './promotionRoutes.js'
import notificationRoutes from './notificationRoutes.js'
import paymentRoutes from './paymentRoutes.js'
import refundRoutes from './refundRoutes.js'
import shippingRoutes from './shippingRoutes.js'
import orderRoutes from './orderRoutes.js'
import couponRoutes from './couponRoutes.js';

const router = express.Router()


router.use(authJWT)
router.use(authRole('admin'))

router.use('/product', productRoutes)
router.use('/analytics', analyticsRoutes)
router.use('/promotion', promotionRoutes)
router.use('/notification', notificationRoutes)
router.use('/payment', paymentRoutes)
router.use('/refund', refundRoutes)
router.use('/shipping', shippingRoutes)
router.use('/order', orderRoutes)
router.use('/coupon', couponRoutes)

export default router
