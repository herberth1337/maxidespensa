import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiShoppingCart, FiArrowLeft, FiPackage } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ProductoDetalle() {
  const { id } = useParams();
  const { agregar } = useCart();
  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProducto(r.data.producto))
      .catch(() => toast.error('Producto no encontrado'))
      .finally(() => setCargando(false));
  }, [id]);

  const handleAgregar = () => {
    agregar(producto, cantidad);
    toast.success(`${cantidad} × ${producto.nombre} al carrito`);
  };

  if (cargando) return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="h-80 bg-gray-200 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
      </div>
    </div>
  );

  if (!producto) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="font-display text-xl font-bold mb-3">Producto no encontrado</h2>
      <Link to="/catalogo" className="btn-primary">Volver al catálogo</Link>
    </div>
  );

  const descuento = producto.precioAnterior
    ? Math.round((1 - producto.precio / producto.precioAnterior) * 100) : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <Link to="/catalogo" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-6 transition-colors">
        <FiArrowLeft /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagen */}
        <div className="card overflow-hidden bg-gray-50">
          <img
            src={producto.imagen || `https://via.placeholder.com/500x400?text=${encodeURIComponent(producto.nombre)}`}
            alt={producto.nombre}
            className="w-full h-80 object-cover"
            onError={e => { e.target.src = `https://via.placeholder.com/500x400?text=${encodeURIComponent(producto.nombre)}`; }}
          />
        </div>

        {/* Detalle */}
        <div>
          {producto.categoria && (
            <Link to={`/catalogo?categoria=${producto.categoria._id}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full mb-3 hover:bg-primary-100 transition-colors">
              {producto.categoria.icono} {producto.categoria.nombre}
            </Link>
          )}

          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">{producto.nombre}</h1>
          {producto.descripcion && <p className="text-gray-600 leading-relaxed mb-5">{producto.descripcion}</p>}

          <div className="flex items-end gap-3 mb-5">
            <span className="font-display text-4xl font-bold text-gray-900">Q{producto.precio.toFixed(2)}</span>
            {producto.precioAnterior && <>
              <span className="text-gray-400 line-through text-lg">Q{producto.precioAnterior.toFixed(2)}</span>
              <span className="badge bg-red-100 text-red-600 text-sm">-{descuento}%</span>
            </>}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <FiPackage className={producto.stock > 0 ? 'text-primary-600' : 'text-gray-400'} />
            <span className={`text-sm font-medium ${producto.stock > 5 ? 'text-primary-600' : producto.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
              {producto.stock > 5 ? `En stock (${producto.stock} disponibles)` : producto.stock > 0 ? `¡Solo quedan ${producto.stock}!` : 'Sin stock'}
            </span>
          </div>

          {producto.stock > 0 && (
            <>
              {/* Selector de cantidad */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm font-semibold text-gray-700">Cantidad:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setCantidad(c => Math.max(1, c - 1))} className="px-3 py-2 hover:bg-gray-50 transition-colors">
                    <FiMinus className="text-gray-600" />
                  </button>
                  <span className="px-4 py-2 font-semibold text-gray-900 min-w-[40px] text-center">{cantidad}</span>
                  <button onClick={() => setCantidad(c => Math.min(producto.stock, c + 1))} className="px-3 py-2 hover:bg-gray-50 transition-colors">
                    <FiPlus className="text-gray-600" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">Subtotal: <strong>Q{(producto.precio * cantidad).toFixed(2)}</strong></span>
              </div>

              <button onClick={handleAgregar} className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3">
                <FiShoppingCart /> Agregar al carrito
              </button>
            </>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-xl text-sm text-gray-600 space-y-1">
            <p>🚚 Envío disponible a toda Guatemala</p>
            <p>✅ Garantía de calidad en todos nuestros productos</p>
            <p>💳 Múltiples métodos de pago aceptados</p>
          </div>
        </div>
      </div>
    </div>
  );
}
