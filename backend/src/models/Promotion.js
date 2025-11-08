// src/models/Promotion.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Promotion = sequelize.define(
  "Promotion",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    image: { type: DataTypes.STRING(500), allowNull: true }, 
    start_date: { type: DataTypes.DATEONLY, allowNull: true }, 
    end_date: { type: DataTypes.DATEONLY, allowNull: true },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    tableName: "promotions",
    timestamps: true, 
  }
);

export default Promotion;
