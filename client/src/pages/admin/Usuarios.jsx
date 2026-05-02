import React, { useEffect, useState, useCallback } from 'react';
import { FiSearch, FiShield, FiUser } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminUsuarios() {
  const [usuarios,  setUsuarios]  = useState([]);
  const [cargando,  setCargando]  = useState(true);
  const [buscar,    setBuscar]    = useState('');
  const [total,     setTotal]     = useState(0);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const { data } = await api.get('/users?limit=100');
      setUsuarios(data.usuarios);
      setTotal(data.total || data.usuarios.length);
    } catch { toast.error('Error al cargar usuarios'); }
    finally { setCargando(false); }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const handleCambiarRol = async (id, rolActual) => {
    const nuevoRol = rolActual === 'admin' ? 'cliente' : 'admin';
    try {
      await api.put(`/users/${id}/rol`, { rol:nuevoRol });
      setUsuarios(prev => prev.map(u => u._id===id ? {...u, rol:nuevoRol} : u));
      toast.success(`Rol cambiado a ${nuevoRol}`);
    } catch { toast.error('Error al cambiar rol'); }
  };

  const filtrados = usuarios.filter(u =>
    u.nombre?.toLowerCase().includes(buscar.toLowerCase()) ||
    u.email?.toLowerCase().includes(buscar.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Usuarios</h1>
          <p className="text-sm mt-0.5" style={{ color:'var(--text-muted)' }}>{total} usuarios registrados</p>
        </div>
      </div>

      {/* Búsqueda */}
      <div className="card p-4 mb-5">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }} />
          <input type="text" value={buscar} onChange={e => setBuscar(e.target.value)}
            placeholder="Buscar por nombre o email..." className="input-field pl-10 text-sm" />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background:'var(--bg-subtle)', borderBottom:'1px solid var(--border-default)' }}>
              <tr>
                {['Usuario','Email','Teléfono','Rol','Registro','Acción'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color:'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                [...Array(6)].map((_,i) => (
                  <tr key={i} style={{ borderBottom:'1px solid var(--border-default)' }}>
                    {[...Array(6)].map((_,j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 skeleton" /></td>
                    ))}
                  </tr>
                ))
              ) : filtrados.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center" style={{ color:'var(--text-muted)' }}>No se encontraron usuarios</td></tr>
              ) : filtrados.map(u => (
                <tr key={u._id} style={{ borderBottom:'1px solid var(--border-default)' }}
                  onMouseEnter={e => e.currentTarget.style.background='var(--bg-subtle)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: u.rol==='admin'?'#f5f3ff':'var(--bg-subtle)' }}>
                        <span className="font-bold text-sm" style={{ color: u.rol==='admin'?'#7c3aed':'var(--text-secondary)' }}>
                          {u.nombre?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium" style={{ color:'var(--text-primary)' }}>{u.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color:'var(--text-secondary)' }}>{u.email}</td>
                  <td className="px-4 py-3" style={{ color:'var(--text-muted)' }}>{u.telefono || '—'}</td>
                  <td className="px-4 py-3">
                    <span className="badge gap-1 text-xs"
                      style={{ background: u.rol==='admin'?'#f5f3ff':'var(--bg-subtle)', color: u.rol==='admin'?'#7c3aed':'var(--text-secondary)' }}>
                      {u.rol==='admin' ? <FiShield className="text-xs" /> : <FiUser className="text-xs" />}
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color:'var(--text-muted)' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('es-GT') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleCambiarRol(u._id, u.rol)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all"
                      style={{
                        background: 'transparent',
                        color:      u.rol==='admin'?'#dc2626':'#7c3aed',
                        border:     `1.5px solid ${u.rol==='admin'?'#fca5a5':'#c4b5fd'}`,
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = u.rol==='admin'?'rgba(239,68,68,0.08)':'rgba(124,58,237,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      {u.rol==='admin' ? '→ Hacer cliente' : '→ Hacer admin'}
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
