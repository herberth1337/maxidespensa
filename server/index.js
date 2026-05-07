// server/index.js
const express      = require('express');
const cors         = require('cors');
const dotenv       = require('dotenv');
const path         = require('path');
const { conectar } = require('./config/database');

dotenv.config();
require('./models/index');

const app = express();

app.use(cors({
  origin:      process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rutas ──────────────────────────────────────────────────────
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/users',      require('./routes/users'));
app.use('/api/products',   require('./routes/products'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/reviews',    require('./routes/reviews'));   // ← NUEVO

app.get('/api/health', (_req, res) =>
  res.json({ status: 'OK', db: 'SQL Server', message: 'MaxiDespensa API funcionando' })
);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;

conectar().then(() => {
  app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
});

module.exports = app;
