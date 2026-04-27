// server/middleware/auth.js
const jwt      = require('jsonwebtoken');
const { User } = require('../models/index');

const proteger = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer'))
    token = req.headers.authorization.split(' ')[1];

  if (!token)
    return res.status(401).json({ success: false, message: 'No autorizado. Inicia sesión.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await User.findOne({
      where: { UserId: decoded.id, Activo: true },
    });
    if (!usuario)
      return res.status(401).json({ success: false, message: 'Usuario no encontrado o inactivo.' });

    req.usuario = usuario;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token inválido o expirado.' });
  }
};

const soloAdmin = (req, res, next) => {
  if (req.usuario.Rol !== 'admin')
    return res.status(403).json({ success: false, message: 'Se requieren permisos de administrador.' });
  next();
};

module.exports = { proteger, soloAdmin };
