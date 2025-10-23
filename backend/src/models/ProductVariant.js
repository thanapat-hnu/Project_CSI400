import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Product from './Product.js';

const ProductVariant = sequelize.define('ProductVariant', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  product_id: { type: DataTypes.BIGINT, allowNull: false },
  sku: { type: DataTypes.STRING(100), allowNull: true },
  price: { type: DataTypes.DECIMAL(12, 2) },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'product_variants', timestamps: false });

ProductVariant.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });
Product.hasMany(ProductVariant, { foreignKey: 'product_id' });

export default ProductVariant;
