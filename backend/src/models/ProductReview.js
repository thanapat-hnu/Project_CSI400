import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import User from './User.js'
import Product from './Product.js'

const ProductReview = sequelize.define('ProductReview', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  product_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: { model: 'products', key: 'id' }
  },
  user_id: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  },
  rating: { type: DataTypes.TINYINT, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: 'product_reviews',
  timestamps: false
})

// 🔗 สร้างความสัมพันธ์
ProductReview.belongsTo(Product, { foreignKey: 'product_id', as: 'product' })
ProductReview.belongsTo(User, { foreignKey: 'user_id', as: 'user' })
Product.hasMany(ProductReview, { foreignKey: 'product_id', as: 'reviews' })

export default ProductReview
