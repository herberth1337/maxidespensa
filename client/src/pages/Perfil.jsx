import React, { useState } from 'react';
import { FiUser, FiEdit2, FiLock, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Perfil() {
  const { usuario, actualizarUsuario } = useAuth();
  const [editando, setEditando] = useState(false);
  const [cambiandoPass, setCambiandoPass] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [form, setForm] = useState({
    nombre: usuario?.nombre || '',
    telefono: usuario?.telefono || '',
    calle: usuario?.direccion?.calle || '',
    ciudad: usuario?.direccion?.ciudad || '',
    departamento: usuario?.direccion?.departamento || '',
  });

  const [passForm, setPassForm] = useState({ passwordActual: '', passwordNueva: '', confirmar: '' });

  const handleGuardarPerfil = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const { data } = await api.put('/users/perfil', {
        nombre: form.nombre,
        telefono: form.telefono,
        direccion: { calle: form.calle, ciudad: form.ciudad, departamento: form.departamento }
      });
      actualizarUsuario(data.usuario);
      toast.success('Perfil actualizado');
      setEditando(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar');
    } finally {
      setGuardando(false);
    }
  };

  const handleCambiarPass = async (e) => {
    e.preventDefault();
    if (passForm.passwordNueva !== passForm.confirmar) { toast.error('Las contraseñas no coinciden'); return; }
    if (passForm.passwordNueva.length < 6) { toast.error('La contraseña debe tener al menos 6 caracteres'); return; }
    setGuardando(true);
    try {
      await api.put('/users/cambiar-password', { passwordActual: passForm.passwordActual, passwordNueva: passForm.passwordNueva });
      toast.success('Contraseña actualizada');
      setPassForm({ passwordActual: '', passwordNueva: '', confirmar: '' });
      setCambiandoPass(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al cambiar contraseña');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

      {/* Avatar + info */}
      <div className="card p-6 mb-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="font-display text-2xl font-bold text-primary-700">{usuario?.nombre[0].toUpperCase()}</span>
          </div>
          <div>
            <h2 className="font-display font-bold text-gray-900 text-xl">{usuario?.nombre}</h2>
            <p className="text-gray-500 text-sm">{usuario?.email}</p>
            <span className={`badge mt-1 ${usuario?.rol === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-primary-100 text-primary-700'}`}>
              {usuario?.rol === 'admin' ? '👑 Administrador' : '👤 Cliente'}
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
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Nombre *</label>
                <input type="text" value={form.nombre} onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))} className="input-field" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Teléfono</label>
                <input type="tel" value={form.telefono} onChange={e => setForm(p => ({ ...p, telefono: e.target.value }))} className="input-field" placeholder="+502 0000 0000" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Dirección</label>
                <input type="text" value={form.calle} onChange={e => setForm(p => ({ ...p, calle: e.target.value }))} className="input-field" placeholder="Calle y número" />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Ciudad</label>
                <input type="text" value={form.ciudad} onChange={e => setForm(p => ({ ...p, ciudad: e.target.value }))} className="input-field" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Departamento</label>
                <input type="text" value={form.departamento} onChange={e => setForm(p => ({ ...p, departamento: e.target.value }))} className="input-field" />
              </div>
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
              ['Teléfono', usuario?.telefono || 'No registrado'],
              ['Ciudad', usuario?.direccion?.ciudad || 'No registrada'],
              ['Departamento', usuario?.direccion?.departamento || 'No registrado'],
              ['Dirección', usuario?.direccion?.calle || 'No registrada'],
            ].map(([label, val]) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">{label}</p>
                <p className="font-medium text-gray-800">{val}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cambiar contraseña */}
      <div className="card p-5">
        <button onClick={() => setCambiandoPass(!cambiandoPass)} className="flex items-center gap-2 font-semibold text-gray-900 w-full text-left">
          <FiLock className="text-primary-600" /> Cambiar contraseña
          <span className="ml-auto text-xs text-primary-600">{cambiandoPass ? 'Cancelar' : 'Cambiar'}</span>
        </button>

        {cambiandoPass && (
          <form onSubmit={handleCambiarPass} className="mt-4 space-y-3 animate-slide-up">
            {[
              ['passwordActual', 'Contraseña actual'],
              ['passwordNueva', 'Nueva contraseña'],
              ['confirmar', 'Confirmar nueva contraseña'],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">{label}</label>
                <input type="password" value={passForm[key]} onChange={e => setPassForm(p => ({ ...p, [key]: e.target.value }))} className="input-field" required minLength={key !== 'passwordActual' ? 6 : 1} />
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
