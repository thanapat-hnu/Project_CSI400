import ProductReview from '../models/ProductReview.js'
import Product from '../models/Product.js'
import User from '../models/User.js'

/* ──────────────── สร้างรีวิว ──────────────── */
export const createReview = async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body
    const user_id = req.user.user_id  // ดึงจาก JWT

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'คะแนนต้องอยู่ระหว่าง 1-5 ดาว' })
    }

    const product = await Product.findByPk(product_id)
    if (!product) return res.status(404).json({ message: 'ไม่พบสินค้า' })

    const review = await ProductReview.create({
      product_id,
      user_id,
      rating,
      comment
    })

    res.status(201).json({ message: 'รีวิวสำเร็จ ✅', review })
  } catch (err) {
    console.error('Error creating review:', err)
    res.status(500).json({ message: 'ไม่สามารถเพิ่มรีวิวได้' })
  }
}

/* ──────────────── ดูรีวิวของสินค้า ──────────────── */
export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params

    const reviews = await ProductReview.findAll({
      where: { product_id: productId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'username'] }
      ],
      order: [['id', 'DESC']]
    })

    res.json(reviews)
  } catch (err) {
    console.error('Error fetching reviews:', err)
    res.status(500).json({ message: 'ไม่สามารถดึงรีวิวได้' })
  }
}
