import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { MdOutlineStorefront } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const MENU = [
  { path: '/admin', label: 'Dashboard', icon: FiGrid, exact: true },
  { path: '/admin/productos', label: 'Productos', icon: FiPackage },
  { path: '/admin/pedidos', label: 'Pedidos', icon: FiShoppingBag },
  { path: '/admin/usuarios', label: 'Usuarios', icon: FiUsers },
];

export default function AdminLayout({ children }) {
  const { logout, usuario } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [movil, setMovil] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (item) => item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 transform transition-transform duration-300 ${movil ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 shrink-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-5 border-b border-gray-800">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <MdOutlineStorefront className="text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-white text-sm">MaxiDespensa</span>
                <p className="text-xs text-gray-500">Panel Admin</p>
              </div>
            </Link>
            <button onClick={() => setMovil(false)} className="lg:hidden text-gray-400 hover:text-white">
              <FiX />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1">
            {MENU.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMovil(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(item) ? 'bg-primary-600 text-white shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
              >
                <item.icon className="text-lg" /> {item.label}
              </Link>
            ))}
          </nav>

          {/* Usuario */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-primary-900 rounded-full flex items-center justify-center">
                <span className="text-primary-400 font-bold text-sm">{usuario?.nombre[0]}</span>
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{usuario?.nombre}</p>
                <p className="text-gray-500 text-xs truncate">{usuario?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm w-full transition-colors">
              <FiLogOut /> Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay móvil */}
      {movil && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMovil(false)} />}

      {/* Contenido */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-20">
          <button onClick={() => setMovil(true)} className="lg:hidden text-gray-600 hover:text-gray-900">
            <FiMenu className="text-xl" />
          </button>
          <h2 className="font-display font-bold text-gray-900">
            {MENU.find(m => isActive(m))?.label || 'Admin'}
          </h2>
          <Link to="/" className="ml-auto text-sm text-primary-600 hover:text-primary-700">← Ver tienda</Link>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
