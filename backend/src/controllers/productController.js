import Product from '../models/Product.js';
import ProductVariant from '../models/ProductVariant.js';
import ProductImage from '../models/ProductImage.js';

/* ──────────────── GET ──────────────── */
// ดึงสินค้าทั้งหมด (รวม variants และ images)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: ProductVariant, as: 'variants' },
        { model: ProductImage, as: 'images' }
      ],
      order: [['id', 'ASC']]
    });
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
};

// ดึงสินค้าเดียว
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        { model: ProductVariant, as: 'variants' },
        { model: ProductImage, as: 'images' }
      ]
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ message: 'Failed to fetch product.' });
  }
};

/* ──────────────── CREATE ──────────────── */
// เพิ่มสินค้าใหม่
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock = 0, status = 'active' } = req.body;
    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required.' });
    }

    const product = await Product.create({ name, description, price, stock, status });
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(400).json({ message: 'Failed to create product.' });
  }
};

/* ──────────────── UPDATE ──────────────── */
// แก้ไขสินค้า
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Product.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Product not found' });

    const updatedProduct = await Product.findByPk(id);
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ message: 'Failed to update product.' });
  }
};

/* ──────────────── DELETE ──────────────── */
// ลบสินค้า
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted successfully.' });
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).json({ message: 'Failed to delete product.' });
  }
};

/* ──────────────── VARIANT ──────────────── */
// เพิ่ม Variant
export const addProductVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const { sku, price, stock = 0 } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    if (!price) return res.status(400).json({ message: 'Variant price is required.' });

    const variant = await ProductVariant.create({ product_id: id, sku, price, stock });
    res.status(201).json(variant);
  } catch (err) {
    console.error('Error adding variant:', err);
    res.status(400).json({ message: 'Failed to add variant.' });
  }
};

// อัปเดต Variant
export const updateProductVariant = async (req, res) => {
  try {
    const { variantId } = req.params;
    const [updated] = await ProductVariant.update(req.body, { where: { id: variantId } });
    if (!updated) return res.status(404).json({ message: 'Variant not found' });

    const variant = await ProductVariant.findByPk(variantId);
    res.json(variant);
  } catch (err) {
    console.error('Error updating variant:', err);
    res.status(400).json({ message: 'Failed to update variant.' });
  }
};

// ลบ Variant
export const deleteProductVariant = async (req, res) => {
  try {
    const { variantId } = req.params;
    const deleted = await ProductVariant.destroy({ where: { id: variantId } });
    if (!deleted) return res.status(404).json({ message: 'Variant not found' });
    res.json({ message: 'Variant deleted.' });
  } catch (err) {
    console.error('Error deleting variant:', err);
    res.status(400).json({ message: 'Failed to delete variant.' });
  }
};

/* ──────────────── IMAGE ──────────────── */
// เพิ่มรูปภาพสินค้า
export const addProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { url } = req.body;

    if (!url) return res.status(400).json({ message: 'Image URL is required.' });

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: 'Product not found.' });

    const image = await ProductImage.create({ product_id: id, url });
    res.status(201).json(image);
  } catch (err) {
    console.error('Error adding image:', err);
    res.status(400).json({ message: 'Failed to add image.' });
  }
};

// ลบรูปภาพสินค้า
export const deleteProductImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const deleted = await ProductImage.destroy({ where: { id: imageId } });
    if (!deleted) return res.status(404).json({ message: 'Image not found' });
    res.json({ message: 'Image deleted.' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(400).json({ message: 'Failed to delete image.' });
  }
};
