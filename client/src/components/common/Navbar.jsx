import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  FiShoppingCart, FiSearch, FiUser, FiMenu, FiX,
  FiPackage, FiLogOut, FiSettings, FiChevronDown
} from 'react-icons/fi';
import { MdOutlineStorefront } from 'react-icons/md';

export default function Navbar() {
  const { usuario, logout, esAdmin } = useAuth();
  const { cantidadTotal } = useCart();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');
  const [menuMovil, setMenuMovil] = useState(false);
  const [menuUsuario, setMenuUsuario] = useState(false);
  const menuRef = useRef(null);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuUsuario(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleBuscar = (e) => {
    e.preventDefault();
    if (busqueda.trim()) { navigate(`/catalogo?buscar=${encodeURIComponent(busqueda.trim())}`); setBusqueda(''); }
  };

  const handleLogout = () => { logout(); navigate('/'); setMenuUsuario(false); };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <MdOutlineStorefront className="text-white text-xl" />
            </div>
            <span className="font-display font-bold text-gray-900 text-lg hidden sm:block">
              Maxi<span className="text-primary-600">Despensa</span>
            </span>
          </Link>

          {/* Buscador */}
          <form onSubmit={handleBuscar} className="flex-1 max-w-xl hidden md:flex">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white text-sm transition-all"
              />
            </div>
          </form>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {/* Carrito */}
            <Link to="/carrito" className="relative p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
              <FiShoppingCart className="text-xl text-gray-700" />
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
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-bold text-sm">{usuario.nombre[0].toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block max-w-[100px] truncate">{usuario.nombre.split(' ')[0]}</span>
                  <FiChevronDown className={`text-gray-400 text-sm transition-transform ${menuUsuario ? 'rotate-180' : ''}`} />
                </button>

                {menuUsuario && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-gray-100 mb-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">{usuario.nombre}</p>
                      <p className="text-xs text-gray-500 truncate">{usuario.email}</p>
                    </div>
                    {esAdmin && (
                      <Link to="/admin" onClick={() => setMenuUsuario(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-primary-700 hover:bg-primary-50 font-medium">
                        <FiSettings /> Panel Admin
                      </Link>
                    )}
                    <Link to="/mis-pedidos" onClick={() => setMenuUsuario(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FiPackage /> Mis pedidos
                    </Link>
                    <Link to="/perfil" onClick={() => setMenuUsuario(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <FiUser /> Mi perfil
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                      <FiLogOut /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-primary-600 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors hidden sm:block">Ingresar</Link>
                <Link to="/registro" className="btn-primary text-sm py-2 px-4">Registrarse</Link>
              </div>
            )}

            {/* Botón móvil */}
            <button onClick={() => setMenuMovil(!menuMovil)} className="md:hidden p-2 hover:bg-gray-50 rounded-xl">
              {menuMovil ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {menuMovil && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-100 animate-slide-up">
            <form onSubmit={handleBuscar} className="mb-3">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                />
              </div>
            </form>
            <div className="flex flex-col gap-1">
              <Link to="/catalogo" onClick={() => setMenuMovil(false)} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl">Catálogo</Link>
              {!usuario && <>
                <Link to="/login" onClick={() => setMenuMovil(false)} className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl">Ingresar</Link>
                <Link to="/registro" onClick={() => setMenuMovil(false)} className="px-3 py-2 text-sm text-primary-600 font-medium hover:bg-primary-50 rounded-xl">Registrarse</Link>
              </>}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
