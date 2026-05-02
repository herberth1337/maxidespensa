import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShield, FiStar, FiTag, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/products/ProductCard';

// Slides del hero con texto personalizado
const SLIDES_DEFAULT = [
  {
    imagen: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&auto=format&fit=crop',
    titulo: 'Todo lo que necesitas,',
    subtitulo: 'en un solo lugar',
    descripcion: 'Productos frescos, mejores precios y la comodidad de comprar desde casa.',
    color: '#bbf7d0',
  },
  {
    imagen: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=1400&auto=format&fit=crop',
    titulo: 'Frutas y verduras',
    subtitulo: 'frescas del día',
    descripcion: 'Seleccionadas directamente del campo para tu mesa.',
    color: '#fef08a',
  },
  {
    imagen: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=1400&auto=format&fit=crop',
    titulo: 'Lácteos y más',
    subtitulo: 'calidad garantizada',
    descripcion: 'Los mejores productos lácteos al mejor precio.',
    color: '#bfdbfe',
  },
  {
    imagen: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1400&auto=format&fit=crop',
    titulo: 'Bebidas y café',
    subtitulo: 'para cada momento',
    descripcion: 'Desde el café matutino hasta los refrescos del día.',
    color: '#fed7aa',
  },
];

export default function Inicio() {
  const [destacados,    setDestacados]    = useState([]);
  const [categorias,    setCategorias]    = useState([]);
  const [cargando,      setCargando]      = useState(true);
  const [slideActual,   setSlideActual]   = useState(0);
  const [animando,      setAnimando]      = useState(false);
  const [slides,        setSlides]        = useState(SLIDES_DEFAULT);

  // Cargar datos
  useEffect(() => {
    const cargar = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?destacado=true&limit=8'),
          api.get('/categories'),
        ]);
        const prods = prodRes.data.productos;
        setDestacados(prods);
        setCategorias(catRes.data.categorias);

        // Usar imágenes de productos reales si tienen imagen
        const prodsConImagen = prods.filter(p => p.imagen && p.imagen.startsWith('http'));
        if (prodsConImagen.length >= 3) {
          setSlides(prodsConImagen.slice(0, 5).map((p, i) => ({
            imagen:      p.imagen,
            titulo:      SLIDES_DEFAULT[i % SLIDES_DEFAULT.length].titulo,
            subtitulo:   p.nombre,
            descripcion: p.descripcion || SLIDES_DEFAULT[i % SLIDES_DEFAULT.length].descripcion,
            color:       SLIDES_DEFAULT[i % SLIDES_DEFAULT.length].color,
            precio:      p.precio,
            categoria:   p.categoria?.nombre,
          })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // Auto-avance cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      cambiarSlide('next');
    }, 5000);
    return () => clearInterval(interval);
  }, [slideActual, slides.length]);

  const cambiarSlide = (dir) => {
    if (animando) return;
    setAnimando(true);
    setTimeout(() => {
      setSlideActual(prev =>
        dir === 'next'
          ? (prev + 1) % slides.length
          : (prev - 1 + slides.length) % slides.length
      );
      setAnimando(false);
    }, 300);
  };

  const slide = slides[slideActual];

  return (
    <div>
      {/* ── HERO CARRUSEL ──────────────────────────────────── */}
      <section className="relative h-[580px] overflow-hidden">

        {/* Imagen de fondo con transición */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url(${slide.imagen})`,
            opacity: animando ? 0 : 1,
            transform: animando ? 'scale(1.03)' : 'scale(1)',
          }}
        />

        {/* Overlay degradado oscuro para legibilidad */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.45) 60%, rgba(0,0,0,0.2) 100%)' }} />

        {/* Overlay verde sutil de marca */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(15,75,40,0.35) 0%, transparent 70%)' }} />

        {/* Contenido */}
        <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
          <div className="max-w-2xl" style={{ opacity: animando ? 0 : 1, transition: 'opacity 0.3s ease' }}>

            {/* Tag */}
            <span className="inline-flex items-center gap-2 text-sm font-medium px-4 py-1.5 rounded-full mb-5"
              style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', color:'#fff', backdropFilter:'blur(8px)' }}>
              <FiTag /> {slide.categoria ? `✨ ${slide.categoria}` : '🏷️ Ofertas de temporada disponibles'}
            </span>

            {/* Título */}
            <h1 className="font-display font-bold leading-tight mb-4"
              style={{ fontSize:'clamp(36px,5vw,60px)', color:'#ffffff', textShadow:'0 2px 20px rgba(0,0,0,0.4)' }}>
              {slide.titulo}<br />
              <span style={{ color: slide.color }}>{slide.subtitulo}</span>
            </h1>

            {/* Descripción */}
            <p className="mb-6 leading-relaxed max-w-md"
              style={{ fontSize:16, color:'rgba(255,255,255,0.88)', textShadow:'0 1px 8px rgba(0,0,0,0.3)' }}>
              {slide.descripcion}
            </p>

            {/* Precio si es producto */}
            {slide.precio && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-5"
                style={{ background:'rgba(255,255,255,0.15)', backdropFilter:'blur(8px)', color:'#fff' }}>
                <span className="text-sm opacity-80">Desde</span>
                <span className="font-display font-bold text-2xl">Q{slide.precio.toFixed(2)}</span>
              </div>
            )}

            {/* Botones */}
            <div className="flex flex-wrap gap-3">
              <Link to="/catalogo"
                className="flex items-center gap-2 font-bold px-7 py-3 rounded-xl transition-all shadow-lg"
                style={{ background:'#fff', color:'#15803d' }}
                onMouseEnter={e => e.currentTarget.style.background='#f0fdf4'}
                onMouseLeave={e => e.currentTarget.style.background='#fff'}>
                Explorar catálogo <FiArrowRight />
              </Link>
              <Link to="/catalogo"
                className="font-semibold px-7 py-3 rounded-xl transition-all"
                style={{ background:'rgba(255,255,255,0.15)', color:'#fff', border:'1.5px solid rgba(255,255,255,0.35)', backdropFilter:'blur(8px)' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.25)'}
                onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}>
                Ver ofertas
              </Link>
            </div>
          </div>
        </div>

        {/* Botones de navegación */}
        <button onClick={() => cambiarSlide('prev')}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all"
          style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)', color:'#fff', backdropFilter:'blur(8px)' }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.3)'}
          onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}>
          <FiChevronLeft className="text-xl" />
        </button>
        <button onClick={() => cambiarSlide('next')}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center transition-all"
          style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)', color:'#fff', backdropFilter:'blur(8px)' }}
          onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.3)'}
          onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}>
          <FiChevronRight className="text-xl" />
        </button>

        {/* Indicadores (puntos) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {slides.map((_, i) => (
            <button key={i} onClick={() => { if (!animando) { setAnimando(true); setTimeout(() => { setSlideActual(i); setAnimando(false); }, 300); } }}
              className="rounded-full transition-all duration-300"
              style={{
                width:  slideActual === i ? 28 : 8,
                height: 8,
                background: slideActual === i ? '#fff' : 'rgba(255,255,255,0.45)',
              }} />
          ))}
        </div>

        {/* Stats en la parte inferior */}
        <div className="absolute bottom-6 right-6 hidden md:flex gap-6">
          {[['500+','Productos'],['10k+','Clientes'],['4.9★','Calificación']].map(([n,l]) => (
            <div key={l} className="text-right">
              <div className="font-display text-xl font-bold" style={{ color:'#fff', textShadow:'0 1px 8px rgba(0,0,0,0.4)' }}>{n}</div>
              <div className="text-xs" style={{ color:'rgba(255,255,255,0.7)' }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BENEFICIOS ─────────────────────────────────────── */}
      <section style={{ backgroundColor:'var(--bg-surface)', borderBottom:'1px solid var(--border-default)' }}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon:FiTruck,  title:'Envío rápido',        desc:'Entrega en 24-48 horas',            bg:'#f0fdf4', color:'#16a34a' },
              { icon:FiShield, title:'Compra segura',       desc:'Pagos 100% protegidos',             bg:'#eff6ff', color:'#2563eb' },
              { icon:FiStar,   title:'Calidad garantizada', desc:'Productos frescos y seleccionados', bg:'#fff7ed', color:'#f97316' },
            ].map(({ icon:Icon, title, desc, bg, color }) => (
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

      {/* ── CATEGORÍAS ─────────────────────────────────────── */}
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

      {/* ── PRODUCTOS DESTACADOS ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold" style={{ color:'var(--text-primary)' }}>Productos destacados</h2>
          <Link to="/catalogo" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
            Ver todos <FiArrowRight />
          </Link>
        </div>
        {cargando ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_,i) => (
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
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {destacados.map(p => <ProductCard key={p._id} producto={p} />)}
          </div>
        )}
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section style={{ background:'#0a0f1e' }}>
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
