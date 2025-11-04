import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Coupon = sequelize.define("Coupon", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  type: { type: DataTypes.ENUM("fixed", "percent"), defaultValue: "fixed" },
  value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  active: { type: DataTypes.TINYINT, defaultValue: 1 },
}, {
  tableName: "coupons",
  timestamps: false,
});

export default Coupon;
