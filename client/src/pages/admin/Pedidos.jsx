import React, { useEffect, useState, useCallback } from 'react';
import { FiChevronDown, FiChevronUp, FiFilter } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ESTADOS = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado'];
const COLORES = {
  pendiente: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmado: 'bg-blue-100 text-blue-700 border-blue-200',
  enviado: 'bg-purple-100 text-purple-700 border-purple-200',
  entregado: 'bg-green-100 text-green-700 border-green-200',
  cancelado: 'bg-red-100 text-red-700 border-red-200',
};
const LABELS = { pendiente: 'Pendiente', confirmado: 'Confirmado', enviado: 'Enviado', entregado: 'Entregado', cancelado: 'Cancelado' };

function PedidoRow({ pedido, onEstadoCambio }) {
  const [abierto, setAbierto] = useState(false);
  const [cambiando, setCambiando] = useState(false);

  const handleEstado = async (nuevoEstado) => {
    setCambiando(true);
    try {
      await api.put(`/orders/${pedido._id}/estado`, { estado: nuevoEstado });
      onEstadoCambio(pedido._id, nuevoEstado);
      toast.success(`Estado actualizado a: ${LABELS[nuevoEstado]}`);
    } catch {
      toast.error('Error al cambiar estado');
    } finally { setCambiando(false); }
  };

  const fecha = new Date(pedido.createdAt).toLocaleDateString('es-GT', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full flex flex-wrap items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900 text-sm">{pedido.numeroPedido}</p>
          <p className="text-xs text-gray-500">{pedido.usuario?.nombre} · {fecha}</p>
        </div>
        <span className={`badge border text-xs px-2.5 py-1 ${COLORES[pedido.estado]}`}>{LABELS[pedido.estado]}</span>
        <span className="font-bold text-gray-900 text-sm">Q{pedido.total.toFixed(2)}</span>
        {abierto ? <FiChevronUp className="text-gray-400 shrink-0" /> : <FiChevronDown className="text-gray-400 shrink-0" />}
      </button>

      {abierto && (
        <div className="border-t border-gray-100 bg-gray-50 p-4 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Items */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">PRODUCTOS</p>
              <div className="space-y-2">
                {pedido.items.map(item => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.nombre} ×{item.cantidad}</span>
                    <span className="font-medium">Q{(item.precio * item.cantidad).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-sm">
                <span>Total</span><span className="text-primary-600">Q{pedido.total.toFixed(2)}</span>
              </div>
            </div>
            {/* Envío */}
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-2">DATOS DE ENVÍO</p>
              <div className="text-sm space-y-1 text-gray-700">
                <p><strong>{pedido.datosEnvio.nombre}</strong></p>
                <p>📞 {pedido.datosEnvio.telefono}</p>
                <p>📍 {pedido.datosEnvio.direccion}</p>
                <p>{pedido.datosEnvio.ciudad}, {pedido.datosEnvio.departamento}</p>
                {pedido.datosEnvio.referencias && <p className="text-gray-500 text-xs">Ref: {pedido.datosEnvio.referencias}</p>}
                <p>💳 Pago: {pedido.metodoPago}</p>
              </div>
            </div>
          </div>

          {/* Cambiar estado */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">CAMBIAR ESTADO</p>
            <div className="flex flex-wrap gap-2">
              {ESTADOS.map(estado => (
                <button
                  key={estado}
                  onClick={() => handleEstado(estado)}
                  disabled={cambiando || pedido.estado === estado}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all disabled:opacity-50 disabled:cursor-default ${pedido.estado === estado ? COLORES[estado] + ' cursor-default' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`}
                >
                  {pedido.estado === estado ? '✓ ' : ''}{LABELS[estado]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [paginas, setPaginas] = useState(1);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const params = new URLSearchParams({ limit: 20, page });
      if (filtroEstado) params.append('estado', filtroEstado);
      const { data } = await api.get(`/orders?${params}`);
      setPedidos(data.pedidos);
      setTotal(data.total || data.pedidos.length);
      setPaginas(Math.ceil((data.total || data.pedidos.length) / 20));
    } catch { toast.error('Error al cargar pedidos'); }
    finally { setCargando(false); }
  }, [filtroEstado, page]);

  useEffect(() => { cargar(); }, [cargar]);

  const actualizarEstado = (id, nuevoEstado) => {
    setPedidos(prev => prev.map(p => p._id === id ? { ...p, estado: nuevoEstado } : p));
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-gray-500 text-sm">{total} pedidos en total</p>
        </div>
      </div>

      {/* Filtros por estado */}
      <div className="card p-4 mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <FiFilter className="text-gray-400 shrink-0" />
          <button onClick={() => { setFiltroEstado(''); setPage(1); }} className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${!filtroEstado ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
            Todos
          </button>
          {ESTADOS.map(e => (
            <button key={e} onClick={() => { setFiltroEstado(e); setPage(1); }} className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${filtroEstado === e ? COLORES[e] : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}>
              {LABELS[e]}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de pedidos */}
      {cargando ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
      ) : pedidos.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">📦</div>
          <p>No hay pedidos con este estado</p>
        </div>
      ) : (
        <>
          {pedidos.map(p => <PedidoRow key={p._id} pedido={p} onEstadoCambio={actualizarEstado} />)}
          {paginas > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {[...Array(paginas)].map((_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${page === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
}
