import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import {
  FiShoppingCart, FiSearch, FiUser, FiMenu, FiX,
  FiPackage, FiLogOut, FiSettings, FiChevronDown,
  FiSun, FiMoon
} from 'react-icons/fi';
import { MdOutlineStorefront } from 'react-icons/md';

export default function Navbar() {
  const { usuario, logout, esAdmin } = useAuth();
  const { cantidadTotal } = useCart();
  const { oscuro, toggleTema } = useTheme();
  const navigate = useNavigate();
  const [busqueda, setBusqueda]       = useState('');
  const [menuMovil, setMenuMovil]     = useState(false);
  const [menuUsuario, setMenuUsuario] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuUsuario(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    if (busqueda.trim()) {
      navigate(`/catalogo?buscar=${encodeURIComponent(busqueda.trim())}`);
      setBusqueda('');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); setMenuUsuario(false); };

  return (
    <nav style={{ backgroundColor:'var(--bg-surface)', borderBottom:'1px solid var(--border-muted)' }}
         className="sticky top-0 z-50 shadow-sm"
         style={{ backgroundColor:'var(--bg-surface)', borderBottom:'1px solid var(--border-default)', transition:'background-color 0.4s ease, border-color 0.4s ease' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-sm">
              <MdOutlineStorefront className="text-white text-xl" />
            </div>
            <span className="font-display font-bold text-lg hidden sm:block" style={{ color:'var(--text-primary)' }}>
              Maxi<span className="text-primary-600">Despensa</span>
            </span>
          </Link>

          {/* Buscador */}
          <form onSubmit={handleBuscar} className="flex-1 max-w-xl hidden md:flex">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }} />
              <input
                type="text"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar productos..."
                className="input-field pl-10 text-sm"
              />
            </div>
          </form>

          {/* Acciones */}
          <div className="flex items-center gap-1">

            {/* Toggle modo oscuro con ripple */}
            <button
              onClick={toggleTema}
              className="relative p-2.5 rounded-xl transition-colors overflow-hidden"
              style={{ color:'var(--text-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              title={oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              <div className={`transition-all duration-300 ${oscuro ? 'rotate-0 scale-100' : 'rotate-90 scale-0'} absolute inset-0 flex items-center justify-center`}>
                <FiSun className="text-xl text-yellow-400" />
              </div>
              <div className={`transition-all duration-300 ${oscuro ? '-rotate-90 scale-0' : 'rotate-0 scale-100'} flex items-center justify-center`}>
                <FiMoon className="text-xl" style={{ color:'var(--text-secondary)' }} />
              </div>
            </button>

            {/* Carrito */}
            <Link to="/carrito" className="relative p-2.5 rounded-xl transition-colors"
              style={{ color:'var(--text-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              <FiShoppingCart className="text-xl" />
              {cantidadTotal > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce-in">
                  {cantidadTotal > 9 ? '9+' : cantidadTotal}
                </span>
              )}
            </Link>

            {/* Usuario */}
            {usuario ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuUsuario(!menuUsuario)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl transition-colors"
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div className="w-7 h-7 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 dark:text-primary-300 font-bold text-sm">
                      {usuario.nombre[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium hidden sm:block max-w-[100px] truncate" style={{ color:'var(--text-primary)' }}>
                    {usuario.nombre.split(' ')[0]}
                  </span>
                  <FiChevronDown className={`text-sm transition-transform ${menuUsuario ? 'rotate-180' : ''}`} style={{ color:'var(--text-muted)' }} />
                </button>

                {menuUsuario && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl shadow-lg py-2 animate-fade z-50"
                    style={{ backgroundColor:'var(--bg-elevated)', border:'1px solid var(--border-default)', boxShadow:'var(--shadow-lg)' }}>
                    <div className="px-4 py-2 mb-1" style={{ borderBottom:'1px solid var(--border-default)' }}>
                      <p className="font-semibold text-sm truncate" style={{ color:'var(--text-primary)' }}>{usuario.nombre}</p>
                      <p className="text-xs truncate" style={{ color:'var(--text-muted)' }}>{usuario.email}</p>
                    </div>
                    {esAdmin && (
                      <Link to="/admin" onClick={() => setMenuUsuario(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 transition-colors"
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <FiSettings /> Panel Admin
                      </Link>
                    )}
                    <Link to="/mis-pedidos" onClick={() => setMenuUsuario(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                      style={{ color:'var(--text-secondary)' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <FiPackage /> Mis pedidos
                    </Link>
                    <Link to="/perfil" onClick={() => setMenuUsuario(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm transition-colors"
                      style={{ color:'var(--text-secondary)' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <FiUser /> Mi perfil
                    </Link>
                    <hr style={{ borderColor:'var(--border-default)', margin:'4px 0' }} />
                    <button onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 w-full transition-colors"
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <FiLogOut /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium px-3 py-2 rounded-xl transition-colors hidden sm:block"
                  style={{ color:'var(--text-secondary)' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  Ingresar
                </Link>
                <Link to="/registro" className="btn-primary text-sm py-2 px-4">Registrarse</Link>
              </div>
            )}

            {/* Botón móvil */}
            <button onClick={() => setMenuMovil(!menuMovil)}
              className="md:hidden p-2 rounded-xl transition-colors"
              style={{ color:'var(--text-secondary)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-subtle)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
              {menuMovil ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {menuMovil && (
          <div className="md:hidden pb-4 pt-2 animate-slide-up" style={{ borderTop:'1px solid var(--border-default)' }}>
            <form onSubmit={handleBuscar} className="mb-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }} />
                <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
                  placeholder="Buscar productos..." className="input-field pl-10 text-sm" />
              </div>
            </form>
            <div className="flex flex-col gap-1">
              <Link to="/catalogo" onClick={() => setMenuMovil(false)}
                className="px-3 py-2 text-sm rounded-xl transition-colors" style={{ color:'var(--text-secondary)' }}>Catálogo</Link>
              {!usuario && <>
                <Link to="/login"    onClick={() => setMenuMovil(false)} className="px-3 py-2 text-sm rounded-xl" style={{ color:'var(--text-secondary)' }}>Ingresar</Link>
                <Link to="/registro" onClick={() => setMenuMovil(false)} className="px-3 py-2 text-sm font-medium text-primary-600 rounded-xl">Registrarse</Link>
              </>}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
