// server/models/Review.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
  ReviewId: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  ProductId:    { type: DataTypes.INTEGER, allowNull: false },
  UserId:       { type: DataTypes.INTEGER, allowNull: false },
  OrderId:      { type: DataTypes.INTEGER, allowNull: false },
  Calificacion: {
    type:      DataTypes.INTEGER,
    allowNull: false,
    validate:  { min: 1, max: 5 },
  },
  Comentario: { type: DataTypes.STRING(1000), allowNull: true },
  Imagen:     { type: DataTypes.STRING(500),  allowNull: true },
  Activo:     { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName:  'Reviews',
  timestamps: true,
  createdAt:  'CreadoEn',
  updatedAt:  'ActualizadoEn',
});

module.exports = Review;
