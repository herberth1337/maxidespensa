import React from 'react';
import { Link } from 'react-router-dom';
import { MdOutlineStorefront } from 'react-icons/md';
import { FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <MdOutlineStorefront className="text-white" />
              </div>
              <span className="font-display font-bold text-white text-lg">MaxiDespensa</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Tu supermercado de confianza. Productos frescos, mejores precios y entrega rápida a tu puerta.
            </p>
            <div className="flex gap-3 mt-4">
              {[FiFacebook, FiInstagram, FiTwitter].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Compras</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
              <li><Link to="/mis-pedidos" className="hover:text-white transition-colors">Mis Pedidos</Link></li>
              <li><Link to="/carrito" className="hover:text-white transition-colors">Carrito</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm">Soporte</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Ayuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de privacidad</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-xs text-center">
          © {new Date().getFullYear()} MaxiDespensa. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
