import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Order from "./Order.js";

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
    // 🆕 เพิ่มช่องทางการชำระเงิน
    method: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "ช่องทางการชำระเงิน เช่น พร้อมเพย์ / โอนผ่านบัญชี / ทรูวอลเล็ต",
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

// ✅ ความสัมพันธ์กับ Order
Payment.belongsTo(Order, { foreignKey: "order_id", as: "order" });
Order.hasMany(Payment, { foreignKey: "order_id", as: "payments" });

export default Payment;
