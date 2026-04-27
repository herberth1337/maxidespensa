import React, { useEffect, useState, useCallback } from 'react';
import { FiSearch, FiShield, FiUser } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [buscar, setBuscar] = useState('');
  const [total, setTotal] = useState(0);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const { data } = await api.get('/users?limit=50');
      setUsuarios(data.usuarios);
      setTotal(data.total || data.usuarios.length);
    } catch { toast.error('Error al cargar usuarios'); }
    finally { setCargando(false); }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleCambiarRol = async (id, rolActual) => {
    const nuevoRol = rolActual === 'admin' ? 'cliente' : 'admin';
    try {
      await api.put(`/users/${id}/rol`, { rol: nuevoRol });
      setUsuarios(prev => prev.map(u => u._id === id ? { ...u, rol: nuevoRol } : u));
      toast.success(`Rol cambiado a ${nuevoRol}`);
    } catch { toast.error('Error al cambiar rol'); }
  };

  const filtrados = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(buscar.toLowerCase()) ||
    u.email.toLowerCase().includes(buscar.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-gray-500 text-sm">{total} usuarios registrados</p>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="card p-4 mb-5">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" value={buscar}
            onChange={e => setBuscar(e.target.value)}
            placeholder="Buscar por nombre o email..."
            className="input-field pl-10 text-sm"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Usuario', 'Email', 'Teléfono', 'Rol', 'Registro', 'Acción'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {cargando ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td>
                    ))}
                  </tr>
                ))
              ) : filtrados.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No se encontraron usuarios</td></tr>
              ) : filtrados.map(u => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${u.rol === 'admin' ? 'bg-purple-100' : 'bg-primary-100'}`}>
                        <span className={`font-bold text-sm ${u.rol === 'admin' ? 'text-purple-700' : 'text-primary-700'}`}>{u.nombre[0].toUpperCase()}</span>
                      </div>
                      <span className="font-medium text-gray-900">{u.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-gray-600">{u.telefono || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge gap-1 ${u.rol === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                      {u.rol === 'admin' ? <FiShield className="text-xs" /> : <FiUser className="text-xs" />}
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString('es-GT')}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleCambiarRol(u._id, u.rol)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${u.rol === 'admin' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-purple-200 text-purple-600 hover:bg-purple-50'}`}
                    >
                      {u.rol === 'admin' ? '→ Hacer cliente' : '→ Hacer admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
