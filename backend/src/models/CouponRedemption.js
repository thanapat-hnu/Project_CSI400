import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Coupon from "./Coupon.js";
import User from "./User.js";
import Order from "./Order.js";

const CouponRedemption = sequelize.define(
  "CouponRedemption",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    coupon_id: { type: DataTypes.BIGINT, allowNull: false },
    user_id: { type: DataTypes.BIGINT, allowNull: true },
    order_id: { type: DataTypes.BIGINT, allowNull: true },

    // 🟢 สถานะการเก็บ/ใช้คูปอง
    is_saved: { type: DataTypes.BOOLEAN, defaultValue: false },

    // 📅 วันที่เก็บคูปอง
    saved_at: { type: DataTypes.DATE, allowNull: true },

    // 📅 วันที่ใช้คูปอง (ใน DB คือ redeemed_at)
    used_at: { 
      type: DataTypes.DATE,
      allowNull: true,
      field: "redeemed_at"  // ✅ map ให้ Sequelize ใช้ชื่อ used_at แต่ DB เป็น redeemed_at
    },
  },
  {
    tableName: "coupon_redemptions",
    timestamps: false,
  }
);

/* ─────────────── Associations ─────────────── */

// Coupon ↔ CouponRedemption (1:N)
Coupon.hasMany(CouponRedemption, { foreignKey: "coupon_id", as: "redemptions" });
CouponRedemption.belongsTo(Coupon, { foreignKey: "coupon_id", as: "coupon" });

// User ↔ CouponRedemption (1:N)
User.hasMany(CouponRedemption, { foreignKey: "user_id", as: "used_coupons" });
CouponRedemption.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Order ↔ CouponRedemption (1:1)
Order.hasOne(CouponRedemption, { foreignKey: "order_id", as: "coupon_usage" });
CouponRedemption.belongsTo(Order, { foreignKey: "order_id", as: "order" });

export default CouponRedemption;
