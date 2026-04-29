import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ producto }) {
  const { agregar } = useCart();
  const [agregando, setAgregando] = useState(false);

  const descuento = producto.precioAnterior
    ? Math.round((1 - producto.precio / producto.precioAnterior) * 100) : null;

  const handleAgregar = (e) => {
    e.preventDefault();
    if (producto.stock === 0) return;
    setAgregando(true);
    agregar(producto, 1);
    toast.success(`${producto.nombre} agregado al carrito`);
    setTimeout(() => setAgregando(false), 600);
  };

  return (
    <Link to={`/producto/${producto._id}`} className="card group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 block">
      <div className="relative overflow-hidden h-44" style={{ backgroundColor:'var(--bg-subtle)' }}>
        <img
          src={producto.imagen || `https://via.placeholder.com/300x300?text=${encodeURIComponent(producto.nombre)}`}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = `https://via.placeholder.com/300x300?text=P`; }}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {descuento && <span className="badge bg-red-500 text-white">-{descuento}%</span>}
          {producto.destacado && <span className="badge bg-orange-500 text-white">⭐ Destacado</span>}
          {producto.stock === 0 && <span className="badge bg-gray-500 text-white">Agotado</span>}
        </div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-white rounded-full px-3 py-1.5 shadow-lg text-gray-700 text-xs flex items-center gap-1 font-semibold">
            <FiEye /> Ver detalle
          </span>
        </div>
      </div>
      <div className="p-3">
        {producto.categoria && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-1.5"
            style={{ background:'var(--bg-subtle)', color:'var(--text-secondary)' }}>
            {producto.categoria.icono} {producto.categoria.nombre}
          </span>
        )}
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary-600 transition-colors mb-2"
          style={{ color:'var(--text-primary)' }}>
          {producto.nombre}
        </h3>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-lg font-bold" style={{ color:'var(--text-primary)' }}>
              Q{producto.precio.toFixed(2)}
            </span>
            {producto.precioAnterior && (
              <span className="text-xs line-through" style={{ color:'var(--text-muted)' }}>
                Q{producto.precioAnterior.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-xs" style={{ color:'var(--text-muted)' }}>Stock: {producto.stock}</span>
        </div>
        <button onClick={handleAgregar} disabled={producto.stock === 0}
          className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
            producto.stock === 0 ? 'cursor-not-allowed' : agregando ? 'bg-primary-700 text-white scale-95' : 'bg-primary-600 hover:bg-primary-700 text-white active:scale-95'
          }`}
          style={producto.stock === 0 ? { backgroundColor:'var(--bg-muted)', color:'var(--text-muted)' } : {}}>
          <FiShoppingCart className={agregando ? 'animate-bounce' : ''} />
          {agregando ? '¡Agregado!' : producto.stock === 0 ? 'Sin stock' : 'Agregar'}
        </button>
      </div>
    </Link>
  );
}
