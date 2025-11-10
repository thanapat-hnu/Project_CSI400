import express from 'express'
import { addToWishlist, getAllWishlist, removeFromWishlist } from '../../controllers/wishlistController.js'

const router = express.Router()

router.post('/', addToWishlist)
router.get('/', getAllWishlist)
router.delete('/:product_id', removeFromWishlist)

export default router
