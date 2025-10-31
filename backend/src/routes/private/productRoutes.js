import express from 'express';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  addProductVariant,
  updateProductVariant,
  deleteProductVariant,
  addProductImage,
  deleteProductImage,
  searchProducts
} from '../../controllers/product.Controller.js';

const router = express.Router();

/* ──────────────── Search ──────────────── */
router.get("/search", searchProducts);


/* ──────────────── Product ──────────────── */
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
