import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js"; // ✅ ต้องเพิ่มบรรทัดนี้

const Notification = sequelize.define("Notification", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  title: { type: DataTypes.STRING(255), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  type: {
    type: DataTypes.ENUM("payment", "shipping", "refund", "system"),
    defaultValue: "system",
  },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "notifications",
  timestamps: false,
});

// ✅ ความสัมพันธ์กับ users
User.hasMany(Notification, { foreignKey: "user_id", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "user_id", as: "user" });

export default Notification;
