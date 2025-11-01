import express from 'express';
import { getAllProducts, getProductById,searchProducts } from '../../controllers/product.Controller.js';

const router = express.Router();

/* ──────────────── Product ──────────────── */
router.get('/search', searchProducts);
router.get('/', getAllProducts);
router.get('/:id', getProductById);

export default router;
