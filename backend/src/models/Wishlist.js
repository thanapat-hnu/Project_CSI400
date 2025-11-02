import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'
import User from './User.js'
import Product from './Product.js'

const Wishlist = sequelize.define('Wishlist', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  product_id: { type: DataTypes.BIGINT, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'wishlists',
  timestamps: false
})

// 🔗 ความสัมพันธ์
Wishlist.belongsTo(User, { foreignKey: 'user_id', as: 'user' })
Wishlist.belongsTo(Product, { foreignKey: 'product_id', as: 'product' })
User.hasMany(Wishlist, { foreignKey: 'user_id', as: 'wishlist' })

export default Wishlist
