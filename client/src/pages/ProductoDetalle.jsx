import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiShoppingCart, FiArrowLeft, FiPackage } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ProductoDetalle() {
  const { id } = useParams();
  const { agregar } = useCart();
  const [producto,  setProducto]  = useState(null);
  const [cargando,  setCargando]  = useState(true);
  const [cantidad,  setCantidad]  = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProducto(r.data.producto))
      .catch(() => toast.error('Producto no encontrado'))
      .finally(() => setCargando(false));
  }, [id]);

  const handleAgregar = () => { agregar(producto, cantidad); toast.success(`${cantidad} × ${producto.nombre} al carrito`); };

  if (cargando) return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="h-80 skeleton rounded-2xl" />
        <div className="space-y-4">
          <div className="h-6 skeleton w-1/4 rounded" />
          <div className="h-8 skeleton rounded" />
          <div className="h-4 skeleton w-3/4 rounded" />
        </div>
      </div>
    </div>
  );

  if (!producto) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="font-display text-xl font-bold mb-3" style={{ color:'var(--text-primary)' }}>Producto no encontrado</h2>
      <Link to="/catalogo" className="btn-primary">Volver al catálogo</Link>
    </div>
  );

  const descuento = producto.precioAnterior
    ? Math.round((1 - producto.precio / producto.precioAnterior) * 100) : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <Link to="/catalogo" className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-primary-600"
        style={{ color:'var(--text-muted)' }}>
        <FiArrowLeft /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagen */}
        <div className="card overflow-hidden" style={{ background:'var(--bg-subtle)' }}>
          <img src={producto.imagen || `https://via.placeholder.com/500x400?text=${encodeURIComponent(producto.nombre)}`}
            alt={producto.nombre} className="w-full h-80 object-cover"
            onError={e => { e.target.src=`https://via.placeholder.com/500x400?text=P`; }} />
        </div>

        {/* Detalle */}
        <div>
          {producto.categoria && (
            <Link to={`/catalogo?categoria=${producto.categoria._id}`}
              className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full mb-3 transition-colors hover:opacity-80"
              style={{ background:'var(--bg-subtle)', color:'var(--text-secondary)' }}>
              {producto.categoria.icono} {producto.categoria.nombre}
            </Link>
          )}

          <h1 className="font-display text-3xl font-bold mb-2" style={{ color:'var(--text-primary)' }}>{producto.nombre}</h1>
          {producto.descripcion && <p className="leading-relaxed mb-5" style={{ color:'var(--text-secondary)' }}>{producto.descripcion}</p>}

          <div className="flex items-end gap-3 mb-5">
            <span className="font-display text-4xl font-bold" style={{ color:'var(--text-primary)' }}>Q{producto.precio.toFixed(2)}</span>
            {producto.precioAnterior && <>
              <span className="line-through text-lg" style={{ color:'var(--text-muted)' }}>Q{producto.precioAnterior.toFixed(2)}</span>
              <span className="badge bg-red-100 text-red-600 text-sm">-{descuento}%</span>
            </>}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <FiPackage className={producto.stock > 0 ? 'text-primary-600' : 'text-gray-400'} />
            <span className={`text-sm font-medium ${producto.stock > 5 ? 'text-primary-600' : producto.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
              {producto.stock > 5 ? `En stock (${producto.stock} disponibles)` : producto.stock > 0 ? `¡Solo quedan ${producto.stock}!` : 'Sin stock'}
            </span>
          </div>

          {producto.stock > 0 && (
            <>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm font-semibold" style={{ color:'var(--text-primary)' }}>Cantidad:</span>
                <div className="flex items-center rounded-xl overflow-hidden" style={{ border:'1.5px solid var(--border-default)' }}>
                  <button onClick={() => setCantidad(c => Math.max(1,c-1))}
                    className="px-3 py-2 transition-colors" style={{ color:'var(--text-secondary)' }}
                    onMouseEnter={e => e.currentTarget.style.background='var(--bg-subtle)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <FiMinus />
                  </button>
                  <span className="px-4 py-2 font-semibold min-w-[40px] text-center" style={{ color:'var(--text-primary)' }}>{cantidad}</span>
                  <button onClick={() => setCantidad(c => Math.min(producto.stock,c+1))}
                    className="px-3 py-2 transition-colors" style={{ color:'var(--text-secondary)' }}
                    onMouseEnter={e => e.currentTarget.style.background='var(--bg-subtle)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <FiPlus />
                  </button>
                </div>
                <span className="text-sm" style={{ color:'var(--text-muted)' }}>
                  Subtotal: <strong style={{ color:'var(--text-primary)' }}>Q{(producto.precio*cantidad).toFixed(2)}</strong>
                </span>
              </div>
              <button onClick={handleAgregar} className="btn-primary w-full justify-center text-base py-3">
                <FiShoppingCart /> Agregar al carrito
              </button>
            </>
          )}

          <div className="mt-6 p-4 rounded-xl text-sm space-y-1" style={{ background:'var(--bg-subtle)', color:'var(--text-secondary)' }}>
            <p>🚚 Envío disponible a toda Guatemala</p>
            <p>✅ Garantía de calidad en todos nuestros productos</p>
            <p>💳 Múltiples métodos de pago aceptados</p>
          </div>
        </div>
      </div>
    </div>
  );
}
