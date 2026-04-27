// server/models/Product.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  ProductId: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  CategoryId: {
    type:      DataTypes.INTEGER,
    allowNull: false,
  },
  Nombre: {
    type:      DataTypes.STRING(150),
    allowNull: false,
    validate:  { notEmpty: { msg: 'El nombre es requerido' } },
  },
  Descripcion:    { type: DataTypes.STRING(500), allowNull: true },
  Precio: {
    type:      DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate:  { min: 0 },
  },
  PrecioAnterior: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  Stock: {
    type:         DataTypes.INTEGER,
    allowNull:    false,
    defaultValue: 0,
    validate:     { min: 0 },
  },
  Imagen:    { type: DataTypes.STRING(500), allowNull: true },
  Unidad: {
    type:         DataTypes.STRING(20),
    allowNull:    false,
    defaultValue: 'unidad',
    validate:     { isIn: [['unidad','kg','g','litro','ml','paquete','caja','bolsa']] },
  },
  Destacado: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  Activo:    { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true  },
}, {
  tableName:  'Products',
  timestamps: true,
  createdAt:  'CreadoEn',
  updatedAt:  'ActualizadoEn',
});

module.exports = Product;
