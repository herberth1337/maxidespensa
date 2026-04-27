import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi';
import api from '../utils/api';

const ESTADOS = { pendiente: 'Pendiente', confirmado: 'Confirmado', enviado: 'En camino', entregado: 'Entregado' };
const COLORES = { pendiente: 'bg-yellow-100 text-yellow-700', confirmado: 'bg-blue-100 text-blue-700', enviado: 'bg-purple-100 text-purple-700', entregado: 'bg-green-100 text-green-700' };

export default function PedidoConfirmado() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);

  useEffect(() => { api.get(`/orders/${id}`).then(r => setPedido(r.data.pedido)); }, [id]);

  if (!pedido) return <div className="flex justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-center">
      <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-5">
        <FiCheckCircle className="text-primary-600 text-4xl" />
      </div>
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">¡Pedido confirmado!</h1>
      <p className="text-gray-500 mb-6">Gracias por tu compra. Te notificaremos cuando tu pedido esté en camino.</p>

      <div className="card p-5 text-left mb-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs text-gray-500 font-medium">Número de pedido</p>
            <p className="font-display font-bold text-gray-900">{pedido.numeroPedido}</p>
          </div>
          <span className={`badge text-sm px-3 py-1 ${COLORES[pedido.estado]}`}>{ESTADOS[pedido.estado]}</span>
        </div>

        <div className="border-t border-gray-100 pt-4 space-y-2 mb-4">
          {pedido.items.map(item => (
            <div key={item._id} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.nombre} ×{item.cantidad}</span>
              <span className="font-medium">Q{(item.precio * item.cantidad).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
          <span>Total pagado</span>
          <span className="font-display text-xl text-primary-600">Q{pedido.total.toFixed(2)}</span>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-xl text-sm text-gray-600">
          <p className="font-semibold mb-1">📦 Dirección de entrega</p>
          <p>{pedido.datosEnvio.nombre}</p>
          <p>{pedido.datosEnvio.direccion}, {pedido.datosEnvio.ciudad}</p>
          <p>{pedido.datosEnvio.departamento}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/mis-pedidos" className="btn-secondary flex items-center justify-center gap-2">
          <FiPackage /> Ver mis pedidos
        </Link>
        <Link to="/catalogo" className="btn-primary flex items-center justify-center gap-2">
          Seguir comprando <FiArrowRight />
        </Link>
      </div>
    </div>
  );
}
