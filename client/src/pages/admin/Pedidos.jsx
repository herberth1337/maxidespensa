import React, { useEffect, useState, useCallback } from 'react';
import { FiChevronDown, FiChevronUp, FiFilter } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ESTADOS = ['pendiente','confirmado','enviado','entregado','cancelado'];
const LABELS  = { pendiente:'Pendiente', confirmado:'Confirmado', enviado:'Enviado', entregado:'Entregado', cancelado:'Cancelado' };
const COLORES  = {
  pendiente:  { bg:'#fefce8', color:'#a16207' },
  confirmado: { bg:'#eff6ff', color:'#1d4ed8' },
  enviado:    { bg:'#f5f3ff', color:'#7c3aed' },
  entregado:  { bg:'#f0fdf4', color:'#15803d' },
  cancelado:  { bg:'#fef2f2', color:'#dc2626' },
};

function PedidoRow({ pedido, onEstadoCambio }) {
  const [abierto,   setAbierto]   = useState(false);
  const [cambiando, setCambiando] = useState(false);
  const fecha = new Date(pedido.createdAt).toLocaleDateString('es-GT', { day:'2-digit', month:'short', year:'numeric' });
  const col = COLORES[pedido.estado] || { bg:'#f3f4f6', color:'#374151' };

  const handleEstado = async (nuevoEstado) => {
    setCambiando(true);
    try {
      await api.put(`/orders/${pedido._id}/estado`, { estado:nuevoEstado });
      onEstadoCambio(pedido._id, nuevoEstado);
      toast.success(`Estado: ${LABELS[nuevoEstado]}`);
    } catch { toast.error('Error al cambiar estado'); }
    finally { setCambiando(false); }
  };

  return (
    <div className="card mb-3 overflow-hidden">
      <button onClick={() => setAbierto(!abierto)}
        className="w-full flex flex-wrap items-center gap-3 px-4 py-3 text-left transition-colors"
        onMouseEnter={e => e.currentTarget.style.background='var(--bg-subtle)'}
        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>{pedido.numeroPedido}</p>
          <p className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>{pedido.usuario?.nombre} · {fecha}</p>
        </div>
        <span className="badge text-xs px-2.5 py-1" style={{ background:col.bg, color:col.color }}>{LABELS[pedido.estado]}</span>
        <span className="font-bold text-sm" style={{ color:'var(--text-primary)' }}>Q{pedido.total?.toFixed(2)}</span>
        {abierto ? <FiChevronUp style={{ color:'var(--text-muted)' }} /> : <FiChevronDown style={{ color:'var(--text-muted)' }} />}
      </button>

      {abierto && (
        <div className="p-4 animate-slide-up" style={{ borderTop:'1px solid var(--border-default)', background:'var(--bg-subtle)' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color:'var(--text-muted)' }}>Productos</p>
              <div className="space-y-1.5">
                {pedido.items?.map(item => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span style={{ color:'var(--text-secondary)' }}>{item.nombre} ×{item.cantidad}</span>
                    <span className="font-medium" style={{ color:'var(--text-primary)' }}>Q{(item.precio*item.cantidad).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold text-sm mt-2 pt-2" style={{ borderTop:'1px solid var(--border-default)' }}>
                <span style={{ color:'var(--text-primary)' }}>Total</span>
                <span className="text-primary-600">Q{pedido.total?.toFixed(2)}</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color:'var(--text-muted)' }}>Datos de envío</p>
              <div className="text-sm space-y-1" style={{ color:'var(--text-secondary)' }}>
                <p className="font-semibold" style={{ color:'var(--text-primary)' }}>{pedido.datosEnvio?.nombre}</p>
                <p>📞 {pedido.datosEnvio?.telefono}</p>
                <p>📍 {pedido.datosEnvio?.direccion}</p>
                <p>{pedido.datosEnvio?.ciudad}, {pedido.datosEnvio?.departamento}</p>
                <p>💳 Pago: {pedido.metodoPago}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color:'var(--text-muted)' }}>Cambiar estado</p>
            <div className="flex flex-wrap gap-2">
              {ESTADOS.map(estado => {
                const c = COLORES[estado];
                const activo = pedido.estado === estado;
                return (
                  <button key={estado} onClick={() => handleEstado(estado)}
                    disabled={cambiando || activo}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all disabled:cursor-default"
                    style={{
                      background: activo ? c.bg : 'transparent',
                      color:      activo ? c.color : 'var(--text-secondary)',
                      border:     activo ? `1.5px solid ${c.color}` : '1.5px solid var(--border-default)',
                    }}>
                    {activo ? '✓ ' : ''}{LABELS[estado]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPedidos() {
  const [pedidos,  setPedidos]  = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [total,    setTotal]    = useState(0);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const params = new URLSearchParams({ limit:50 });
      if (filtroEstado) params.append('estado', filtroEstado);
      const { data } = await api.get(`/orders?${params}`);
      setPedidos(data.pedidos);
      setTotal(data.total || data.pedidos.length);
    } catch { toast.error('Error al cargar pedidos'); }
    finally { setCargando(false); }
  }, [filtroEstado]);

  useEffect(() => { cargar(); }, [cargar]);

  const actualizarEstado = (id, nuevoEstado) =>
    setPedidos(prev => prev.map(p => p._id===id ? {...p, estado:nuevoEstado} : p));

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Pedidos</h1>
          <p className="text-sm mt-0.5" style={{ color:'var(--text-muted)' }}>{total} pedidos en total</p>
        </div>
      </div>

      {/* Filtros por estado */}
      <div className="card p-4 mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <FiFilter style={{ color:'var(--text-muted)' }} className="shrink-0" />
          <button onClick={() => setFiltroEstado('')}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all"
            style={{ background:!filtroEstado?'var(--text-primary)':'transparent', color:!filtroEstado?'var(--bg-base)':'var(--text-secondary)', border:`1.5px solid ${!filtroEstado?'var(--text-primary)':'var(--border-default)'}` }}>
            Todos
          </button>
          {ESTADOS.map(e => {
            const c = COLORES[e];
            const activo = filtroEstado === e;
            return (
              <button key={e} onClick={() => setFiltroEstado(e)}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all"
                style={{ background:activo?c.bg:'transparent', color:activo?c.color:'var(--text-secondary)', border:`1.5px solid ${activo?c.color:'var(--border-default)'}` }}>
                {LABELS[e]}
              </button>
            );
          })}
        </div>
      </div>

      {cargando ? (
        <div className="space-y-3">
          {[...Array(5)].map((_,i) => <div key={i} className="h-16 skeleton rounded-2xl" />)}
        </div>
      ) : pedidos.length === 0 ? (
        <div className="text-center py-16" style={{ color:'var(--text-muted)' }}>
          <div className="text-5xl mb-3">📦</div>
          <p>No hay pedidos con este estado</p>
        </div>
      ) : (
        pedidos.map(p => <PedidoRow key={p._id} pedido={p} onEstadoCambio={actualizarEstado} />)
      )}
    </AdminLayout>
  );
}
