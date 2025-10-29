import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Product from './Product.js';

const ProductImage = sequelize.define('ProductImage', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  product_id: { type: DataTypes.BIGINT, allowNull: false },
  url: { type: DataTypes.STRING(512), allowNull: false }
}, {
  tableName: 'product_images',
  timestamps: false
});

/* สร้างความสัมพันธ์แบบ alias ให้ Product เรียกได้ว่า product.images */
ProductImage.belongsTo(Product, {
  foreignKey: 'product_id',
  onDelete: 'CASCADE'
});
Product.hasMany(ProductImage, {
  as: 'images',
  foreignKey: 'product_id'
});

export default ProductImage;
