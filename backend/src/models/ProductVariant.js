import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const ProductVariant = sequelize.define('ProductVariant', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  product_id: { type: DataTypes.BIGINT, allowNull: false },
  sku: { type: DataTypes.STRING(100) },
  price: { type: DataTypes.DECIMAL(12,2) },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
  tableName: 'product_variants',
  timestamps: false
});

export default ProductVariant;
