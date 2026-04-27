import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiCreditCard, FiTruck, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

const METODOS_PAGO = [
  { value: 'efectivo', label: 'Efectivo al recibir', icono: '💵' },
  { value: 'tarjeta', label: 'Tarjeta (simulado)', icono: '💳' },
  { value: 'transferencia', label: 'Transferencia bancaria', icono: '🏦' },
];

export default function Checkout() {
  const { items, total, limpiar } = useCart();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [form, setForm] = useState({
    nombre: usuario?.nombre || '',
    telefono: usuario?.telefono || '',
    direccion: usuario?.direccion?.calle || '',
    ciudad: usuario?.direccion?.ciudad || '',
    departamento: usuario?.direccion?.departamento || '',
    referencias: '',
  });
  const [errores, setErrores] = useState({});

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="font-display text-xl font-bold mb-3">Tu carrito está vacío</h2>
        <Link to="/catalogo" className="btn-primary">Ir al catálogo</Link>
      </div>
    );
  }

  const validar = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = 'Nombre requerido';
    if (!form.telefono.trim()) e.telefono = 'Teléfono requerido';
    if (!form.direccion.trim()) e.direccion = 'Dirección requerida';
    if (!form.ciudad.trim()) e.ciudad = 'Ciudad requerida';
    if (!form.departamento.trim()) e.departamento = 'Departamento requerido';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) { toast.error('Completa todos los campos requeridos'); return; }

    setEnviando(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map(i => ({ producto: i._id, nombre: i.nombre, precio: i.precio, cantidad: i.cantidad, imagen: i.imagen })),
        datosEnvio: form,
        metodoPago,
      });
      limpiar();
      toast.success('¡Pedido realizado con éxito!');
      navigate(`/pedido-confirmado/${data.pedido._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al procesar el pedido');
    } finally {
      setEnviando(false);
    }
  };

  const campo = (name, label, type = 'text', placeholder = '') => (
    <div>
      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{label} *</label>
      <input
        type={type}
        value={form[name]}
        onChange={e => { setForm(prev => ({ ...prev, [name]: e.target.value })); if (errores[name]) setErrores(prev => ({ ...prev, [name]: '' })); }}
        placeholder={placeholder}
        className={`input-field ${errores[name] ? 'border-red-400 ring-1 ring-red-400' : ''}`}
      />
      {errores[name] && <p className="text-xs text-red-500 mt-1">{errores[name]}</p>}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Finalizar Compra</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="lg:col-span-2 space-y-5">
            {/* Datos de envío */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiTruck className="text-primary-600 text-lg" />
                <h2 className="font-display font-bold text-gray-900">Datos de envío</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {campo('nombre', 'Nombre completo', 'text', 'Tu nombre')}
                {campo('telefono', 'Teléfono', 'tel', '+502 0000 0000')}
                <div className="sm:col-span-2">{campo('direccion', 'Dirección', 'text', 'Calle, número, zona')}</div>
                {campo('ciudad', 'Ciudad / Municipio', 'text', 'Ciudad')}
                {campo('departamento', 'Departamento', 'text', 'Guatemala')}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Referencias (opcional)</label>
                  <textarea
                    value={form.referencias}
                    onChange={e => setForm(prev => ({ ...prev, referencias: e.target.value }))}
                    rows={2}
                    placeholder="Color de casa, referencias cercanas..."
                    className="input-field resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Método de pago */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <FiCreditCard className="text-primary-600 text-lg" />
                <h2 className="font-display font-bold text-gray-900">Método de pago</h2>
              </div>
              <div className="space-y-2">
                {METODOS_PAGO.map(m => (
                  <label key={m.value} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${metodoPago === m.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input type="radio" value={m.value} checked={metodoPago === m.value} onChange={() => setMetodoPago(m.value)} className="text-primary-600" />
                    <span className="text-xl">{m.icono}</span>
                    <span className="font-medium text-gray-800 text-sm">{m.label}</span>
                    {metodoPago === m.value && <FiCheck className="ml-auto text-primary-600" />}
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">⚠️ Este es un sistema de pago simulado. No se procesarán cargos reales.</p>
            </div>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <div className="card p-5 sticky top-24">
              <h2 className="font-display font-bold text-gray-900 text-lg mb-4">Resumen</h2>
              <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                {items.map(item => (
                  <div key={item._id} className="flex justify-between text-sm text-gray-600">
                    <span className="truncate pr-2">{item.nombre} ×{item.cantidad}</span>
                    <span className="font-medium shrink-0">Q{(item.precio * item.cantidad).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 space-y-1.5 mb-5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span><span>Q{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Envío</span><span className="text-primary-600 font-medium">Gratis</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 pt-1">
                  <span>Total</span>
                  <span className="font-display text-2xl text-primary-600">Q{total.toFixed(2)}</span>
                </div>
              </div>
              <button type="submit" disabled={enviando} className="btn-primary w-full flex items-center justify-center gap-2 text-base py-3 disabled:opacity-60 disabled:cursor-not-allowed">
                {enviando ? <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Procesando...</> : <>Confirmar pedido ✓</>}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
