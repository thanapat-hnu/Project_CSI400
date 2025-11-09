import { Product, Category, ProductVariant, ProductImage } from '../models/index.js';
import { Op, fn, col, where } from "sequelize";


/* ───────── GET ───────── */
export const getAllProducts = async (req, res) => {
  try {
    const { category_id } = req.query; // ดึงค่าหมวดหมู่จาก query params

    // ถ้ามีการส่ง category_id เข้ามา → ใช้เป็นเงื่อนไข filter
    const whereClause = {};
    if (category_id) whereClause.category_id = category_id;

    const products = await Product.findAll({
      where: whereClause,
      include: [
        { model: Category, as: 'category', attributes: ['id', 'name'] },
        { model: ProductVariant, as: 'variants' },
        { model: ProductImage, as: 'images' },
      ],
      order: [['id', 'ASC']],
    });

    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Failed to fetch products.' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [
        { model: Category, as: 'category', attributes: ['id','name'] },   // ✅ ใส่หมวดหมู่
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

/* ───────── CREATE ───────── */
export const createProduct = async (req, res) => {
  try {
    console.log("📦 Incoming body:", req.body);
    console.log("🖼️ Incoming file:", req.file);

    const { name, description, price, stock = 0, category_id } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({ message: "ข้อมูลไม่ครบ" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category_id,
    });

    // ถ้ามีรูปแนบมา
    if (req.file) {
      const imageUrl = `/uploads/products/${req.file.filename}`;
      await ProductImage.create({
        product_id: product.id,
        url: imageUrl,
      });
    }

    res.status(201).json({
      message: "เพิ่มสินค้าสำเร็จ",
      product,
    });
  } catch (err) {
    console.error("Error creating product:", err);
    res.status(500).json({ message: "เพิ่มสินค้าไม่สำเร็จ" });
  }
};

/* ───────── UPDATE ───────── */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id } = req.body;

    if (category_id) {
      const exists = await Category.findByPk(category_id);
      if (!exists) return res.status(400).json({ message: 'Invalid category_id' });
    }

    const [updated] = await Product.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Product not found' });

    const updatedProduct = await Product.findByPk(id, {
      include: [{ model: Category, as: 'category', attributes: ['id','name'] }]
    });
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

    // ตรวจสอบว่าสินค้ามีอยู่ไหม
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "ไม่พบสินค้า" });
    }

    // ตรวจสอบว่ามีการอัปโหลดไฟล์มาหรือไม่
    if (!req.file) {
      return res.status(400).json({ message: "กรุณาอัปโหลดรูปภาพ" });
    }

    // สร้าง path รูปภาพ
    const imageUrl = `/uploads/products/${req.file.filename}`;

    // บันทึกลงตาราง ProductImage
    const image = await ProductImage.create({
      product_id: id,
      url: imageUrl,
    });

    res.status(201).json({
      message: "เพิ่มรูปภาพสำเร็จ",
      image,
    });
  } catch (err) {
    console.error("Error adding image:", err);
    res.status(500).json({ message: "Failed to add image." });
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


export const searchProducts = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);   // ไม่มีคำค้นไม่ต้องส่งทั้งหมด

    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
        ],
      },
      include: [
        { model: ProductImage, as: "images" },
        { model: Category, as: "category" },
      ],
      limit: 10,
    });
    res.json(products);
  } catch (err) {
    console.error("❌ Error searching products:", err);
    res.status(500).json({ message: "Search failed" });
  }
};