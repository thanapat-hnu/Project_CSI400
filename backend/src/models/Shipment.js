import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Order from "./Order.js"; // ✅ เพิ่มบรรทัดนี้

const Shipment = sequelize.define("Shipment", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  order_id: { type: DataTypes.BIGINT, allowNull: false },
  tracking_number: { type: DataTypes.STRING(255), allowNull: true },
  status: {
    type: DataTypes.ENUM("pending", "in_transit", "delivered"),
    defaultValue: "pending",
  },
}, {
  tableName: "shipments",
  timestamps: false,
});

// ✅ ความสัมพันธ์
Order.hasOne(Shipment, { foreignKey: "order_id", as: "shipment" });
Shipment.belongsTo(Order, { foreignKey: "order_id", as: "order" });

export default Shipment;
