import express from 'express';
import { getAllProducts, getProductById } from '../../controllers/product.Controller.js';

const router = express.Router();

/* ──────────────── Product ──────────────── */
router.get('/', getAllProducts);
router.get('/:id', getProductById);

export default router;
