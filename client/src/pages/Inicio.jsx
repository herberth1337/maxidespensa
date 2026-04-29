import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShield, FiStar, FiTag } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/products/ProductCard';

export default function Inicio() {
  const [destacados, setDestacados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?destacado=true&limit=8'),
          api.get('/categories')
        ]);
        setDestacados(prodRes.data.productos);
        setCategorias(catRes.data.categorias);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{ background:'linear-gradient(135deg, #15803d 0%, #16a34a 50%, #22c55e 100%)' }} className="text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 relative">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-sm font-medium px-4 py-1.5 rounded-full mb-6" style={{ color:'#fff' }}>
              <FiTag /> Ofertas de temporada disponibles
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-5" style={{ color:'#fff' }}>
              Todo lo que<br />necesitas,<br />
              <span style={{ color:'#bbf7d0' }}>en un solo lugar</span>
            </h1>
            <p className="text-lg mb-8 max-w-md" style={{ color:'rgba(255,255,255,0.85)' }}>
              Productos frescos, mejores precios y la comodidad de comprar desde casa.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => window.location.href='/catalogo'}
                className="flex items-center gap-2 font-bold px-7 py-3 rounded-xl transition-all shadow-lg"
                style={{ background:'#fff', color:'#15803d' }}
                onMouseEnter={e => e.currentTarget.style.background='#f0fdf4'}
                onMouseLeave={e => e.currentTarget.style.background='#fff'}>
                Explorar catálogo <FiArrowRight />
              </button>
              <button onClick={() => window.location.href='/catalogo'}
                className="font-semibold px-7 py-3 rounded-xl transition-all"
                style={{ background:'rgba(255,255,255,0.15)', color:'#fff', border:'1px solid rgba(255,255,255,0.3)' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}>
                Ver ofertas
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-8 relative">
          <div className="flex flex-wrap gap-8">
            {[['500+','Productos'],['10k+','Clientes'],['4.9★','Calificación']].map(([n,l]) => (
              <div key={l}>
                <div className="font-display text-2xl font-bold" style={{ color:'#fff' }}>{n}</div>
                <div className="text-sm" style={{ color:'rgba(255,255,255,0.7)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section style={{ backgroundColor:'var(--bg-surface)', borderBottom:'1px solid var(--border-default)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: FiTruck,  title:'Envío rápido',          desc:'Entrega en 24-48 horas',              bg:'#f0fdf4', color:'#16a34a' },
              { icon: FiShield, title:'Compra segura',         desc:'Pagos 100% protegidos',               bg:'#eff6ff', color:'#2563eb' },
              { icon: FiStar,   title:'Calidad garantizada',   desc:'Productos frescos y seleccionados',   bg:'#fff7ed', color:'#f97316' },
            ].map(({ icon: Icon, title, desc, bg, color }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background:bg }}>
                  <Icon style={{ color, fontSize:20 }} />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>{title}</p>
                  <p className="text-xs mt-0.5" style={{ color:'var(--text-secondary)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Explorar por categoría</h2>
          <Link to="/catalogo" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
            Ver todas <FiArrowRight />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categorias.slice(0, 10).map(cat => (
            <Link key={cat._id} to={`/catalogo?categoria=${cat._id}`}
              className="card p-4 text-center hover:shadow-md transition-all hover:-translate-y-0.5 group">
              <div className="text-3xl mb-2">{cat.icono}</div>
              <p className="text-xs font-semibold group-hover:text-primary-600 transition-colors leading-tight"
                style={{ color:'var(--text-primary)' }}>{cat.nombre}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Productos destacados</h2>
          <Link to="/catalogo" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
            Ver todos <FiArrowRight />
          </Link>
        </div>
        {cargando ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card">
                <div className="h-44 skeleton" />
                <div className="p-3 space-y-2">
                  <div className="h-3 skeleton w-1/3" />
                  <div className="h-4 skeleton" />
                  <div className="h-4 skeleton w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {destacados.map(p => <ProductCard key={p._id} producto={p} />)}
          </div>
        )}
      </section>

      {/* CTA */}
      <section style={{ background:'#0a0f1e' }} className="text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 text-center">
          <h2 className="font-display text-3xl font-bold mb-3" style={{ color:'#fff' }}>¿Listo para empezar?</h2>
          <p className="mb-7" style={{ color:'#64748b' }}>Regístrate y obtén acceso a ofertas exclusivas para nuevos clientes.</p>
          <Link to="/registro" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
            Crear cuenta gratis <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
