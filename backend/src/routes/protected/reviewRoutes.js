import express from 'express'
import { createReview, getReviewsByProduct } from '../../controllers/reviewController.js'

const router = express.Router()

router.post('/', createReview)
router.get('/:productId', getReviewsByProduct)

export default router
