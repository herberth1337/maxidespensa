import React from 'react';
import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function Carrito() {
  const { items, eliminar, actualizarCantidad, total, limpiar } = useCart();

  if (items.length === 0) return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
      <div className="text-7xl mb-6">🛒</div>
      <h2 className="font-display text-2xl font-bold mb-3" style={{ color:'var(--text-primary)' }}>Tu carrito está vacío</h2>
      <p className="mb-8" style={{ color:'var(--text-muted)' }}>Agrega productos desde el catálogo para empezar a comprar.</p>
      <Link to="/catalogo" className="btn-primary inline-flex items-center gap-2">
        <FiShoppingBag /> Ir al catálogo
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold" style={{ color:'var(--text-primary)' }}>
          Mi Carrito <span className="font-normal text-lg" style={{ color:'var(--text-muted)' }}>({items.length} productos)</span>
        </h1>
        <button onClick={limpiar} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors">
          <FiTrash2 /> Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item._id} className="card p-4 flex gap-4 items-center">
              <img src={item.imagen || `https://via.placeholder.com/100?text=P`} alt={item.nombre}
                className="w-20 h-20 object-cover rounded-xl shrink-0"
                style={{ background:'var(--bg-subtle)' }}
                onError={e => { e.target.src='https://via.placeholder.com/100?text=P'; }} />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-2" style={{ color:'var(--text-primary)' }}>{item.nombre}</h3>
                <p className="font-bold text-lg text-primary-600 mt-0.5">Q{item.precio.toFixed(2)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center rounded-lg overflow-hidden" style={{ border:'1.5px solid var(--border-default)' }}>
                    <button onClick={() => actualizarCantidad(item._id, item.cantidad-1)}
                      className="px-2.5 py-1.5 transition-colors" style={{ color:'var(--text-secondary)' }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--bg-subtle)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <FiMinus className="text-xs" />
                    </button>
                    <span className="px-3 text-sm font-semibold" style={{ color:'var(--text-primary)' }}>{item.cantidad}</span>
                    <button onClick={() => actualizarCantidad(item._id, item.cantidad+1)}
                      className="px-2.5 py-1.5 transition-colors" style={{ color:'var(--text-secondary)' }}
                      disabled={item.cantidad >= item.stock}
                      onMouseEnter={e => e.currentTarget.style.background='var(--bg-subtle)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                      <FiPlus className="text-xs" />
                    </button>
                  </div>
                  <span className="text-sm" style={{ color:'var(--text-muted)' }}>= <strong style={{ color:'var(--text-primary)' }}>Q{(item.precio*item.cantidad).toFixed(2)}</strong></span>
                </div>
              </div>
              <button onClick={() => eliminar(item._id)}
                className="p-2 rounded-lg transition-colors shrink-0" style={{ color:'var(--text-muted)' }}
                onMouseEnter={e => { e.currentTarget.style.color='#dc2626'; e.currentTarget.style.background='rgba(239,68,68,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.background='transparent'; }}>
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <h2 className="font-display font-bold text-lg mb-4" style={{ color:'var(--text-primary)' }}>Resumen del pedido</h2>
            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="truncate pr-2" style={{ color:'var(--text-secondary)' }}>{item.nombre} ×{item.cantidad}</span>
                  <span className="font-medium shrink-0" style={{ color:'var(--text-primary)' }}>Q{(item.precio*item.cantidad).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 mb-5" style={{ borderTop:'1px solid var(--border-default)' }}>
              <div className="flex justify-between">
                <span className="font-bold" style={{ color:'var(--text-primary)' }}>Total</span>
                <span className="font-display font-bold text-2xl text-primary-600">Q{total.toFixed(2)}</span>
              </div>
              <p className="text-xs mt-1" style={{ color:'var(--text-muted)' }}>Envío calculado en el checkout</p>
            </div>
            <Link to="/checkout" className="btn-primary w-full justify-center text-base">
              Proceder al pago <FiArrowRight />
            </Link>
            <Link to="/catalogo" className="btn-secondary w-full justify-center text-sm mt-2">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
