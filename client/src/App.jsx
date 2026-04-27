import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Páginas
import Inicio from './pages/Inicio';
import Catalogo from './pages/Catalogo';
import ProductoDetalle from './pages/ProductoDetalle';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import PedidoConfirmado from './pages/PedidoConfirmado';
import MisPedidos from './pages/MisPedidos';
import Perfil from './pages/Perfil';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProductos from './pages/admin/Productos';
import AdminPedidos from './pages/admin/Pedidos';
import AdminUsuarios from './pages/admin/Usuarios';
import Layout from './components/common/Layout';

// Rutas protegidas
const RutaProtegida = ({ children }) => {
  const { usuario, cargando } = useAuth();
  if (cargando) return <div className="flex items-center justify-center h-screen"><div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full" /></div>;
  return usuario ? children : <Navigate to="/login" replace />;
};

const RutaAdmin = ({ children }) => {
  const { usuario, cargando, esAdmin } = useAuth();
  if (cargando) return null;
  if (!usuario) return <Navigate to="/login" replace />;
  if (!esAdmin) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '14px', borderRadius: '12px' },
              success: { iconTheme: { primary: '#16a34a', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
          <Routes>
            {/* Públicas */}
            <Route path="/" element={<Layout><Inicio /></Layout>} />
            <Route path="/catalogo" element={<Layout><Catalogo /></Layout>} />
            <Route path="/producto/:id" element={<Layout><ProductoDetalle /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />

            {/* Protegidas */}
            <Route path="/carrito" element={<Layout><RutaProtegida><Carrito /></RutaProtegida></Layout>} />
            <Route path="/checkout" element={<Layout><RutaProtegida><Checkout /></RutaProtegida></Layout>} />
            <Route path="/pedido-confirmado/:id" element={<Layout><RutaProtegida><PedidoConfirmado /></RutaProtegida></Layout>} />
            <Route path="/mis-pedidos" element={<Layout><RutaProtegida><MisPedidos /></RutaProtegida></Layout>} />
            <Route path="/perfil" element={<Layout><RutaProtegida><Perfil /></RutaProtegida></Layout>} />

            {/* Admin */}
            <Route path="/admin" element={<RutaAdmin><AdminDashboard /></RutaAdmin>} />
            <Route path="/admin/productos" element={<RutaAdmin><AdminProductos /></RutaAdmin>} />
            <Route path="/admin/pedidos" element={<RutaAdmin><AdminPedidos /></RutaAdmin>} />
            <Route path="/admin/usuarios" element={<RutaAdmin><AdminUsuarios /></RutaAdmin>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
