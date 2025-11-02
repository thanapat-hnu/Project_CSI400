import { DataTypes } from "sequelize";
import sequelize from "../config/db.js"; // ✅ ใช้ Sequelize instance เดียวกับระบบหลัก
import Order from "./Order.js"; // ✅ เชื่อมกับตาราง orders

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "success", "failed"),
      defaultValue: "pending",
    },
    paid_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "payments",
    timestamps: false,
  }
);

// ✅ สร้างความสัมพันธ์กับ orders
Payment.belongsTo(Order, {
  foreignKey: "order_id",
  as: "order",
});

export default Payment;
