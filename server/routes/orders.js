// server/routes/orders.js
const express    = require('express');
const router     = express.Router();
const { sequelize } = require('../config/database');
const { Order, OrderItem, Product, User } = require('../models/index');
const { proteger, soloAdmin } = require('../middleware/auth');

// Mapear pedido al formato que espera el frontend
const mapPedido = (o) => ({
  _id:          o.OrderId,
  numeroPedido: o.NumeroPedido,
  total:        parseFloat(o.Total),
  estado:       o.Estado,
  metodoPago:   o.MetodoPago,
  notas:        o.Notas,
  createdAt:    o.CreadoEn,
  updatedAt:    o.ActualizadoEn,
  datosEnvio: {
    nombre:       o.EnvioNombre,
    telefono:     o.EnvioTelefono,
    direccion:    o.EnvioDireccion,
    ciudad:       o.EnvioCiudad,
    departamento: o.EnvioDepartamento,
    referencias:  o.EnvioReferencias,
  },
  usuario: o.usuario ? {
    _id:    o.usuario.UserId,
    nombre: o.usuario.Nombre,
    email:  o.usuario.Email,
  } : null,
  items: o.items ? o.items.map(i => ({
    _id:      i.OrderItemId,
    nombre:   i.NombreProducto,
    precio:   parseFloat(i.PrecioUnitario),
    cantidad: i.Cantidad,
    imagen:   i.Imagen,
    producto: i.producto ? {
      _id:    i.producto.ProductId,
      nombre: i.producto.Nombre,
      imagen: i.producto.Imagen,
    } : null,
  })) : [],
});

// GET /api/orders/mis-pedidos
router.get('/mis-pedidos', proteger, async (req, res) => {
  try {
    const pedidos = await Order.findAll({
      where:   { UserId: req.usuario.UserId },
      include: [{ model: OrderItem, as: 'items' }],
      order:   [['CreadoEn', 'DESC']],
    });
    res.json({ success: true, pedidos: pedidos.map(mapPedido) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders  🔒 admin
router.get('/', proteger, soloAdmin, async (req, res) => {
  try {
    const { estado, page = 1, limit = 20 } = req.query;
    const where  = estado ? { Estado: estado } : {};
    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Order.findAndCountAll({
      where,
      include: [
        { model: User,      as: 'usuario', attributes: ['UserId','Nombre','Email'] },
        { model: OrderItem, as: 'items' },
      ],
      order:  [['CreadoEn', 'DESC']],
      limit:  Number(limit),
      offset,
    });
    res.json({ success: true, pedidos: rows.map(mapPedido), total: count });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/orders/:id
router.get('/:id', proteger, async (req, res) => {
  try {
    const pedido = await Order.findByPk(req.params.id, {
      include: [
        { model: User,      as: 'usuario', attributes: ['UserId','Nombre','Email'] },
        { model: OrderItem, as: 'items',
          include: [{ model: Product, as: 'producto', attributes: ['ProductId','Nombre','Imagen','Precio'] }] },
      ],
    });
    if (!pedido)
      return res.status(404).json({ success: false, message: 'Pedido no encontrado.' });

    if (pedido.UserId !== req.usuario.UserId && req.usuario.Rol !== 'admin')
      return res.status(403).json({ success: false, message: 'No autorizado.' });

    res.json({ success: true, pedido: mapPedido(pedido) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/orders
router.post('/', proteger, async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { items, datosEnvio, metodoPago, notas } = req.body;

    if (!items?.length) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'El carrito está vacío.' });
    }

    let total = 0;
    const itemsVerificados = [];

    for (const item of items) {
      const producto = await Product.findByPk(item.producto, { transaction: t });
      if (!producto?.Activo) {
        await t.rollback();
        return res.status(400).json({ success: false, message: `Producto no disponible: ${item.nombre}` });
      }
      if (producto.Stock < item.cantidad) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para ${producto.Nombre}. Disponible: ${producto.Stock}`,
        });
      }
      total += parseFloat(producto.Precio) * item.cantidad;
      itemsVerificados.push({
        ProductId:      producto.ProductId,
        NombreProducto: producto.Nombre,
        PrecioUnitario: producto.Precio,
        Cantidad:       item.cantidad,
        Imagen:         producto.Imagen,
      });
      await producto.update({ Stock: producto.Stock - item.cantidad }, { transaction: t });
    }

    const NumeroPedido = 'MD-' + Date.now().toString(36).toUpperCase() +
                         '-' + Math.random().toString(36).substr(2,4).toUpperCase();

    const pedido = await Order.create({
      UserId:            req.usuario.UserId,
      NumeroPedido,
      Total:             total,
      EnvioNombre:       datosEnvio.nombre,
      EnvioTelefono:     datosEnvio.telefono,
      EnvioDireccion:    datosEnvio.direccion,
      EnvioCiudad:       datosEnvio.ciudad,
      EnvioDepartamento: datosEnvio.departamento,
      EnvioReferencias:  datosEnvio.referencias || null,
      MetodoPago:        metodoPago || 'efectivo',
      Notas:             notas || null,
    }, { transaction: t });

    await OrderItem.bulkCreate(
      itemsVerificados.map(i => ({ ...i, OrderId: pedido.OrderId })),
      { transaction: t }
    );

    await t.commit();

    const pedidoCompleto = await Order.findByPk(pedido.OrderId, {
      include: [{ model: OrderItem, as: 'items' }],
    });

    res.status(201).json({
      success: true,
      message: '¡Pedido realizado exitosamente!',
      pedido:  mapPedido(pedidoCompleto),
    });
  } catch (err) {
    await t.rollback();
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/orders/:id/estado  🔒 admin
router.put('/:id/estado', proteger, soloAdmin, async (req, res) => {
  try {
    const { estado } = req.body;
    const [updated] = await Order.update({ Estado: estado }, { where: { OrderId: req.params.id } });
    if (!updated)
      return res.status(404).json({ success: false, message: 'Pedido no encontrado.' });

    const pedido = await Order.findByPk(req.params.id, {
      include: [{ model: User, as: 'usuario', attributes: ['Nombre','Email'] }],
    });
    res.json({ success: true, message: 'Estado actualizado.', pedido: mapPedido(pedido) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
