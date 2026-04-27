// server/routes/users.js
const express  = require('express');
const router   = express.Router();
const { User } = require('../models/index');
const { proteger, soloAdmin } = require('../middleware/auth');

// Mapear usuario al formato que espera el frontend
const mapUsuario = (u) => ({
  _id:         u.UserId,
  nombre:      u.Nombre,
  email:       u.Email,
  rol:         u.Rol,
  telefono:    u.Telefono,
  activo:      u.Activo,
  createdAt:   u.CreadoEn,
  direccion: {
    calle:        u.Calle,
    ciudad:       u.Ciudad,
    departamento: u.Departamento,
  },
});

// GET /api/users/perfil
router.get('/perfil', proteger, (req, res) =>
  res.json({ success: true, usuario: mapUsuario(req.usuario) })
);

// PUT /api/users/perfil
router.put('/perfil', proteger, async (req, res) => {
  try {
    const { nombre, telefono, direccion } = req.body;
    await User.update({
      Nombre:       nombre,
      Telefono:     telefono          || null,
      Calle:        direccion?.calle       || null,
      Ciudad:       direccion?.ciudad      || null,
      Departamento: direccion?.departamento || null,
    }, { where: { UserId: req.usuario.UserId } });

    const usuario = await User.findByPk(req.usuario.UserId);
    res.json({ success: true, message: 'Perfil actualizado.', usuario: mapUsuario(usuario) });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/users/cambiar-password
router.put('/cambiar-password', proteger, async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;
    const usuario = await User.findOne({
      where: { UserId: req.usuario.UserId },
      attributes: { include: ['PasswordHash'] },
    });
    if (!(await usuario.compararPassword(passwordActual)))
      return res.status(401).json({ success: false, message: 'Contraseña actual incorrecta.' });

    usuario.PasswordHash = passwordNueva;
    await usuario.save();
    res.json({ success: true, message: 'Contraseña actualizada.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users  🔒 admin
router.get('/', proteger, soloAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await User.findAndCountAll({
      order:  [['CreadoEn', 'DESC']],
      limit:  Number(limit),
      offset,
    });
    res.json({ success: true, usuarios: rows.map(mapUsuario), total: count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/:id/rol  🔒 admin
router.put('/:id/rol', proteger, soloAdmin, async (req, res) => {
  try {
    const [updated] = await User.update(
      { Rol: req.body.rol },
      { where: { UserId: req.params.id } }
    );
    if (!updated)
      return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    const usuario = await User.findByPk(req.params.id);
    res.json({ success: true, message: 'Rol actualizado.', usuario: mapUsuario(usuario) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;