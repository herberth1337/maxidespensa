import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiSearch } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/products/ProductCard';

const ORDENAR_OPCIONES = [
  { value: 'reciente',    label: 'Más recientes' },
  { value: 'precio_asc',  label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' },
  { value: 'nombre_asc',  label: 'Nombre A-Z' },
];

export default function Catalogo() {
  const [searchParams] = useSearchParams();
  const [productos,  setProductos]  = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [paginacion, setPaginacion] = useState({});
  const [cargando,   setCargando]   = useState(true);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);
  const [filtros, setFiltros] = useState({
    buscar:    searchParams.get('buscar')    || '',
    categoria: searchParams.get('categoria') || '',
    precioMin: '',
    precioMax: '',
    ordenar:   'reciente',
    page:      1,
  });

  useEffect(() => { api.get('/categories').then(r => setCategorias(r.data.categorias)); }, []);

  const cargarProductos = useCallback(async () => {
    setCargando(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filtros).forEach(([k, v]) => { if (v) params.append(k, v); });
      const { data } = await api.get(`/products?${params}`);
      setProductos(data.productos);
      setPaginacion(data.paginacion);
    } catch (err) { console.error(err); }
    finally { setCargando(false); }
  }, [filtros]);

  useEffect(() => { cargarProductos(); }, [cargarProductos]);

  const handleFiltro = (campo, valor) => setFiltros(prev => ({ ...prev, [campo]: valor, page: 1 }));
  const limpiarFiltros = () => setFiltros({ buscar:'', categoria:'', precioMin:'', precioMax:'', ordenar:'reciente', page:1 });
  const hayFiltros = filtros.buscar || filtros.categoria || filtros.precioMin || filtros.precioMax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Catálogo de Productos</h1>
          {!cargando && <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>{paginacion.total || 0} productos encontrados</p>}
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
            className="btn-secondary text-sm py-2 flex items-center gap-2">
            <FiFilter /> Filtros
            {hayFiltros && <span className="w-2 h-2 bg-primary-600 rounded-full" />}
          </button>
          <select value={filtros.ordenar} onChange={e => handleFiltro('ordenar', e.target.value)}
            className="input-field text-sm py-2 w-auto cursor-pointer">
            {ORDENAR_OPCIONES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Panel de filtros */}
      {filtrosAbiertos && (
        <div className="card p-5 mb-6 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Buscar</label>
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color:'var(--text-muted)' }} />
                <input type="text" value={filtros.buscar} onChange={e => handleFiltro('buscar', e.target.value)}
                  placeholder="Nombre del producto..." className="input-field pl-9 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Categoría</label>
              <select value={filtros.categoria} onChange={e => handleFiltro('categoria', e.target.value)}
                className="input-field text-sm cursor-pointer">
                <option value="">Todas las categorías</option>
                {categorias.map(c => <option key={c._id} value={c._id}>{c.icono} {c.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Precio mínimo (Q)</label>
              <input type="number" value={filtros.precioMin} onChange={e => handleFiltro('precioMin', e.target.value)}
                placeholder="0" min="0" className="input-field text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Precio máximo (Q)</label>
              <input type="number" value={filtros.precioMax} onChange={e => handleFiltro('precioMax', e.target.value)}
                placeholder="999" min="0" className="input-field text-sm" />
            </div>
          </div>
          {hayFiltros && (
            <button onClick={limpiarFiltros} className="mt-3 flex items-center gap-1 text-sm text-red-500 hover:text-red-600">
              <FiX /> Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Chips filtros activos */}
      {hayFiltros && (
        <div className="flex flex-wrap gap-2 mb-5">
          {filtros.buscar && (
            <span className="badge gap-1" style={{ background:'var(--bg-subtle)', color:'var(--text-secondary)' }}>
              "{filtros.buscar}" <button onClick={() => handleFiltro('buscar','')}><FiX /></button>
            </span>
          )}
          {filtros.categoria && (
            <span className="badge gap-1" style={{ background:'var(--bg-subtle)', color:'var(--text-secondary)' }}>
              {categorias.find(c => c._id === filtros.categoria)?.nombre}
              <button onClick={() => handleFiltro('categoria','')}><FiX /></button>
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {cargando ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(12)].map((_,i) => (
            <div key={i} className="card">
              <div className="h-44 skeleton" />
              <div className="p-3 space-y-2">
                <div className="h-3 skeleton w-1/3" />
                <div className="h-4 skeleton" />
                <div className="h-8 skeleton mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : productos.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-display text-xl font-bold mb-2" style={{ color:'var(--text-primary)' }}>No encontramos productos</h3>
          <p className="mb-5" style={{ color:'var(--text-muted)' }}>Intenta con otros filtros o busca otro término.</p>
          <button onClick={limpiarFiltros} className="btn-primary">Ver todos los productos</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {productos.map(p => <ProductCard key={p._id} producto={p} />)}
          </div>
          {paginacion.paginas > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {[...Array(paginacion.paginas)].map((_,i) => (
                <button key={i} onClick={() => handleFiltro('page', i+1)}
                  className="w-10 h-10 rounded-xl font-semibold text-sm transition-all"
                  style={{
                    background: filtros.page === i+1 ? '#16a34a' : 'var(--bg-surface)',
                    color:      filtros.page === i+1 ? '#fff'     : 'var(--text-secondary)',
                    border:     `1px solid ${filtros.page === i+1 ? '#16a34a' : 'var(--border-default)'}`,
                  }}>
                  {i+1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
