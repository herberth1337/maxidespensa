import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiShoppingCart, FiArrowLeft, FiPackage, FiStar, FiMessageSquare } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Estrellas from '../components/reviews/Estrellas';
import ListaResenas from '../components/reviews/ListaResenas';
import FormularioResena from '../components/reviews/FormularioResena';

export default function ProductoDetalle() {
  const { id } = useParams();
  const { agregar } = useCart();
  const { usuario } = useAuth();
  const [producto,      setProducto]      = useState(null);
  const [cargando,      setCargando]      = useState(true);
  const [cantidad,      setCantidad]      = useState(1);
  const [resenas,       setResenas]       = useState([]);
  const [promedio,      setPromedio]      = useState(0);
  const [totalResenas,  setTotalResenas]  = useState(0);
  const [distribucion,  setDistribucion]  = useState([]);
  const [puedeResenir,  setPuedeResenir]  = useState(false);
  const [ordenId,       setOrdenId]       = useState(null);
  const [tabActiva,     setTabActiva]     = useState('detalle'); // 'detalle' | 'resenas'
  const [cargandoRes,   setCargandoRes]   = useState(false);

  // Cargar producto
  useEffect(() => {
    api.get(`/products/${id}`)
      .then(r => setProducto(r.data.producto))
      .catch(() => toast.error('Producto no encontrado'))
      .finally(() => setCargando(false));
  }, [id]);

  // Cargar reseñas
  useEffect(() => {
    if (!id) return;
    setCargandoRes(true);
    api.get(`/reviews/producto/${id}`)
      .then(r => {
        setResenas(r.data.resenas);
        setPromedio(r.data.promedio);
        setTotalResenas(r.data.total);
        setDistribucion(r.data.distribucion);
      })
      .catch(console.error)
      .finally(() => setCargandoRes(false));
  }, [id]);

  // Verificar si puede reseñar
  useEffect(() => {
    if (!usuario || !id) return;
    api.get(`/reviews/puede-resenir/${id}`)
      .then(r => {
        setPuedeResenir(r.data.puede);
        if (r.data.puede) setOrdenId(r.data.ordenId);
      })
      .catch(console.error);
  }, [usuario, id]);

  const handleAgregar = () => {
    agregar(producto, cantidad);
    toast.success(`${cantidad} × ${producto.nombre} al carrito`);
  };

  const handleResenaEnviada = (nuevaResena) => {
    setResenas(prev => [nuevaResena, ...prev]);
    setTotalResenas(prev => prev + 1);
    setPuedeResenir(false);
    // Recalcular promedio
    const nuevo = [...resenas, nuevaResena];
    setPromedio(nuevo.reduce((a, r) => a + r.calificacion, 0) / nuevo.length);
    setTabActiva('resenas');
  };

  const handleEliminarResena = (reviewId) => {
    setResenas(prev => prev.filter(r => r._id !== reviewId));
    setTotalResenas(prev => prev - 1);
  };

  if (cargando) return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="h-80 skeleton rounded-2xl" />
        <div className="space-y-4">
          <div className="h-6 skeleton w-1/4 rounded" />
          <div className="h-8 skeleton rounded" />
          <div className="h-4 skeleton w-3/4 rounded" />
        </div>
      </div>
    </div>
  );

  if (!producto) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="font-display text-xl font-bold mb-3" style={{ color:'var(--text-primary)' }}>Producto no encontrado</h2>
      <Link to="/catalogo" className="btn-primary">Volver al catálogo</Link>
    </div>
  );

  const descuento = producto.precioAnterior
    ? Math.round((1 - producto.precio / producto.precioAnterior) * 100) : null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <Link to="/catalogo" className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-primary-600"
        style={{ color:'var(--text-muted)' }}>
        <FiArrowLeft /> Volver al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        {/* Imagen */}
        <div className="card overflow-hidden" style={{ background:'var(--bg-subtle)' }}>
          <img src={producto.imagen || `https://via.placeholder.com/500x400?text=${encodeURIComponent(producto.nombre)}`}
            alt={producto.nombre} className="w-full h-80 object-cover"
            onError={e => { e.target.src=`https://via.placeholder.com/500x400?text=P`; }} />
        </div>

        {/* Info */}
        <div>
          {producto.categoria && (
            <Link to={`/catalogo?categoria=${producto.categoria._id}`}
              className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full mb-3"
              style={{ background:'var(--bg-subtle)', color:'var(--text-secondary)' }}>
              {producto.categoria.icono} {producto.categoria.nombre}
            </Link>
          )}

          <h1 className="font-display text-3xl font-bold mb-2" style={{ color:'var(--text-primary)' }}>{producto.nombre}</h1>

          {/* Estrellas resumen */}
          {totalResenas > 0 && (
            <button onClick={() => setTabActiva('resenas')}
              className="flex items-center gap-2 mb-3 transition-opacity hover:opacity-80">
              <Estrellas valor={promedio} tamaño={16} />
              <span className="text-sm font-medium" style={{ color:'var(--text-secondary)' }}>
                {promedio.toFixed(1)} ({totalResenas} reseña{totalResenas !== 1 ? 's' : ''})
              </span>
            </button>
          )}

          {producto.descripcion && (
            <p className="leading-relaxed mb-5" style={{ color:'var(--text-secondary)' }}>{producto.descripcion}</p>
          )}

          <div className="flex items-end gap-3 mb-5">
            <span className="font-display text-4xl font-bold" style={{ color:'var(--text-primary)' }}>Q{producto.precio.toFixed(2)}</span>
            {producto.precioAnterior && <>
              <span className="line-through text-lg" style={{ color:'var(--text-muted)' }}>Q{producto.precioAnterior.toFixed(2)}</span>
              <span className="badge bg-red-100 text-red-600 text-sm">-{descuento}%</span>
            </>}
          </div>

          <div className="flex items-center gap-2 mb-6">
            <FiPackage className={producto.stock > 0 ? 'text-primary-600' : 'text-gray-400'} />
            <span className={`text-sm font-medium ${producto.stock > 5 ? 'text-primary-600' : producto.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
              {producto.stock > 5 ? `En stock (${producto.stock} disponibles)` : producto.stock > 0 ? `¡Solo quedan ${producto.stock}!` : 'Sin stock'}
            </span>
          </div>

          {producto.stock > 0 && (
            <>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-sm font-semibold" style={{ color:'var(--text-primary)' }}>Cantidad:</span>
                <div className="flex items-center rounded-xl overflow-hidden" style={{ border:'1.5px solid var(--border-default)' }}>
                  <button onClick={() => setCantidad(c => Math.max(1,c-1))}
                    className="px-3 py-2 transition-colors" style={{ color:'var(--text-secondary)' }}
                    onMouseEnter={e => e.currentTarget.style.background='var(--bg-subtle)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <FiMinus />
                  </button>
                  <span className="px-4 py-2 font-semibold min-w-[40px] text-center" style={{ color:'var(--text-primary)' }}>{cantidad}</span>
                  <button onClick={() => setCantidad(c => Math.min(producto.stock,c+1))}
                    className="px-3 py-2 transition-colors" style={{ color:'var(--text-secondary)' }}
                    onMouseEnter={e => e.currentTarget.style.background='var(--bg-subtle)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                    <FiPlus />
                  </button>
                </div>
                <span className="text-sm" style={{ color:'var(--text-muted)' }}>
                  Subtotal: <strong style={{ color:'var(--text-primary)' }}>Q{(producto.precio*cantidad).toFixed(2)}</strong>
                </span>
              </div>
              <button onClick={handleAgregar} className="btn-primary w-full justify-center text-base py-3">
                <FiShoppingCart /> Agregar al carrito
              </button>
            </>
          )}

          <div className="mt-5 p-4 rounded-xl text-sm space-y-1" style={{ background:'var(--bg-subtle)', color:'var(--text-secondary)' }}>
            <p>🚚 Envío disponible a toda Guatemala</p>
            <p>✅ Garantía de calidad en todos nuestros productos</p>
            <p>💳 Múltiples métodos de pago aceptados</p>
          </div>
        </div>
      </div>

      {/* ── TABS: Detalles / Reseñas ───────────────────────── */}
      <div>
        {/* Tab buttons */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background:'var(--bg-subtle)' }}>
          {[
            { key:'detalle',  label:'📋 Detalles',                     count: null },
            { key:'resenas',  label:'⭐ Reseñas',                      count: totalResenas },
          ].map(tab => (
            <button key={tab.key} onClick={() => setTabActiva(tab.key)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: tabActiva === tab.key ? 'var(--bg-surface)' : 'transparent',
                color:      tabActiva === tab.key ? 'var(--text-primary)' : 'var(--text-muted)',
                boxShadow:  tabActiva === tab.key ? 'var(--shadow-sm)' : 'none',
              }}>
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ background:'var(--bg-muted)', color:'var(--text-secondary)' }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab: Detalles */}
        {tabActiva === 'detalle' && (
          <div className="card p-5 animate-fade">
            <h3 className="font-display font-bold mb-3" style={{ color:'var(--text-primary)' }}>Información del producto</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Categoría',  producto.categoria?.nombre || '—'],
                ['Unidad',     producto.unidad || 'unidad'],
                ['Stock',      `${producto.stock} disponibles`],
                ['Estado',     producto.activo ? 'Disponible' : 'No disponible'],
              ].map(([label, val]) => (
                <div key={label} className="p-3 rounded-xl" style={{ background:'var(--bg-subtle)' }}>
                  <p className="text-xs font-semibold mb-1" style={{ color:'var(--text-muted)' }}>{label}</p>
                  <p className="font-medium" style={{ color:'var(--text-primary)' }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Reseñas */}
        {tabActiva === 'resenas' && (
          <div className="animate-fade">
            {/* Formulario si puede reseñar */}
            {usuario && puedeResenir && (
              <div className="mb-6">
                <FormularioResena
                  productId={id}
                  ordenId={ordenId}
                  onResenaEnviada={handleResenaEnviada}
                />
              </div>
            )}

            {/* Mensaje si no puede reseñar */}
            {usuario && !puedeResenir && (
              <div className="mb-5 p-4 rounded-xl text-sm flex items-center gap-3"
                style={{ background:'var(--bg-subtle)', color:'var(--text-secondary)', border:'1px solid var(--border-default)' }}>
                <FiMessageSquare className="text-lg shrink-0" style={{ color:'var(--text-muted)' }} />
                <p>Solo puedes reseñar productos que hayas comprado y cuyo pedido haya sido <strong>entregado</strong>.</p>
              </div>
            )}

            {/* Mensaje si no está logueado */}
            {!usuario && (
              <div className="mb-5 p-4 rounded-xl text-sm" style={{ background:'var(--bg-subtle)', border:'1px solid var(--border-default)' }}>
                <p style={{ color:'var(--text-secondary)' }}>
                  <Link to="/login" className="text-primary-600 font-semibold">Inicia sesión</Link> para dejar una reseña.
                </p>
              </div>
            )}

            {/* Lista de reseñas */}
            {cargandoRes ? (
              <div className="space-y-3">
                {[...Array(3)].map((_,i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
              </div>
            ) : (
              <ListaResenas
                resenas={resenas}
                promedio={promedio}
                total={totalResenas}
                distribucion={distribucion}
                onEliminar={handleEliminarResena}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
