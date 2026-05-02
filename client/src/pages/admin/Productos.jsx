import React, { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const FORM_VACIO = { nombre:'', descripcion:'', precio:'', precioAnterior:'', stock:'', categoria:'', imagen:'', destacado:false, unidad:'unidad' };

function Modal({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ background:'rgba(0,0,0,0.6)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up"
        style={{ background:'var(--bg-elevated)', border:'1px solid var(--border-default)' }}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom:'1px solid var(--border-default)' }}>
          <h3 className="font-display font-bold text-lg" style={{ color:'var(--text-primary)' }}>{titulo}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors"
            style={{ color:'var(--text-muted)' }}
            onMouseEnter={e => e.currentTarget.style.background='var(--bg-subtle)'}
            onMouseLeave={e => e.currentTarget.style.background='transparent'}>
            <FiX />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function ConfirmModal({ mensaje, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      style={{ background:'rgba(0,0,0,0.6)' }}>
      <div className="rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-slide-up"
        style={{ background:'var(--bg-elevated)', border:'1px solid var(--border-default)' }}>
        <div className="text-4xl mb-3 text-center">⚠️</div>
        <p className="text-center font-medium mb-5" style={{ color:'var(--text-primary)' }}>{mensaje}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Cancelar</button>
          <button onClick={onConfirm} className="btn-danger flex-1 justify-center">Eliminar</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductos() {
  const [productos,  setProductos]  = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando,   setCargando]   = useState(true);
  const [buscar,     setBuscar]     = useState('');
  const [modal,      setModal]      = useState(null);
  const [editando,   setEditando]   = useState(null);
  const [form,       setForm]       = useState(FORM_VACIO);
  const [guardando,  setGuardando]  = useState(false);
  const [confirmar,  setConfirmar]  = useState(null);
  const [paginacion, setPaginacion] = useState({ page:1, paginas:1, total:0 });

  const cargar = useCallback(async (page=1) => {
    setCargando(true);
    try {
      const params = new URLSearchParams({ limit:15, page });
      if (buscar) params.append('buscar', buscar);
      const { data } = await api.get(`/products?${params}`);
      setProductos(data.productos);
      setPaginacion({ page, paginas:data.paginacion.paginas, total:data.paginacion.total });
    } catch { toast.error('Error al cargar productos'); }
    finally { setCargando(false); }
  }, [buscar]);

  useEffect(() => { cargar(); }, [cargar]);
  useEffect(() => { api.get('/categories').then(r => setCategorias(r.data.categorias)); }, []);

  const abrirCrear = () => { setForm(FORM_VACIO); setEditando(null); setModal('crear'); };
  const abrirEditar = (p) => {
    setForm({ nombre:p.nombre, descripcion:p.descripcion||'', precio:p.precio, precioAnterior:p.precioAnterior||'', stock:p.stock, categoria:p.categoria?._id||'', imagen:p.imagen||'', destacado:p.destacado, unidad:p.unidad||'unidad' });
    setEditando(p); setModal('editar');
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!form.nombre||!form.precio||!form.stock||!form.categoria) { toast.error('Completa los campos obligatorios'); return; }
    setGuardando(true);
    try {
      const payload = { ...form, precio:Number(form.precio), stock:Number(form.stock), precioAnterior:form.precioAnterior?Number(form.precioAnterior):undefined };
      if (modal==='editar') { await api.put(`/products/${editando._id}`, payload); toast.success('Producto actualizado'); }
      else { await api.post('/products', payload); toast.success('Producto creado'); }
      setModal(null); cargar(paginacion.page);
    } catch (err) { toast.error(err.response?.data?.message || 'Error al guardar'); }
    finally { setGuardando(false); }
  };

  const handleEliminar = async (id) => {
    try { await api.delete(`/products/${id}`); toast.success('Producto eliminado'); setConfirmar(null); cargar(paginacion.page); }
    catch { toast.error('Error al eliminar'); }
  };

  const inputStyle = { color:'var(--text-primary)', background:'var(--bg-subtle)', border:'1.5px solid var(--border-default)' };
  const labelStyle = { color:'var(--text-secondary)' };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Productos</h1>
          <p className="text-sm mt-0.5" style={{ color:'var(--text-muted)' }}>{paginacion.total} productos en total</p>
        </div>
        <button onClick={abrirCrear} className="btn-primary flex items-center gap-2"><FiPlus /> Nuevo producto</button>
      </div>

      {/* Búsqueda */}
      <div className="card p-4 mb-5">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }} />
          <input type="text" value={buscar} onChange={e => setBuscar(e.target.value)}
            placeholder="Buscar por nombre..." className="input-field pl-10 text-sm" />
        </div>
      </div>

      {/* Tabla */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead style={{ background:'var(--bg-subtle)', borderBottom:'1px solid var(--border-default)' }}>
              <tr>
                {['Producto','Categoría','Precio','Stock','Destacado','Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                    style={{ color:'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                [...Array(8)].map((_,i) => (
                  <tr key={i} style={{ borderBottom:'1px solid var(--border-default)' }}>
                    {[...Array(6)].map((_,j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 skeleton" /></td>
                    ))}
                  </tr>
                ))
              ) : productos.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center" style={{ color:'var(--text-muted)' }}>No hay productos</td></tr>
              ) : productos.map(p => (
                <tr key={p._id} style={{ borderBottom:'1px solid var(--border-default)' }}
                  onMouseEnter={e => e.currentTarget.style.background='var(--bg-subtle)'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.imagen||`https://via.placeholder.com/40?text=P`} alt={p.nombre}
                        className="w-10 h-10 object-cover rounded-lg shrink-0"
                        style={{ background:'var(--bg-muted)' }}
                        onError={e => { e.target.src=`https://via.placeholder.com/40?text=P`; }} />
                      <span className="font-medium line-clamp-1" style={{ color:'var(--text-primary)' }}>{p.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color:'var(--text-secondary)' }}>{p.categoria?.icono} {p.categoria?.nombre||'—'}</td>
                  <td className="px-4 py-3 font-semibold" style={{ color:'var(--text-primary)' }}>Q{p.precio?.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className="badge text-xs"
                      style={{ background: p.stock>10?'#f0fdf4':p.stock>0?'#fefce8':'#fef2f2', color: p.stock>10?'#15803d':p.stock>0?'#a16207':'#dc2626' }}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.destacado ? <FiCheck className="text-primary-600" /> : <FiX style={{ color:'var(--text-muted)' }} />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => abrirEditar(p)}
                        className="p-1.5 rounded-lg text-blue-500 transition-colors"
                        onMouseEnter={e => e.currentTarget.style.background='rgba(59,130,246,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        <FiEdit2 />
                      </button>
                      <button onClick={() => setConfirmar(p._id)}
                        className="p-1.5 rounded-lg text-red-500 transition-colors"
                        onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginacion.paginas > 1 && (
          <div className="flex justify-center gap-2 p-4" style={{ borderTop:'1px solid var(--border-default)' }}>
            {[...Array(paginacion.paginas)].map((_,i) => (
              <button key={i} onClick={() => cargar(i+1)}
                className="w-9 h-9 rounded-xl text-sm font-semibold transition-all"
                style={{ background: paginacion.page===i+1?'#16a34a':'var(--bg-subtle)', color: paginacion.page===i+1?'#fff':'var(--text-secondary)' }}>
                {i+1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal Crear/Editar */}
      {modal && (
        <Modal titulo={modal==='crear'?'Nuevo Producto':'Editar Producto'} onClose={() => setModal(null)}>
          <form onSubmit={handleGuardar} className="space-y-4">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={labelStyle}>Nombre *</label>
              <input value={form.nombre} onChange={e => setForm(p=>({...p,nombre:e.target.value}))} className="input-field text-sm" required placeholder="Nombre del producto" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={labelStyle}>Descripción</label>
              <textarea value={form.descripcion} onChange={e => setForm(p=>({...p,descripcion:e.target.value}))} rows={2} className="input-field text-sm resize-none" placeholder="Descripción breve..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold mb-1 block" style={labelStyle}>Precio (Q) *</label>
                <input type="number" value={form.precio} onChange={e => setForm(p=>({...p,precio:e.target.value}))} className="input-field text-sm" min="0" step="0.01" placeholder="0.00" required />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={labelStyle}>Precio anterior (Q)</label>
                <input type="number" value={form.precioAnterior} onChange={e => setForm(p=>({...p,precioAnterior:e.target.value}))} className="input-field text-sm" min="0" step="0.01" placeholder="Opcional" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold mb-1 block" style={labelStyle}>Stock *</label>
                <input type="number" value={form.stock} onChange={e => setForm(p=>({...p,stock:e.target.value}))} className="input-field text-sm" min="0" placeholder="0" required />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={labelStyle}>Unidad</label>
                <select value={form.unidad} onChange={e => setForm(p=>({...p,unidad:e.target.value}))} className="input-field text-sm cursor-pointer">
                  {['unidad','kg','g','litro','ml','paquete','caja','bolsa'].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={labelStyle}>Categoría *</label>
              <select value={form.categoria} onChange={e => setForm(p=>({...p,categoria:e.target.value}))} className="input-field text-sm cursor-pointer" required>
                <option value="">Seleccionar categoría...</option>
                {categorias.map(c => <option key={c._id} value={c._id}>{c.icono} {c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={labelStyle}>URL de imagen</label>
              <input type="url" value={form.imagen} onChange={e => setForm(p=>({...p,imagen:e.target.value}))} className="input-field text-sm" placeholder="https://..." />
            </div>
            {form.imagen && (
              <img src={form.imagen} alt="Preview" className="w-full h-32 object-cover rounded-xl"
                onError={e => { e.target.style.display='none'; }} />
            )}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.destacado} onChange={e => setForm(p=>({...p,destacado:e.target.checked}))} className="w-4 h-4 rounded" />
              <span className="text-sm font-medium" style={{ color:'var(--text-primary)' }}>⭐ Marcar como producto destacado</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1 justify-center">Cancelar</button>
              <button type="submit" disabled={guardando} className="btn-primary flex-1 justify-center gap-2 disabled:opacity-60">
                {guardando ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <FiCheck />}
                {modal==='crear'?'Crear':'Guardar cambios'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {confirmar && (
        <ConfirmModal
          mensaje="¿Seguro que deseas eliminar este producto?"
          onConfirm={() => handleEliminar(confirmar)}
          onClose={() => setConfirmar(null)}
        />
      )}
    </AdminLayout>
  );
}
