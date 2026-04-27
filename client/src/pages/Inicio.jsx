import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiTruck, FiShield, FiStar, FiTag } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/products/ProductCard';

export default function Inicio() {
  const [destacados, setDestacados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

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
      <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 relative">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <FiTag /> Ofertas de temporada disponibles
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-5">
              Todo lo que<br />necesitas,<br />
              <span className="text-primary-200">en un solo lugar</span>
            </h1>
            <p className="text-lg text-primary-100 mb-8 max-w-md">
              Productos frescos, mejores precios y la comodidad de comprar desde casa.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/catalogo" className="bg-white text-primary-700 font-bold px-7 py-3 rounded-xl hover:bg-primary-50 transition-colors flex items-center gap-2 shadow-lg">
                Explorar catálogo <FiArrowRight />
              </Link>
              <Link to="/catalogo?destacado=true" className="bg-white/20 backdrop-blur text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/30 transition-colors border border-white/30">
                Ver ofertas
              </Link>
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="max-w-7xl mx-auto px-6 pb-8 relative">
          <div className="flex flex-wrap gap-8">
            {[['500+', 'Productos'], ['10k+', 'Clientes'], ['4.9★', 'Calificación']].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-2xl font-bold">{n}</div>
                <div className="text-primary-200 text-sm">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: FiTruck, title: 'Envío rápido', desc: 'Entrega en 24-48 horas', color: 'text-primary-600 bg-primary-50' },
              { icon: FiShield, title: 'Compra segura', desc: 'Pagos 100% protegidos', color: 'text-blue-600 bg-blue-50' },
              { icon: FiStar, title: 'Calidad garantizada', desc: 'Productos frescos y seleccionados', color: 'text-accent-500 bg-orange-50' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="text-xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-gray-900">Explorar por categoría</h2>
          <Link to="/catalogo" className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
            Ver todas <FiArrowRight />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {categorias.slice(0, 10).map(cat => (
            <Link
              key={cat._id}
              to={`/catalogo?categoria=${cat._id}`}
              className="card p-4 text-center hover:shadow-md transition-all hover:-translate-y-0.5 group"
            >
              <div className="text-3xl mb-2">{cat.icono}</div>
              <p className="text-xs font-semibold text-gray-700 group-hover:text-primary-600 transition-colors leading-tight">{cat.nombre}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-gray-900">Productos destacados</h2>
          <Link to="/catalogo" className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
            Ver todos <FiArrowRight />
          </Link>
        </div>
        {cargando ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
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

      {/* Banner CTA */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 text-center">
          <h2 className="font-display text-3xl font-bold mb-3">¿Listo para empezar?</h2>
          <p className="text-gray-400 mb-7">Regístrate y obtén acceso a ofertas exclusivas para nuevos clientes.</p>
          <Link to="/registro" className="btn-primary inline-flex items-center gap-2 text-base px-8 py-3">
            Crear cuenta gratis <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
