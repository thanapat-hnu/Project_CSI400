import Wishlist from '../models/Wishlist.js'
import Product from '../models/Product.js'

/* ──────────────── เพิ่มสินค้าใน Wishlist ──────────────── */
export const addToWishlist = async (req, res) => {
  try {
    const user_id = req.user.user_id
    const { product_id } = req.body

    const product = await Product.findByPk(product_id)
    if (!product) return res.status(404).json({ message: 'ไม่พบสินค้า' })

    // ตรวจว่ามีอยู่แล้วหรือยัง
    const existing = await Wishlist.findOne({ where: { user_id, product_id } })
    if (existing) return res.status(400).json({ message: 'สินค้านี้อยู่ใน Wishlist แล้ว' })

    const wishlistItem = await Wishlist.create({ user_id, product_id })
    res.status(201).json({ message: 'เพิ่มใน Wishlist สำเร็จ ✅', wishlistItem })
  } catch (err) {
    console.error('Error adding to wishlist:', err)
    res.status(500).json({ message: 'ไม่สามารถเพิ่มสินค้าได้' })
  }
}

/* ──────────────── ดู Wishlist ──────────────── */
export const getWishlist = async (req, res) => {
  try {
    const user_id = req.user.user_id

    const wishlist = await Wishlist.findAll({
      where: { user_id },
      include: [{ model: Product, as: 'product' }],
      order: [['created_at', 'DESC']]
    })

    res.json(wishlist)
  } catch (err) {
    console.error('Error fetching wishlist:', err)
    res.status(500).json({ message: 'ไม่สามารถดึงข้อมูล Wishlist ได้' })
  }
}

/* ──────────────── ลบสินค้าออกจาก Wishlist ──────────────── */
export const removeFromWishlist = async (req, res) => {
  try {
    const user_id = req.user.user_id
    const { product_id } = req.params

    const deleted = await Wishlist.destroy({ where: { user_id, product_id } })
    if (!deleted) return res.status(404).json({ message: 'ไม่พบสินค้านี้ใน Wishlist' })

    res.json({ message: 'ลบสินค้าออกจาก Wishlist แล้ว ❌' })
  } catch (err) {
    console.error('Error removing from wishlist:', err)
    res.status(500).json({ message: 'ไม่สามารถลบสินค้าได้' })
  }
}
