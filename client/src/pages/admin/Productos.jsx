import React, { useEffect, useState, useCallback } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiCheck } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const FORM_VACIO = { nombre: '', descripcion: '', precio: '', precioAnterior: '', stock: '', categoria: '', imagen: '', destacado: false, unidad: 'unidad' };

function Modal({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-display font-bold text-gray-900">{titulo}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"><FiX /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function ConfirmModal({ mensaje, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-slide-up">
        <div className="text-4xl mb-3 text-center">⚠️</div>
        <p className="text-center text-gray-700 font-medium mb-5">{mensaje}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancelar</button>
          <button onClick={onConfirm} className="btn-danger flex-1">Eliminar</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [buscar, setBuscar] = useState('');
  const [modal, setModal] = useState(null); // null | 'crear' | 'editar'
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [confirmar, setConfirmar] = useState(null);
  const [paginacion, setPaginacion] = useState({ page: 1, paginas: 1, total: 0 });

  const cargar = useCallback(async (page = 1) => {
    setCargando(true);
    try {
      const params = new URLSearchParams({ limit: 15, page });
      if (buscar) params.append('buscar', buscar);
      // Admin necesita ver todos los productos, incluyendo inactivos
      const { data } = await api.get(`/products?${params}`);
      setProductos(data.productos);
      setPaginacion({ page, paginas: data.paginacion.paginas, total: data.paginacion.total });
    } catch { toast.error('Error al cargar productos'); }
    finally { setCargando(false); }
  }, [buscar]);

  useEffect(() => { cargar(); }, [cargar]);
  useEffect(() => { api.get('/categories').then(r => setCategorias(r.data.categorias)); }, []);

  const abrirCrear = () => { setForm(FORM_VACIO); setEditando(null); setModal('crear'); };
  const abrirEditar = (p) => {
    setForm({
      nombre: p.nombre, descripcion: p.descripcion || '', precio: p.precio,
      precioAnterior: p.precioAnterior || '', stock: p.stock,
      categoria: p.categoria?._id || '', imagen: p.imagen || '',
      destacado: p.destacado, unidad: p.unidad || 'unidad'
    });
    setEditando(p);
    setModal('editar');
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.precio || !form.stock || !form.categoria) {
      toast.error('Completa los campos obligatorios'); return;
    }
    setGuardando(true);
    try {
      const payload = { ...form, precio: Number(form.precio), stock: Number(form.stock), precioAnterior: form.precioAnterior ? Number(form.precioAnterior) : undefined };
      if (modal === 'editar') {
        await api.put(`/products/${editando._id}`, payload);
        toast.success('Producto actualizado');
      } else {
        await api.post('/products', payload);
        toast.success('Producto creado');
      }
      setModal(null);
      cargar(paginacion.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar');
    } finally { setGuardando(false); }
  };

  const handleEliminar = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success('Producto eliminado');
      setConfirmar(null);
      cargar(paginacion.page);
    } catch { toast.error('Error al eliminar'); }
  };

  const campo = (key, label, type = 'text', requerido = false, extra = {}) => (
    <div>
      <label className="text-xs font-semibold text-gray-600 mb-1 block">{label}{requerido && ' *'}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: type === 'number' ? e.target.value : e.target.value }))}
        className="input-field text-sm"
        required={requerido}
        {...extra}
      />
    </div>
  );

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-gray-500 text-sm">{paginacion.total} productos en total</p>
        </div>
        <button onClick={abrirCrear} className="btn-primary flex items-center gap-2">
          <FiPlus /> Nuevo producto
        </button>
      </div>

      {/* Búsqueda */}
      <div className="card p-4 mb-5">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text" value={buscar}
            onChange={e => setBuscar(e.target.value)}
            placeholder="Buscar por nombre..."
            className="input-field pl-10 text-sm"
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Producto', 'Categoría', 'Precio', 'Stock', 'Destacado', 'Acciones'].map(h => (
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
              ) : productos.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-gray-400">No hay productos</td></tr>
              ) : productos.map(p => (
                <tr key={p._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.imagen || `https://via.placeholder.com/40?text=P`} alt={p.nombre} className="w-10 h-10 object-cover rounded-lg bg-gray-100 shrink-0" onError={e => { e.target.src = `https://via.placeholder.com/40?text=P`; }} />
                      <span className="font-medium text-gray-900 line-clamp-1">{p.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{p.categoria?.icono} {p.categoria?.nombre || '—'}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">Q{p.precio.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${p.stock > 10 ? 'bg-green-100 text-green-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.destacado ? <FiCheck className="text-primary-600" /> : <FiX className="text-gray-300" />}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => abrirEditar(p)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors" title="Editar">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => setConfirmar(p._id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors" title="Eliminar">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {paginacion.paginas > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            {[...Array(paginacion.paginas)].map((_, i) => (
              <button key={i} onClick={() => cargar(i + 1)} className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${paginacion.page === i + 1 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal Crear/Editar */}
      {modal && (
        <Modal titulo={modal === 'crear' ? 'Nuevo Producto' : 'Editar Producto'} onClose={() => setModal(null)}>
          <form onSubmit={handleGuardar} className="space-y-4">
            {campo('nombre', 'Nombre', 'text', true, { placeholder: 'Nombre del producto' })}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Descripción</label>
              <textarea value={form.descripcion} onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} rows={2} className="input-field text-sm resize-none" placeholder="Descripción breve..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {campo('precio', 'Precio (Q) *', 'number', true, { min: 0, step: '0.01', placeholder: '0.00' })}
              {campo('precioAnterior', 'Precio anterior (Q)', 'number', false, { min: 0, step: '0.01', placeholder: 'Opcional' })}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {campo('stock', 'Stock *', 'number', true, { min: 0, placeholder: '0' })}
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Unidad</label>
                <select value={form.unidad} onChange={e => setForm(p => ({ ...p, unidad: e.target.value }))} className="input-field text-sm cursor-pointer">
                  {['unidad', 'kg', 'g', 'litro', 'ml', 'paquete', 'caja', 'bolsa'].map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">Categoría *</label>
              <select value={form.categoria} onChange={e => setForm(p => ({ ...p, categoria: e.target.value }))} className="input-field text-sm cursor-pointer" required>
                <option value="">Seleccionar categoría...</option>
                {categorias.map(c => <option key={c._id} value={c._id}>{c.icono} {c.nombre}</option>)}
              </select>
            </div>
            {campo('imagen', 'URL de imagen', 'url', false, { placeholder: 'https://...' })}
            {form.imagen && (
              <img src={form.imagen} alt="Preview" className="w-full h-32 object-cover rounded-xl" onError={e => { e.target.style.display = 'none'; }} />
            )}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.destacado} onChange={e => setForm(p => ({ ...p, destacado: e.target.checked }))} className="w-4 h-4 rounded text-primary-600" />
              <span className="text-sm font-medium text-gray-700">⭐ Marcar como producto destacado</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModal(null)} className="btn-secondary flex-1">Cancelar</button>
              <button type="submit" disabled={guardando} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
                {guardando ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <FiCheck />}
                {modal === 'crear' ? 'Crear' : 'Guardar cambios'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm Eliminar */}
      {confirmar && (
        <ConfirmModal
          mensaje="¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer."
          onConfirm={() => handleEliminar(confirmar)}
          onClose={() => setConfirmar(null)}
        />
      )}
    </AdminLayout>
  );
}
