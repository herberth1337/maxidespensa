import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingBag, FiUsers, FiLogOut, FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi';
import { MdOutlineStorefront } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const MENU = [
  { path: '/admin',           label: 'Dashboard',  icon: FiGrid,       exact: true },
  { path: '/admin/productos', label: 'Productos',  icon: FiPackage },
  { path: '/admin/pedidos',   label: 'Pedidos',    icon: FiShoppingBag },
  { path: '/admin/usuarios',  label: 'Usuarios',   icon: FiUsers },
];

export default function AdminLayout({ children }) {
  const { logout, usuario } = useAuth();
  const { oscuro, toggleTema } = useTheme();
  const location = useLocation();
  const navigate  = useNavigate();
  const [movil, setMovil] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (item) => item.exact
    ? location.pathname === item.path
    : location.pathname.startsWith(item.path);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor:'var(--bg-base)' }}>
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ${movil ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 shrink-0`}
        style={{ background:'linear-gradient(180deg, #0a0f1e 0%, #0f172a 100%)' }}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-5" style={{ borderBottom:'1px solid rgba(255,255,255,.06)' }}>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <MdOutlineStorefront className="text-white" />
              </div>
              <div>
                <div className="font-display text-sm font-bold text-white">MaxiDespensa</div>
                <div className="text-xs" style={{ color:'#475569' }}>Panel Admin</div>
              </div>
            </Link>
            <button onClick={() => setMovil(false)} className="lg:hidden text-gray-500 hover:text-white"><FiX /></button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {MENU.map(item => (
              <Link key={item.path} to={item.path} onClick={() => setMovil(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive(item) ? 'bg-primary-600 text-white shadow-md' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                <item.icon className="text-lg shrink-0" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4" style={{ borderTop:'1px solid rgba(255,255,255,.06)' }}>
            <button onClick={toggleTema}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all mb-1">
              {oscuro ? <FiSun className="text-yellow-400" /> : <FiMoon />}
              {oscuro ? 'Modo claro' : 'Modo oscuro'}
            </button>
            <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-white transition-all mb-3">
              🏪 Ver tienda
            </Link>
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-7 h-7 bg-primary-900 rounded-full flex items-center justify-center shrink-0">
                <span className="text-primary-400 font-bold text-xs">{usuario?.nombre[0]}</span>
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">{usuario?.nombre}</p>
                <p className="text-xs truncate" style={{ color:'#475569' }}>{usuario?.email}</p>
              </div>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium w-full text-red-400 hover:bg-red-500/10 transition-all">
              <FiLogOut /> Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {movil && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm" onClick={() => setMovil(false)} />}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="px-6 py-4 flex items-center gap-4 sticky top-0 z-20"
          style={{ backgroundColor:'var(--bg-surface)', borderBottom:'1px solid var(--border-default)', transition:'background-color 0.4s ease' }}>
          <button onClick={() => setMovil(true)} className="lg:hidden" style={{ color:'var(--text-secondary)' }}>
            <FiMenu className="text-xl" />
          </button>
          <h2 className="font-display font-bold" style={{ color:'var(--text-primary)' }}>
            {MENU.find(m => isActive(m))?.label || 'Admin'}
          </h2>
          <Link to="/" className="ml-auto text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">← Ver tienda</Link>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
