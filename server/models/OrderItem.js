// server/models/OrderItem.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  OrderItemId: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  OrderId:   { type: DataTypes.INTEGER,      allowNull: false },
  ProductId: { type: DataTypes.INTEGER,      allowNull: false },
  // Snapshot del producto al momento de compra
  NombreProducto: { type: DataTypes.STRING(150), allowNull: false },
  PrecioUnitario: {
    type:      DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate:  { min: 0 },
  },
  Cantidad: {
    type:      DataTypes.INTEGER,
    allowNull: false,
    validate:  { min: 1 },
  },
  Imagen: { type: DataTypes.STRING(500), allowNull: true },
}, {
  tableName:  'OrderItems',
  timestamps: false,   // sin CreadoEn / ActualizadoEn (inmutable)
});

module.exports = OrderItem;
