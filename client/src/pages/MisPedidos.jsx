import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import api from '../utils/api';

const ESTADOS = { pendiente: 'Pendiente', confirmado: 'Confirmado', enviado: 'En camino', entregado: 'Entregado', cancelado: 'Cancelado' };
const COLORES = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  confirmado: 'bg-blue-100 text-blue-700',
  enviado: 'bg-purple-100 text-purple-700',
  entregado: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700'
};

function PedidoCard({ pedido }) {
  const [abierto, setAbierto] = useState(false);
  const fecha = new Date(pedido.createdAt).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="card overflow-hidden">
      <button onClick={() => setAbierto(!abierto)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
            <FiPackage className="text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{pedido.numeroPedido}</p>
            <p className="text-xs text-gray-500">{fecha} · {pedido.items.length} producto{pedido.items.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`badge px-3 py-1 ${COLORES[pedido.estado]}`}>{ESTADOS[pedido.estado]}</span>
          <span className="font-display font-bold text-gray-900 hidden sm:block">Q{pedido.total.toFixed(2)}</span>
          {abierto ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
        </div>
      </button>

      {abierto && (
        <div className="border-t border-gray-100 p-4 animate-slide-up">
          <div className="space-y-2 mb-4">
            {pedido.items.map(item => (
              <div key={item._id} className="flex items-center gap-3">
                <img src={item.imagen || `https://via.placeholder.com/50?text=P`} alt={item.nombre} className="w-12 h-12 object-cover rounded-lg bg-gray-100" onError={e => { e.target.src = `https://via.placeholder.com/50?text=P`; }} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{item.nombre}</p>
                  <p className="text-xs text-gray-500">×{item.cantidad} · Q{item.precio.toFixed(2)} c/u</p>
                </div>
                <p className="font-semibold text-sm">Q{(item.precio * item.cantidad).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between text-sm">
            <span className="text-gray-500">Envío a: {pedido.datosEnvio.ciudad}, {pedido.datosEnvio.departamento}</span>
            <span className="font-bold text-primary-600">Total: Q{pedido.total.toFixed(2)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MisPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get('/orders/mis-pedidos')
      .then(r => setPedidos(r.data.pedidos))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-3">
      {[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Mis Pedidos</h1>

      {pedidos.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="font-display text-xl font-bold mb-3">Aún no tienes pedidos</h3>
          <p className="text-gray-500 mb-6">Cuando realices una compra, aparecerá aquí.</p>
          <Link to="/catalogo" className="btn-primary">Ir a comprar</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {pedidos.map(p => <PedidoCard key={p._id} pedido={p} />)}
        </div>
      )}
    </div>
  );
}
