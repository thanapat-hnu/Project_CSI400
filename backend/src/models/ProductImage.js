import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ProductImage = sequelize.define('ProductImage', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  product_id: { type: DataTypes.BIGINT, allowNull: false },
  url: { type: DataTypes.STRING(512) }
}, {
  tableName: 'product_images',
  timestamps: false
});

export default ProductImage;
