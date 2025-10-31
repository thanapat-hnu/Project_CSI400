import express from 'express'

import auth from './auth.routes.js'
import categoryRoutes from './categoryRoutes.js'
import productRoutes from './productRoutes.js'


const router = express.Router()

router.use('/auth', auth)
router.use('/category', categoryRoutes)
router.use('/product', productRoutes)

export default router;