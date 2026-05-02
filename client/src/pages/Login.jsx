import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdOutlineStorefront } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form,     setForm]    = useState({ email:'', password:'' });
  const [verPass,  setVerPass] = useState(false);
  const [cargando, setCargando]= useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(data.message || '¡Bienvenido!');
      navigate(data.usuario.rol === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al iniciar sesión');
    } finally { setCargando(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
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
          <h1 className="font-display text-2xl font-bold mt-4" style={{ color:'var(--text-primary)' }}>Iniciar sesión</h1>
          <p className="text-sm mt-1" style={{ color:'var(--text-secondary)' }}>Bienvenido de vuelta</p>
        </div>

        <div className="card p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Correo electrónico</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }} />
                <input type="email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))}
                  placeholder="tu@correo.com" className="input-field pl-10" required />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1.5 block" style={{ color:'var(--text-secondary)' }}>Contraseña</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color:'var(--text-muted)' }} />
                <input type={verPass?'text':'password'} value={form.password} onChange={e => setForm(p=>({...p,password:e.target.value}))}
                  placeholder="••••••" className="input-field pl-10 pr-10" required />
                <button type="button" onClick={() => setVerPass(!verPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color:'var(--text-muted)' }}>
                  {verPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={cargando}
              className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60">
              {cargando ? <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : 'Ingresar'}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color:'var(--text-muted)' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-primary-600 font-semibold hover:text-primary-700">Regístrate gratis</Link>
          </p>

          <div className="mt-4 p-3 rounded-xl text-xs space-y-1" style={{ background:'var(--bg-subtle)' }}>
            <div className="font-semibold mb-1" style={{ color:'var(--text-primary)' }}>Cuentas de prueba:</div>
            <div style={{ color:'var(--text-secondary)' }}>👑 Admin: admin@maxidespensa.com / admin123</div>
            <div style={{ color:'var(--text-secondary)' }}>👤 Cliente: juan@test.com / test123</div>
          </div>
        </div>
      </div>
    </div>
  );
}
