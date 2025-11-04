import express from 'express'

import { authJWT } from '../../middlewares/auth.middleware.js'
import paymentRoutes from './paymentRoutes.js'
import shippingRoutes from './shippingRoutes.js'
import refundRoutes from './refundRoutes.js'
import notificationRoutes from './notificationRoutes.js'
import promotionRoutes from './promotionRoutes.js'
import reviewRoutes from './reviewRoutes.js'
import wishlistRoutes from './wishlistRoutes.js'
import addressRouter from './address.Router.js'
import userRouter from './user.Router.js'
import cart from './cart.Router.js'
import orderRoutes from './orderRoutes.js'

const router = express.Router()
router.use(authJWT)

router.use('/payment', paymentRoutes)
router.use('/shipping', shippingRoutes)
router.use('/refund', refundRoutes)
router.use('/notification', notificationRoutes)
router.use('/promotion', promotionRoutes)
router.use('/reviews', reviewRoutes)
router.use('/wishlist', wishlistRoutes)
router.use('/address', addressRouter)
router.use('/user', userRouter)
router.use('/cart', cart)
router.use('/order', orderRoutes)

export default router
