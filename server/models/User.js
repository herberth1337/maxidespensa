// server/models/User.js
const { DataTypes } = require('sequelize');
const bcrypt        = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  UserId: {
    type:          DataTypes.INTEGER,
    primaryKey:    true,
    autoIncrement: true,
  },
  Nombre: {
    type:      DataTypes.STRING(100),
    allowNull: false,
    validate:  { notEmpty: { msg: 'El nombre es requerido' } },
  },
  Email: {
    type:      DataTypes.STRING(150),
    allowNull: false,
    unique:    true,
    validate:  { isEmail: { msg: 'Email inválido' } },
    set(val) { this.setDataValue('Email', val.toLowerCase().trim()); },
  },
  PasswordHash: {
    type:      DataTypes.STRING(255),
    allowNull: false,
  },
  Rol: {
    type:         DataTypes.STRING(10),
    allowNull:    false,
    defaultValue: 'cliente',
    validate:     { isIn: { args: [['cliente', 'admin']], msg: 'Rol inválido' } },
  },
  Telefono:    { type: DataTypes.STRING(20),  allowNull: true },
  Calle:       { type: DataTypes.STRING(200), allowNull: true },
  Ciudad:      { type: DataTypes.STRING(100), allowNull: true },
  Departamento:{ type: DataTypes.STRING(100), allowNull: true },
  CodigoPostal:{ type: DataTypes.STRING(20),  allowNull: true },
  Activo: {
    type:         DataTypes.BOOLEAN,
    allowNull:    false,
    defaultValue: true,
  },
}, {
  tableName:  'Users',
  timestamps: true,
  createdAt:  'CreadoEn',
  updatedAt:  'ActualizadoEn',
});

User.beforeSave(async (user) => {
  if (user.changed('PasswordHash') && !user.PasswordHash.startsWith('$2')) {
    user.PasswordHash = await bcrypt.hash(user.PasswordHash, 12);
  }
});

User.prototype.compararPassword = async function (pwd) {
  return bcrypt.compare(pwd, this.PasswordHash);
};

User.prototype.toJSON = function () {
  const v = { ...this.get() };
  delete v.PasswordHash;
  return v;
};

module.exports = User;
