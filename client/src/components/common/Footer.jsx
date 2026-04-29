import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineStorefront } from 'react-icons/md';
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer style={{ backgroundColor:'#0a0f1e', color:'#64748b' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <MdOutlineStorefront className="text-white" />
              </div>
              <span className="font-display font-bold text-white text-lg">MaxiDespensa</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color:'#64748b' }}>
              Tu supermercado de confianza. Productos frescos, mejores precios y entrega rápida a tu puerta.
            </p>
            <div className="flex gap-3 mt-4">
              {[FiFacebook, FiInstagram, FiTwitter].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor:'#1e2736', color:'#64748b' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor='#16a34a'; e.currentTarget.style.color='#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor='#1e2736'; e.currentTarget.style.color='#64748b'; }}>
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Compras</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalogo" className="transition-colors hover:text-white" style={{ color:'#64748b' }}>Catálogo</Link></li>
              <li><Link to="/mis-pedidos" className="transition-colors hover:text-white" style={{ color:'#64748b' }}>Mis Pedidos</Link></li>
              <li><Link to="/carrito" className="transition-colors hover:text-white" style={{ color:'#64748b' }}>Carrito</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Soporte</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="transition-colors hover:text-white" style={{ color:'#64748b' }}>Ayuda</a></li>
              <li><a href="#" className="transition-colors hover:text-white" style={{ color:'#64748b' }}>Contacto</a></li>
              <li><a href="#" className="transition-colors hover:text-white" style={{ color:'#64748b' }}>Privacidad</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 text-xs text-center" style={{ borderTop:'1px solid #1e2736', color:'#475569' }}>
          © {new Date().getFullYear()} MaxiDespensa. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
