import React from 'react';
import { Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function Carrito() {
  const { items, eliminar, actualizarCantidad, total, limpiar } = useCart();

  if (items.length === 0) return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
      <div className="text-7xl mb-6">🛒</div>
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">Tu carrito está vacío</h2>
      <p className="text-gray-500 mb-8">Agrega productos desde el catálogo para empezar a comprar.</p>
      <Link to="/catalogo" className="btn-primary inline-flex items-center gap-2">
        <FiShoppingBag /> Ir al catálogo
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          Mi Carrito <span className="text-gray-400 font-normal text-lg">({items.length} productos)</span>
        </h1>
        <button onClick={limpiar} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors">
          <FiTrash2 /> Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map(item => (
            <div key={item._id} className="card p-4 flex gap-4 items-center">
              <img
                src={item.imagen || `https://via.placeholder.com/100?text=${encodeURIComponent(item.nombre)}`}
                alt={item.nombre}
                className="w-20 h-20 object-cover rounded-xl shrink-0 bg-gray-50"
                onError={e => { e.target.src = `https://via.placeholder.com/100?text=Prod`; }}
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{item.nombre}</h3>
                <p className="text-primary-600 font-bold text-lg">Q{item.precio.toFixed(2)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button onClick={() => actualizarCantidad(item._id, item.cantidad - 1)} className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-600">
                      <FiMinus className="text-xs" />
                    </button>
                    <span className="px-3 text-sm font-semibold">{item.cantidad}</span>
                    <button onClick={() => actualizarCantidad(item._id, item.cantidad + 1)} className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-600" disabled={item.cantidad >= item.stock}>
                      <FiPlus className="text-xs" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">= <strong>Q{(item.precio * item.cantidad).toFixed(2)}</strong></span>
                </div>
              </div>
              <button onClick={() => eliminar(item._id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 shrink-0">
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        {/* Resumen */}
        <div className="lg:col-span-1">
          <div className="card p-5 sticky top-24">
            <h2 className="font-display font-bold text-gray-900 text-lg mb-4">Resumen del pedido</h2>
            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div key={item._id} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate pr-2">{item.nombre} ×{item.cantidad}</span>
                  <span className="font-medium shrink-0">Q{(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3 mb-5">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-display font-bold text-2xl text-primary-600">Q{total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Envío calculado en el checkout</p>
            </div>
            <Link to="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 text-base">
              Proceder al pago <FiArrowRight />
            </Link>
            <Link to="/catalogo" className="btn-secondary w-full flex items-center justify-center gap-2 text-sm mt-2">
              Seguir comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
