// server/routes/reviews.js
const express    = require('express');
const router     = express.Router();
const { Op }     = require('sequelize');
const { Review, User, Order, OrderItem, Product } = require('../models/index');
const { proteger, soloAdmin } = require('../middleware/auth');

// Mapear reseña al formato frontend
const mapResena = (r) => ({
  _id:          r.ReviewId,
  calificacion: r.Calificacion,
  comentario:   r.Comentario,
  imagen:       r.Imagen,
  createdAt:    r.CreadoEn,
  usuario: r.usuario ? {
    _id:    r.usuario.UserId,
    nombre: r.usuario.Nombre,
  } : null,
});

// GET /api/reviews/producto/:productId — Ver reseñas de un producto
router.get('/producto/:productId', async (req, res) => {
  try {
    const resenas = await Review.findAll({
      where:   { ProductId: req.params.productId, Activo: true },
      include: [{ model: User, as: 'usuario', attributes: ['UserId','Nombre'] }],
      order:   [['CreadoEn', 'DESC']],
    });

    // Calcular promedio
    const promedio = resenas.length > 0
      ? resenas.reduce((a, r) => a + r.Calificacion, 0) / resenas.length
      : 0;

    // Contar por estrellas
    const distribucion = [5,4,3,2,1].map(n => ({
      estrellas: n,
      cantidad:  resenas.filter(r => r.Calificacion === n).length,
    }));

    res.json({
      success:      true,
      resenas:      resenas.map(mapResena),
      total:        resenas.length,
      promedio:     Math.round(promedio * 10) / 10,
      distribucion,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/reviews/puede-resenir/:productId — ¿Puede el usuario reseñar este producto?
router.get('/puede-resenir/:productId', proteger, async (req, res) => {
  try {
    // Buscar si el usuario compró el producto
    const ordenConProducto = await Order.findOne({
      where:   { UserId: req.usuario.UserId, Estado: 'entregado' },
      include: [{
        model:    OrderItem,
        as:       'items',
        where:    { ProductId: req.params.productId },
        required: true,
      }],
    });

    if (!ordenConProducto) {
      return res.json({ success: true, puede: false, razon: 'No has comprado este producto o tu pedido aún no fue entregado.' });
    }

    // Verificar si ya dejó una reseña para esta orden
    const resenaExistente = await Review.findOne({
      where: {
        ProductId: req.params.productId,
        UserId:    req.usuario.UserId,
        OrderId:   ordenConProducto.OrderId,
      },
    });

    if (resenaExistente) {
      return res.json({ success: true, puede: false, razon: 'Ya dejaste una reseña para este producto.', resena: mapResena(resenaExistente) });
    }

    res.json({ success: true, puede: true, ordenId: ordenConProducto.OrderId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/reviews — Crear reseña
router.post('/', proteger, async (req, res) => {
  try {
    const { productId, ordenId, calificacion, comentario, imagen } = req.body;

    // Validar calificación
    if (!calificacion || calificacion < 1 || calificacion > 5) {
      return res.status(400).json({ success: false, message: 'La calificación debe ser entre 1 y 5.' });
    }

    // Verificar que el usuario compró el producto en esa orden
    const orden = await Order.findOne({
      where:   { OrderId: ordenId, UserId: req.usuario.UserId, Estado: 'entregado' },
      include: [{
        model:    OrderItem,
        as:       'items',
        where:    { ProductId: productId },
        required: true,
      }],
    });

    if (!orden) {
      return res.status(403).json({ success: false, message: 'Solo puedes reseñar productos que hayas comprado y recibido.' });
    }

    // Verificar que no exista ya una reseña
    const existe = await Review.findOne({
      where: { ProductId: productId, UserId: req.usuario.UserId, OrderId: ordenId },
    });
    if (existe) {
      return res.status(400).json({ success: false, message: 'Ya dejaste una reseña para este producto.' });
    }

    const resena = await Review.create({
      ProductId:    productId,
      UserId:       req.usuario.UserId,
      OrderId:      ordenId,
      Calificacion: calificacion,
      Comentario:   comentario || null,
      Imagen:       imagen || null,
    });

    const conUsuario = await Review.findByPk(resena.ReviewId, {
      include: [{ model: User, as: 'usuario', attributes: ['UserId','Nombre'] }],
    });

    res.status(201).json({
      success: true,
      message: '¡Gracias por tu reseña!',
      resena:  mapResena(conUsuario),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/reviews/:id — Eliminar reseña (admin o dueño)
router.delete('/:id', proteger, async (req, res) => {
  try {
    const resena = await Review.findByPk(req.params.id);
    if (!resena) return res.status(404).json({ success: false, message: 'Reseña no encontrada.' });

    if (resena.UserId !== req.usuario.UserId && req.usuario.Rol !== 'admin') {
      return res.status(403).json({ success: false, message: 'No autorizado.' });
    }

    await resena.update({ Activo: false });
    res.json({ success: true, message: 'Reseña eliminada.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
