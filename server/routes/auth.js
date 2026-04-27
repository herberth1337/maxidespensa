// server/routes/auth.js
const express  = require('express');
const router   = express.Router();
const { body, validationResult } = require('express-validator');
const jwt      = require('jsonwebtoken');
const { User } = require('../models/index');
const { proteger } = require('../middleware/auth');

const generarToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// Mapear usuario al formato que espera el frontend
const mapUsuario = (u) => ({
  id:       u.UserId,
  nombre:   u.Nombre,
  email:    u.Email,
  rol:      u.Rol,
  telefono: u.Telefono,
  activo:   u.Activo,
  direccion: {
    calle:        u.Calle,
    ciudad:       u.Ciudad,
    departamento: u.Departamento,
  },
});

// POST /api/auth/registro
router.post('/registro', [
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty())
    return res.status(400).json({ success: false, errors: errores.array() });

  try {
    const { nombre, email, password, telefono } = req.body;

    const existe = await User.findOne({ where: { Email: email.toLowerCase() } });
    if (existe)
      return res.status(400).json({ success: false, message: 'El email ya está registrado.' });

    const usuario = await User.create({
      Nombre:       nombre,
      Email:        email,
      PasswordHash: password,
      Telefono:     telefono || null,
    });

    res.status(201).json({
      success: true,
      message: '¡Registro exitoso!',
      token:   generarToken(usuario.UserId),
      usuario: mapUsuario(usuario),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty())
    return res.status(400).json({ success: false, errors: errores.array() });

  try {
    const { email, password } = req.body;

    const usuario = await User.findOne({
      where: { Email: email.toLowerCase(), Activo: true },
      attributes: {
        include: ['PasswordHash']
      },
    });

    if (!usuario || !(await usuario.compararPassword(password)))
      return res.status(401).json({ success: false, message: 'Email o contraseña incorrectos.' });

    res.json({
      success: true,
      message: '¡Bienvenido!',
      token:   generarToken(usuario.UserId),
      usuario: mapUsuario(usuario),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', proteger, async (req, res) => {
  try {
    const usuario = await User.findByPk(req.usuario.UserId);
    res.json({ success: true, usuario: mapUsuario(usuario) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;