import express from 'express'

import { addToCart, updateCartItem, getMyCart, removeCartItem } from '../../controllers/cart.controller.js'

const router = express.Router()

router.get('/', getMyCart)
router.post('/', addToCart)
router.put('/', updateCartItem)
router.delete('/:product_id', removeCartItem)


export default router
