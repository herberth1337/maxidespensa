require('dotenv').config();
const { Sequelize } = require('sequelize');

const isWindowsAuth = process.env.DB_WINDOWS_AUTH === 'true';

const sequelize = new Sequelize(
  process.env.DB_NAME     || 'MaxiDespensa',
  process.env.DB_USER     || 'sa',
  process.env.DB_PASSWORD || 'Admin1234',
  {
    host:    process.env.DB_HOST || 'DESKTOP-TQK76M4',
    port:    parseInt(process.env.DB_PORT || '1433', 10),
    dialect: 'mssql',

    dialectOptions: {
      options: {
        encrypt:                process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: true,
        enableArithAbort:       true,
        instanceName:           process.env.DB_INSTANCE || 'HERBERTH',
      }
    },

    pool: {
      max:     10,
      min:     0,
      acquire: 30000,
      idle:    10000,
    },

    logging: process.env.NODE_ENV === 'development'
      ? (sql) => console.log('\x1b[36m[SQL]\x1b[0m', sql)
      : false,

    define: {
      underscored:     false,
      freezeTableName: true,
      timestamps:      true,
      createdAt:       'CreadoEn',
      updatedAt:       'ActualizadoEn',
    },
  }
);

const conectar = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a SQL Server correctamente.');
  } catch (error) {
    console.error('❌ Error conectando a SQL Server:', error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, conectar };