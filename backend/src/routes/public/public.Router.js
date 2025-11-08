import express from 'express'

import auth from './auth.routes.js'
import categoryRoutes from './categoryRoutes.js'
import productRoutes from './productRoutes.js'
import promotionRoutes from './promotion.routes.js'
import publicCouponRoutes from './publicCouponRoutes.js'


const router = express.Router()

router.use('/auth', auth)
router.use('/category', categoryRoutes)
router.use('/product', productRoutes)
router.use('/promotion', promotionRoutes)
router.use("/coupon", publicCouponRoutes);


export default router;