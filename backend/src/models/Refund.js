import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Order from "./Order.js";   // ✅ เพิ่ม
import Payment from "./Payment.js";

const Refund = sequelize.define(
  "Refund",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    order_id: { type: DataTypes.BIGINT, allowNull: false },
    payment_id: { type: DataTypes.BIGINT, allowNull: true },
    user_id: { type: DataTypes.BIGINT, allowNull: true },
    reason: { type: DataTypes.STRING(255), allowNull: true },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    status: {
      type: DataTypes.ENUM("requested", "approved", "rejected", "refunded"),
      defaultValue: "requested",
    },
    requested_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    refunded_at: { type: DataTypes.DATE, allowNull: true },
  },
  {
    tableName: "refunds",
    timestamps: false,
  }
);

// ✅ ความสัมพันธ์กับ Order
Order.hasMany(Refund, { foreignKey: "order_id", as: "refunds" });
Refund.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// ✅ ความสัมพันธ์กับ Payment
Payment.hasOne(Refund, { foreignKey: "payment_id", as: "refund" });
Refund.belongsTo(Payment, { foreignKey: "payment_id", as: "payment" });

export default Refund;
