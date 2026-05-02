import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdOutlineStorefront } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Registro() {
  const { registro } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre:'', email:'', telefono:'', password:'', confirmar:'' });
  const [verPass, setVerPass] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmar) { toast.error('Las contraseñas no coinciden'); return; }
    if (form.password.length < 6) { toast.error('La contraseña debe tener al menos 6 caracteres'); return; }
    setCargando(true);
    try {
      const data = await registro({ nombre:form.nombre, email:form.email, telefono:form.telefono, password:form.password });
      toast.success(data.message || '¡Registro exitoso!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al registrarse');
    } finally { setCargando(false); }
  };

  const campo = (key, label, type, placeholder, icon) => (
    <div>
      <label className="text-xs font-semibold mb-1.5 block" style={{ color:'var(--text-secondary)' }}>{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }}>{icon}</span>
        <input type={type==='password' && verPass ? 'text' : type} value={form[key]}
          onChange={e => setForm(p=>({...p,[key]:e.target.value}))}
          placeholder={placeholder} className="input-field pl-10"
          required={key !== 'telefono'} />
        {key === 'password' && (
          <button type="button" onClick={() => setVerPass(!verPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }}>
            {verPass ? <FiEyeOff /> : <FiEye />}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background:'linear-gradient(135deg, var(--bg-subtle) 0%, var(--bg-base) 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <MdOutlineStorefront className="text-white text-3xl" />
            </div>
            <span className="font-display font-bold text-2xl" style={{ color:'var(--text-primary)' }}>
              Maxi<span className="text-primary-600">Despensa</span>
            </span>
          </Link>
          <h1 className="font-display text-2xl font-bold mt-4" style={{ color:'var(--text-primary)' }}>Crear cuenta</h1>
          <p className="text-sm mt-1" style={{ color:'var(--text-secondary)' }}>Únete a miles de clientes satisfechos</p>
        </div>
        <div className="card p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            {campo('nombre',   'Nombre completo',      'text',     'Tu nombre',          <FiUser />)}
            {campo('email',    'Correo electrónico',   'email',    'tu@correo.com',      <FiMail />)}
            {campo('telefono', 'Teléfono (opcional)',  'tel',      '+502 0000 0000',     <FiPhone />)}
            {campo('password', 'Contraseña',           'password', 'Mínimo 6 caracteres',<FiLock />)}
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Confirmar contraseña</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }} />
                <input type={verPass?'text':'password'} value={form.confirmar}
                  onChange={e => setForm(p=>({...p,confirmar:e.target.value}))}
                  placeholder="Repite tu contraseña"
                  className={`input-field pl-10 ${form.confirmar && form.confirmar !== form.password ? 'border-red-400 ring-1 ring-red-400' : ''}`}
                  required />
              </div>
              {form.confirmar && form.confirmar !== form.password && (
                <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
              )}
            </div>
            <button type="submit" disabled={cargando}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60">
              {cargando ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : 'Crear mi cuenta'}
            </button>
          </form>
          <p className="text-center text-sm mt-5" style={{ color:'var(--text-muted)' }}>
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:text-primary-700">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
