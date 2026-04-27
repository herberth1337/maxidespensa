// server/models/Order.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  OrderId: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  UserId:       { type: DataTypes.INTEGER,      allowNull: false },
  NumeroPedido: { type: DataTypes.STRING(30),   allowNull: false, unique: true },
  Total: {
    type:      DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate:  { min: 0 },
  },
  Estado: {
    type:         DataTypes.STRING(20),
    allowNull:    false,
    defaultValue: 'pendiente',
    validate:     { isIn: [['pendiente','confirmado','enviado','entregado','cancelado']] },
  },
  EnvioNombre:       { type: DataTypes.STRING(100), allowNull: false },
  EnvioTelefono:     { type: DataTypes.STRING(20),  allowNull: false },
  EnvioDireccion:    { type: DataTypes.STRING(200), allowNull: false },
  EnvioCiudad:       { type: DataTypes.STRING(100), allowNull: false },
  EnvioDepartamento: { type: DataTypes.STRING(100), allowNull: false },
  EnvioReferencias:  { type: DataTypes.STRING(300), allowNull: true  },
  MetodoPago: {
    type:         DataTypes.STRING(20),
    allowNull:    false,
    defaultValue: 'efectivo',
    validate:     { isIn: [['efectivo','tarjeta','transferencia']] },
  },
  Notas: { type: DataTypes.STRING(500), allowNull: true },
}, {
  tableName:  'Orders',
  timestamps: true,
  createdAt:  'CreadoEn',
  updatedAt:  'ActualizadoEn',
});

module.exports = Order;
