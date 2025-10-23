import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Product from './Product.js';

const ProductImage = sequelize.define('ProductImage', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  product_id: { type: DataTypes.BIGINT, allowNull: false },
  url: { type: DataTypes.STRING(512), allowNull: false },
}, { tableName: 'product_images', timestamps: false });

ProductImage.belongsTo(Product, { foreignKey: 'product_id', onDelete: 'CASCADE' });
Product.hasMany(ProductImage, { foreignKey: 'product_id' });

export default ProductImage;
