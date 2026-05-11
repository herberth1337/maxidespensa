import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiChevronDown, FiChevronUp, FiDownload } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { generarFacturaPDF } from '../utils/generarFactura';
import api from '../utils/api';

const ESTADOS = { pendiente:'Pendiente', confirmado:'Confirmado', enviado:'En camino', entregado:'Entregado', cancelado:'Cancelado' };
const COLORES  = {
  pendiente:  { bg:'#fefce8', color:'#a16207' },
  confirmado: { bg:'#eff6ff', color:'#1d4ed8' },
  enviado:    { bg:'#f5f3ff', color:'#7c3aed' },
  entregado:  { bg:'#f0fdf4', color:'#15803d' },
  cancelado:  { bg:'#fef2f2', color:'#dc2626' },
};

function PedidoCard({ pedido, usuario }) {
  const [abierto,     setAbierto]     = useState(false);
  const [descargando, setDescargando] = useState(false);
  const fecha = new Date(pedido.createdAt).toLocaleDateString('es-GT', { day:'numeric', month:'long', year:'numeric' });
  const col = COLORES[pedido.estado] || { bg:'#f3f4f6', color:'#374151' };

  const handleDescargar = (e) => {
    e.stopPropagation();
    setDescargando(true);
    try { generarFacturaPDF(pedido, usuario); }
    finally { setTimeout(() => setDescargando(false), 1000); }
  };

  return (
    <div className="card overflow-hidden mb-3">
      <button onClick={() => setAbierto(!abierto)}
        className="w-full p-4 flex items-center justify-between text-left transition-colors"
        onMouseEnter={e => e.currentTarget.style.background='var(--bg-subtle)'}
        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background:'var(--bg-subtle)' }}>
            <FiPackage className="text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>{pedido.numeroPedido}</p>
            <p className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>
              {fecha} · {pedido.items?.length || 0} producto(s)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="badge px-3 py-1 text-xs" style={{ background:col.bg, color:col.color }}>
            {ESTADOS[pedido.estado]}
          </span>
          <span className="font-display font-bold hidden sm:block" style={{ color:'var(--text-primary)' }}>
            Q{pedido.total?.toFixed(2)}
          </span>
          {abierto ? <FiChevronUp style={{ color:'var(--text-muted)' }} /> : <FiChevronDown style={{ color:'var(--text-muted)' }} />}
        </div>
      </button>

      {abierto && (
        <div className="p-4 animate-slide-up" style={{ borderTop:'1px solid var(--border-default)', background:'var(--bg-subtle)' }}>
          {/* Items */}
          <div className="space-y-2 mb-4">
            {pedido.items?.map(item => (
              <div key={item._id} className="flex items-center gap-3">
                <img src={item.imagen || `https://via.placeholder.com/48?text=P`} alt={item.nombre}
                  className="w-12 h-12 object-cover rounded-lg shrink-0"
                  style={{ background:'var(--bg-muted)' }}
                  onError={e => { e.target.src='https://via.placeholder.com/48?text=P'; }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color:'var(--text-primary)' }}>{item.nombre}</p>
                  <p className="text-xs" style={{ color:'var(--text-muted)' }}>
                    x{item.cantidad} · Q{item.precio?.toFixed(2)} c/u
                  </p>
                </div>
                <p className="font-semibold text-sm shrink-0" style={{ color:'var(--text-primary)' }}>
                  Q{(item.precio * item.cantidad).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Total y direccion */}
          <div className="flex justify-between text-sm pt-3 mb-4"
            style={{ borderTop:'1px solid var(--border-default)' }}>
            <span style={{ color:'var(--text-muted)' }}>
              Entrega: {pedido.datosEnvio?.ciudad}, {pedido.datosEnvio?.departamento}
            </span>
            <strong className="text-primary-600">Total: Q{pedido.total?.toFixed(2)}</strong>
          </div>

          {/* Boton descargar factura */}
          <button
            onClick={handleDescargar}
            disabled={descargando}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
            style={{ background:'var(--bg-surface)', color:'var(--text-secondary)', border:'1.5px solid var(--border-default)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='#16a34a'; e.currentTarget.style.color='#16a34a'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border-default)'; e.currentTarget.style.color='var(--text-secondary)'; }}
          >
            {descargando
              ? <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
              : <FiDownload />
            }
            {descargando ? 'Generando...' : 'Descargar Factura PDF'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function MisPedidos() {
  const { usuario } = useAuth();
  const [pedidos,  setPedidos]  = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get('/orders/mis-pedidos')
      .then(r => setPedidos(r.data.pedidos))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-3">
      {[...Array(3)].map((_,i) => <div key={i} className="h-20 skeleton rounded-2xl" />)}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold mb-6" style={{ color:'var(--text-primary)' }}>
        Mis Pedidos
      </h1>
      {pedidos.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="font-display text-xl font-bold mb-3" style={{ color:'var(--text-primary)' }}>
            Aun no tienes pedidos
          </h3>
          <p className="mb-6" style={{ color:'var(--text-muted)' }}>
            Cuando realices una compra, aparecera aqui.
          </p>
          <Link to="/catalogo" className="btn-primary">Ir a comprar</Link>
        </div>
      ) : (
        pedidos.map(p => <PedidoCard key={p._id} pedido={p} usuario={usuario} />)
      )}
    </div>
  );
}
