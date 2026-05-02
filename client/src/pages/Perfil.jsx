import React, { useState } from 'react';
import { FiUser, FiEdit2, FiLock, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Perfil() {
  const { usuario, actualizarUsuario } = useAuth();
  const [editando,      setEditando]      = useState(false);
  const [cambiandoPass, setCambiandoPass] = useState(false);
  const [guardando,     setGuardando]     = useState(false);
  const [form, setForm] = useState({
    nombre:      usuario?.nombre || '',
    telefono:    usuario?.telefono || '',
    calle:       usuario?.direccion?.calle || '',
    ciudad:      usuario?.direccion?.ciudad || '',
    departamento:usuario?.direccion?.departamento || '',
  });
  const [passForm, setPassForm] = useState({ passwordActual:'', passwordNueva:'', confirmar:'' });

  const handleGuardarPerfil = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const { data } = await api.put('/users/perfil', {
        nombre: form.nombre, telefono: form.telefono,
        direccion: { calle:form.calle, ciudad:form.ciudad, departamento:form.departamento }
      });
      actualizarUsuario(data.usuario);
      toast.success('Perfil actualizado');
      setEditando(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Error al actualizar'); }
    finally { setGuardando(false); }
  };

  const handleCambiarPass = async (e) => {
    e.preventDefault();
    if (passForm.passwordNueva !== passForm.confirmar) { toast.error('Las contraseñas no coinciden'); return; }
    if (passForm.passwordNueva.length < 6) { toast.error('Mínimo 6 caracteres'); return; }
    setGuardando(true);
    try {
      await api.put('/users/cambiar-password', { passwordActual:passForm.passwordActual, passwordNueva:passForm.passwordNueva });
      toast.success('Contraseña actualizada');
      setPassForm({ passwordActual:'', passwordNueva:'', confirmar:'' });
      setCambiandoPass(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Error al cambiar contraseña'); }
    finally { setGuardando(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold mb-6" style={{ color:'var(--text-primary)' }}>Mi Perfil</h1>

      {/* Datos */}
      <div className="card p-6 mb-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background:'var(--bg-subtle)' }}>
            <span className="font-display text-2xl font-bold text-primary-600">{usuario?.nombre[0].toUpperCase()}</span>
          </div>
          <div>
            <h2 className="font-display font-bold text-xl" style={{ color:'var(--text-primary)' }}>{usuario?.nombre}</h2>
            <p className="text-sm" style={{ color:'var(--text-muted)' }}>{usuario?.email}</p>
            <span className="badge mt-1 text-xs"
              style={{ background: usuario?.rol==='admin' ? '#f5f3ff' : '#f0fdf4', color: usuario?.rol==='admin' ? '#7c3aed' : '#15803d' }}>
              {usuario?.rol==='admin' ? '👑 Administrador' : '👤 Cliente'}
            </span>
          </div>
          {!editando && (
            <button onClick={() => setEditando(true)} className="ml-auto btn-secondary text-sm py-2 flex items-center gap-2">
              <FiEdit2 /> Editar
            </button>
          )}
        </div>

        {editando ? (
          <form onSubmit={handleGuardarPerfil} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['nombre','Nombre *','text','Tu nombre'],
                ['telefono','Teléfono','tel','+502 0000 0000'],
                ['calle','Dirección','text','Calle y número'],
                ['ciudad','Ciudad','text',''],
                ['departamento','Departamento','text',''],
              ].map(([key,label,type,ph]) => (
                <div key={key} className={key==='departamento'?'sm:col-span-2':''}>
                  <label className="text-xs font-semibold mb-1 block" style={{ color:'var(--text-secondary)' }}>{label}</label>
                  <input type={type} value={form[key]} placeholder={ph}
                    onChange={e => setForm(p=>({...p,[key]:e.target.value}))}
                    className="input-field" required={key==='nombre'} />
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={guardando} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                {guardando ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <FiCheck />}
                Guardar cambios
              </button>
              <button type="button" onClick={() => setEditando(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ['Teléfono',     usuario?.telefono || 'No registrado'],
              ['Ciudad',       usuario?.direccion?.ciudad || 'No registrada'],
              ['Departamento', usuario?.direccion?.departamento || 'No registrado'],
              ['Dirección',    usuario?.direccion?.calle || 'No registrada'],
            ].map(([label,val]) => (
              <div key={label} className="p-3 rounded-xl" style={{ background:'var(--bg-subtle)' }}>
                <p className="text-xs font-semibold mb-1" style={{ color:'var(--text-muted)' }}>{label}</p>
                <p className="font-medium" style={{ color:'var(--text-primary)' }}>{val}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contraseña */}
      <div className="card p-5">
        <button onClick={() => setCambiandoPass(!cambiandoPass)}
          className="flex items-center gap-2 font-semibold w-full text-left"
          style={{ color:'var(--text-primary)' }}>
          <FiLock className="text-primary-600" /> Cambiar contraseña
          <span className="ml-auto text-xs text-primary-600">{cambiandoPass ? 'Cancelar' : 'Cambiar'}</span>
        </button>
        {cambiandoPass && (
          <form onSubmit={handleCambiarPass} className="mt-4 space-y-3 animate-slide-up">
            {[['passwordActual','Contraseña actual'],['passwordNueva','Nueva contraseña'],['confirmar','Confirmar nueva contraseña']].map(([key,label]) => (
              <div key={key}>
                <label className="text-xs font-semibold mb-1 block" style={{ color:'var(--text-secondary)' }}>{label}</label>
                <input type="password" value={passForm[key]}
                  onChange={e => setPassForm(p=>({...p,[key]:e.target.value}))}
                  className="input-field" required minLength={key!=='passwordActual'?6:1} />
              </div>
            ))}
            <button type="submit" disabled={guardando} className="btn-primary flex items-center gap-2 disabled:opacity-60">
              {guardando ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <FiCheck />}
              Actualizar contraseña
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
