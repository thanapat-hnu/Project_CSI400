import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js"; // ✅ ความสัมพันธ์กับผู้ใช้

const Notification = sequelize.define("Notification", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },

  // ✅ เพิ่ม reference_id เพื่อเชื่อมกับ Order / Payment / Refund
  reference_id: { type: DataTypes.BIGINT, allowNull: true },

  title: { type: DataTypes.STRING(255), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },

  // ✅ เพิ่มชนิดการแจ้งเตือนเพิ่มเติม เช่น order, coupon, promotion
  type: {
    type: DataTypes.ENUM(
      "order",
      "payment",
      "shipping",
      "refund",
      "coupon",
      "system"
    ),
    defaultValue: "system",
  },

  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "notifications",
  timestamps: false,
});

// ✅ ความสัมพันธ์กับ Users
User.hasMany(Notification, { foreignKey: "user_id", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "user_id", as: "user" });

export default Notification;
