import Category from '../models/Category.js';
import Product from '../models/Product.js';

// ดึงหมวดหมู่ทั้งหมด (รวมหมวดย่อย)
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        { model: Category, as: 'subcategories' }
      ],
      order: [['id', 'ASC']]
    });
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ message: 'Failed to fetch categories.' });
  }
};

// ดึงหมวดหมู่เดียว
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'subcategories' },
        { model: Product, as: 'products' }
      ]
    });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch category.' });
  }
};

// เพิ่มหมวดหมู่
export const createCategory = async (req, res) => {
  try {
    const { name, parent_id = null } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const category = await Category.create({ name, parent_id });
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// แก้ไขหมวดหมู่
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Category.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Category not found' });
    const category = await Category.findByPk(id);
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ลบหมวดหมู่
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
