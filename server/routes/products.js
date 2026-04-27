// server/routes/products.js
// server/routes/products.js
const express               = require('express');
const router                = express.Router();
const { Op }                = require('sequelize');
const { Product, Category } = require('../models/index');
const { proteger, soloAdmin } = require('../middleware/auth');

// Función para mapear producto a formato que espera el frontend
const mapProducto = (p) => ({
  _id:          p.ProductId,
  nombre:       p.Nombre,
  descripcion:  p.Descripcion,
  precio:       parseFloat(p.Precio),
  precioAnterior: p.PrecioAnterior ? parseFloat(p.PrecioAnterior) : null,
  stock:        p.Stock,
  imagen:       p.Imagen,
  destacado:    p.Destacado,
  activo:       p.Activo,
  unidad:       p.Unidad,
  categoria:    p.categoria ? {
    _id:    p.categoria.CategoryId,
    nombre: p.categoria.Nombre,
    icono:  p.categoria.Icono,
    color:  p.categoria.Color,
  } : null,
});

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const {
      buscar, categoria, precioMin, precioMax,
      destacado, page = 1, limit = 12, ordenar,
    } = req.query;

    const where = { Activo: true };

    if (buscar)
      where[Op.or] = [
        { Nombre:      { [Op.like]: `%${buscar}%` } },
        { Descripcion: { [Op.like]: `%${buscar}%` } },
      ];

    if (categoria)  where.CategoryId = categoria;
    if (destacado === 'true') where.Destacado = true;
    if (precioMin)  where.Precio = { ...where.Precio, [Op.gte]: Number(precioMin) };
    if (precioMax)  where.Precio = { ...where.Precio, [Op.lte]: Number(precioMax) };

    const ordenarMap = {
      precio_asc:  [['Precio', 'ASC']],
      precio_desc: [['Precio', 'DESC']],
      nombre_asc:  [['Nombre', 'ASC']],
      reciente:    [['CreadoEn', 'DESC']],
    };
    const order = ordenarMap[ordenar] || [['CreadoEn', 'DESC']];

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, as: 'categoria', attributes: ['CategoryId','Nombre','Icono','Color'] }],
      order,
      limit:  Number(limit),
      offset,
    });

    res.json({
      success: true,
      productos: rows.map(mapProducto),
      paginacion: {
        total:   count,
        pagina:  Number(page),
        paginas: Math.ceil(count / Number(limit)),
        limite:  Number(limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const producto = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: 'categoria', attributes: ['CategoryId','Nombre','Icono','Color'] }],
    });
    if (!producto)
      return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
    res.json({ success: true, producto: mapProducto(producto) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/products  🔒 admin
router.post('/', proteger, soloAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, precio, precioAnterior, stock, categoria, imagen, destacado, unidad } = req.body;
    const producto = await Product.create({
      Nombre: nombre, Descripcion: descripcion, Precio: precio,
      PrecioAnterior: precioAnterior || null, Stock: stock,
      CategoryId: categoria, Imagen: imagen, Destacado: destacado || false,
      Unidad: unidad || 'unidad',
    });
    const conCat = await Product.findByPk(producto.ProductId, {
      include: [{ model: Category, as: 'categoria', attributes: ['CategoryId','Nombre','Icono','Color'] }],
    });
    res.status(201).json({ success: true, message: 'Producto creado.', producto: mapProducto(conCat) });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/products/:id  🔒 admin
router.put('/:id', proteger, soloAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, precio, precioAnterior, stock, categoria, imagen, destacado, unidad } = req.body;
    const [updated] = await Product.update({
      Nombre: nombre, Descripcion: descripcion, Precio: precio,
      PrecioAnterior: precioAnterior || null, Stock: stock,
      CategoryId: categoria, Imagen: imagen, Destacado: destacado,
      Unidad: unidad,
    }, { where: { ProductId: req.params.id } });

    if (!updated)
      return res.status(404).json({ success: false, message: 'Producto no encontrado.' });

    const producto = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: 'categoria', attributes: ['CategoryId','Nombre','Icono','Color'] }],
    });
    res.json({ success: true, message: 'Producto actualizado.', producto: mapProducto(producto) });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/products/:id  🔒 admin
router.delete('/:id', proteger, soloAdmin, async (req, res) => {
  try {
    const [updated] = await Product.update({ Activo: false }, { where: { ProductId: req.params.id } });
    if (!updated)
      return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
    res.json({ success: true, message: 'Producto eliminado.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;