import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductVariant,
  updateProductVariant,
  deleteProductVariant,
  addProductImage,
  deleteProductImage,
  searchProducts
} from '../controllers/productController.js';

const router = express.Router();

/* ──────────────── Search ──────────────── */
router.get("/search", searchProducts);


/* ──────────────── Product ──────────────── */
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

/* ──────────────── Variant ──────────────── */
router.post('/:id/variants', addProductVariant);
router.put('/variants/:variantId', updateProductVariant);
router.delete('/variants/:variantId', deleteProductVariant);

/* ──────────────── Image ──────────────── */
router.post('/:id/images', addProductImage);
router.delete('/images/:imageId', deleteProductImage);



export default router;
