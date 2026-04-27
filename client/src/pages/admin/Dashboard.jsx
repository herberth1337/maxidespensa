import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';

const COLORES_ESTADO = {
  pendiente: 'bg-yellow-100 text-yellow-700',
  confirmado: 'bg-blue-100 text-blue-700',
  enviado: 'bg-purple-100 text-purple-700',
  entregado: 'bg-green-100 text-green-700',
  cancelado: 'bg-red-100 text-red-700',
};
const LABEL_ESTADO = { pendiente: 'Pendiente', confirmado: 'Confirmado', enviado: 'Enviado', entregado: 'Entregado', cancelado: 'Cancelado' };

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pedidosRecientes, setPedidosRecientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [pedRes, prodRes, userRes] = await Promise.all([
          api.get('/orders?limit=5'),
          api.get('/products?limit=1'),
          api.get('/users?limit=1'),
        ]);
        const pedidos = pedRes.data.pedidos;
        setPedidosRecientes(pedidos);
        const totalVentas = pedidos.reduce((acc, p) => acc + p.total, 0);
        setStats({
          totalPedidos: pedRes.data.total || pedidos.length,
          totalProductos: prodRes.data.paginacion?.total || 0,
          totalUsuarios: userRes.data.total || 0,
          totalVentas,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const tarjetas = [
    { label: 'Pedidos totales', valor: stats?.totalPedidos ?? '—', icono: FiShoppingBag, color: 'bg-blue-50 text-blue-600', link: '/admin/pedidos' },
    { label: 'Productos activos', valor: stats?.totalProductos ?? '—', icono: FiPackage, color: 'bg-primary-50 text-primary-600', link: '/admin/productos' },
    { label: 'Usuarios registrados', valor: stats?.totalUsuarios ?? '—', icono: FiUsers, color: 'bg-purple-50 text-purple-600', link: '/admin/usuarios' },
    { label: 'Ventas recientes (Q)', valor: stats ? `Q${stats.totalVentas.toFixed(2)}` : '—', icono: FiDollarSign, color: 'bg-green-50 text-green-600', link: '/admin/pedidos' },
  ];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm">Resumen general de MaxiDespensa</p>
      </div>

      {/* Tarjetas de stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {tarjetas.map(t => (
          <Link key={t.label} to={t.link} className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${t.color}`}>
                <t.icono className="text-xl" />
              </div>
              <FiArrowRight className="text-gray-300 group-hover:text-gray-500 transition-colors" />
            </div>
            {cargando
              ? <div className="h-8 bg-gray-200 rounded animate-pulse mb-1" />
              : <p className="font-display text-2xl font-bold text-gray-900">{t.valor}</p>
            }
            <p className="text-sm text-gray-500">{t.label}</p>
          </Link>
        ))}
      </div>

      {/* Pedidos recientes */}
      <div className="card">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-display font-bold text-gray-900">Pedidos recientes</h2>
          <Link to="/admin/pedidos" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
            Ver todos <FiArrowRight />
          </Link>
        </div>
        {cargando ? (
          <div className="p-5 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : pedidosRecientes.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No hay pedidos aún</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pedidosRecientes.map(p => (
              <div key={p._id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-gray-900">{p.numeroPedido}</p>
                  <p className="text-xs text-gray-500">{p.usuario?.nombre} · {new Date(p.createdAt).toLocaleDateString('es-GT')}</p>
                </div>
                <span className={`badge px-2.5 py-1 text-xs ${COLORES_ESTADO[p.estado]}`}>{LABEL_ESTADO[p.estado]}</span>
                <span className="font-bold text-gray-900 text-sm shrink-0">Q{p.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
