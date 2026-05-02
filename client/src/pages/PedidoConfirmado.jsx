import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi';
import api from '../utils/api';

const ESTADOS = { pendiente:'Pendiente', confirmado:'Confirmado', enviado:'En camino', entregado:'Entregado' };
const COLORES  = {
  pendiente:  { bg:'#fefce8', color:'#a16207' },
  confirmado: { bg:'#eff6ff', color:'#1d4ed8' },
  enviado:    { bg:'#f5f3ff', color:'#7c3aed' },
  entregado:  { bg:'#f0fdf4', color:'#15803d' },
};

export default function PedidoConfirmado() {
  const { id } = useParams();
  const [pedido, setPedido] = useState(null);

  useEffect(() => { api.get(`/orders/${id}`).then(r => setPedido(r.data.pedido)); }, [id]);

  if (!pedido) return (
    <div className="flex justify-center py-20">
      <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
    </div>
  );

  const col = COLORES[pedido.estado] || { bg:'#f3f4f6', color:'#374151' };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-center">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
        style={{ background:'rgba(22,163,74,0.1)' }}>
        <FiCheckCircle className="text-primary-600 text-4xl" />
      </div>
      <h1 className="font-display text-3xl font-bold mb-2" style={{ color:'var(--text-primary)' }}>¡Pedido confirmado!</h1>
      <p className="mb-6" style={{ color:'var(--text-muted)' }}>Gracias por tu compra. Te notificaremos cuando tu pedido esté en camino.</p>

      <div className="card p-5 text-left mb-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color:'var(--text-muted)' }}>Número de pedido</p>
            <p className="font-display font-bold text-lg" style={{ color:'var(--text-primary)' }}>{pedido.numeroPedido}</p>
          </div>
          <span className="badge px-3 py-1 text-sm" style={{ background:col.bg, color:col.color }}>
            {ESTADOS[pedido.estado]}
          </span>
        </div>

        <div className="space-y-2 mb-4" style={{ borderTop:'1px solid var(--border-default)', paddingTop:12 }}>
          {pedido.items?.map(item => (
            <div key={item._id} className="flex justify-between text-sm">
              <span style={{ color:'var(--text-secondary)' }}>{item.nombre} ×{item.cantidad}</span>
              <span className="font-medium" style={{ color:'var(--text-primary)' }}>Q{(item.precio*item.cantidad).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between font-bold pt-3" style={{ borderTop:'1px solid var(--border-default)' }}>
          <span style={{ color:'var(--text-primary)' }}>Total pagado</span>
          <span className="font-display text-xl text-primary-600">Q{pedido.total?.toFixed(2)}</span>
        </div>

        <div className="mt-4 p-3 rounded-xl text-sm" style={{ background:'var(--bg-subtle)', color:'var(--text-secondary)' }}>
          <p className="font-semibold mb-1" style={{ color:'var(--text-primary)' }}>📦 Dirección de entrega</p>
          <p>{pedido.datosEnvio?.nombre}</p>
          <p>{pedido.datosEnvio?.direccion}, {pedido.datosEnvio?.ciudad}</p>
          <p>{pedido.datosEnvio?.departamento}</p>
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
