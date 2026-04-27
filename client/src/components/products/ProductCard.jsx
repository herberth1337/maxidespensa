import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiEye, FiHeart } from 'react-icons/fi';
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
    <Link to={`/producto/${producto._id}`} className="group card hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
      {/* Imagen */}
      <div className="relative overflow-hidden bg-gray-50 h-44">
        <img
          src={producto.imagen || producto.imagenUrl || `https://via.placeholder.com/300x300?text=${encodeURIComponent(producto.nombre)}`}
          alt={producto.nombre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => { e.target.src = `https://via.placeholder.com/300x300?text=${encodeURIComponent(producto.nombre)}`; }}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {descuento && <span className="badge bg-red-500 text-white">-{descuento}%</span>}
          {producto.destacado && <span className="badge bg-accent-500 text-white">⭐ Destacado</span>}
          {producto.stock === 0 && <span className="badge bg-gray-500 text-white">Agotado</span>}
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-white rounded-full p-2 shadow-lg text-gray-700 text-sm flex items-center gap-1">
            <FiEye /> Ver detalle
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        {producto.categoria && (
          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
            {producto.categoria.icono} {producto.categoria.nombre}
          </span>
        )}
        <h3 className="font-semibold text-gray-900 mt-1.5 text-sm leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
          {producto.nombre}
        </h3>

        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-lg font-bold text-gray-900">Q{producto.precio.toFixed(2)}</span>
            {producto.precioAnterior && (
              <span className="text-xs text-gray-400 line-through ml-1.5">Q{producto.precioAnterior.toFixed(2)}</span>
            )}
          </div>
          <span className="text-xs text-gray-500">Stock: {producto.stock}</span>
        </div>

        <button
          onClick={handleAgregar}
          disabled={producto.stock === 0}
          className={`mt-2.5 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold transition-all duration-200
            ${producto.stock === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : agregando
                ? 'bg-primary-700 text-white scale-95'
                : 'bg-primary-600 hover:bg-primary-700 text-white active:scale-95'
            }`}
        >
          <FiShoppingCart className={agregando ? 'animate-bounce' : ''} />
          {agregando ? '¡Agregado!' : producto.stock === 0 ? 'Sin stock' : 'Agregar'}
        </button>
      </div>
    </Link>
  );
}
