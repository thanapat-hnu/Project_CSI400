import Product from '../models/Product.js';
import ProductVariant from '../models/ProductVariant.js';
import ProductImage from '../models/ProductImage.js';

// ดึงสินค้าทั้งหมด
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [ProductVariant, ProductImage]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ดึงสินค้าเดียว
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [ProductVariant, ProductImage]
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// เพิ่มสินค้าใหม่
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, status } = req.body;
    const product = await Product.create({ name, description, price, stock, status });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// แก้ไขสินค้า
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Product.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    const product = await Product.findByPk(id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ลบสินค้า
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// เพิ่มรูปภาพสินค้า
export const addProductImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { url } = req.body;
    const image = await ProductImage.create({ product_id: id, url });
    res.status(201).json(image);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// เพิ่ม Variant
export const addProductVariant = async (req, res) => {
  try {
    const { id } = req.params;
    const { sku, price, stock } = req.body;
    const variant = await ProductVariant.create({ product_id: id, sku, price, stock });
    res.status(201).json(variant);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
