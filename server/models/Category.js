// server/models/Category.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Category = sequelize.define('Category', {
  CategoryId: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  Nombre: {
    type:      DataTypes.STRING(100),
    allowNull: false,
    unique:    true,
    validate:  { notEmpty: true },
  },
  Descripcion: { type: DataTypes.STRING(300), allowNull: true },
  Icono:       { type: DataTypes.STRING(10),  allowNull: false, defaultValue: '🛒' },
  Color:       { type: DataTypes.STRING(7),   allowNull: false, defaultValue: '#10b981' },
  Activo:      { type: DataTypes.BOOLEAN,     allowNull: false, defaultValue: true },
}, {
  tableName:  'Categories',
  timestamps: true,
  createdAt:  'CreadoEn',
  updatedAt:  'ActualizadoEn',
});

module.exports = Category;
