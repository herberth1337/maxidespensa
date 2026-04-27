// server/routes/categories.js
const express      = require('express');
const router       = express.Router();
const { Category } = require('../models/index');
const { proteger, soloAdmin } = require('../middleware/auth');

const mapCategoria = (c) => ({
  _id:    c.CategoryId,
  nombre: c.Nombre,
  icono:  c.Icono,
  color:  c.Color,
  activo: c.Activo,
});

router.get('/', async (_req, res) => {
  try {
    const categorias = await Category.findAll({
      where: { Activo: true },
      order: [['Nombre', 'ASC']],
    });
    res.json({ success: true, categorias: categorias.map(mapCategoria) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', proteger, soloAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, icono, color } = req.body;
    const categoria = await Category.create({
      Nombre: nombre, Descripcion: descripcion,
      Icono: icono || '🛒', Color: color || '#10b981',
    });
    res.status(201).json({ success: true, categoria: mapCategoria(categoria) });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.put('/:id', proteger, soloAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, icono, color } = req.body;
    const [updated] = await Category.update(
      { Nombre: nombre, Descripcion: descripcion, Icono: icono, Color: color },
      { where: { CategoryId: req.params.id } }
    );
    if (!updated)
      return res.status(404).json({ success: false, message: 'Categoría no encontrada.' });
    const categoria = await Category.findByPk(req.params.id);
    res.json({ success: true, categoria: mapCategoria(categoria) });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.delete('/:id', proteger, soloAdmin, async (req, res) => {
  try {
    await Category.update({ Activo: false }, { where: { CategoryId: req.params.id } });
    res.json({ success: true, message: 'Categoría eliminada.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;