import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Category = sequelize.define('Category', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(150), allowNull: false },
  parent_id: { type: DataTypes.BIGINT, allowNull: true }
}, {
  tableName: 'categories',
  timestamps: false
});

export default Category;
