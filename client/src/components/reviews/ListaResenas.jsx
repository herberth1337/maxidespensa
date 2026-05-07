import React from 'react';
import { FiTrash2, FiCamera } from 'react-icons/fi';
import Estrellas from './Estrellas';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import toast from 'react-hot-toast';

function BarraDistribucion({ estrellas, cantidad, total }) {
  const porcentaje = total > 0 ? (cantidad / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-4 text-right font-medium" style={{ color:'var(--text-secondary)' }}>{estrellas}</span>
      <span style={{ color:'#f59e0b', fontSize:12 }}>★</span>
      <div className="flex-1 rounded-full h-2 overflow-hidden" style={{ background:'var(--bg-muted)' }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width:`${porcentaje}%`, background: porcentaje > 0 ? '#f59e0b' : 'transparent' }} />
      </div>
      <span className="w-6 text-right" style={{ color:'var(--text-muted)' }}>{cantidad}</span>
    </div>
  );
}

function TarjetaResena({ resena, onEliminar }) {
  const { usuario, esAdmin } = useAuth();
  const esDueno = usuario?._id === resena.usuario?._id || usuario?.id === resena.usuario?._id;
  const fecha = new Date(resena.createdAt).toLocaleDateString('es-GT', { day:'numeric', month:'long', year:'numeric' });

  const handleEliminar = async () => {
    if (!window.confirm('¿Eliminar esta reseña?')) return;
    try {
      await api.delete(`/reviews/${resena._id}`);
      toast.success('Reseña eliminada');
      onEliminar(resena._id);
    } catch { toast.error('Error al eliminar'); }
  };

  return (
    <div className="p-4 rounded-2xl animate-fade" style={{ border:'1px solid var(--border-default)', background:'var(--bg-surface)' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
            style={{ background:'var(--bg-subtle)', color:'var(--text-secondary)' }}>
            {resena.usuario?.nombre?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color:'var(--text-primary)' }}>
              {resena.usuario?.nombre || 'Usuario'}
              <span className="ml-2 text-xs font-normal px-1.5 py-0.5 rounded-full"
                style={{ background:'var(--bg-subtle)', color:'var(--text-muted)' }}>
                ✅ Compra verificada
              </span>
            </p>
            <p className="text-xs mt-0.5" style={{ color:'var(--text-muted)' }}>{fecha}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Estrellas valor={resena.calificacion} tamaño={14} />
          {(esDueno || esAdmin) && (
            <button onClick={handleEliminar}
              className="p-1.5 rounded-lg text-red-400 transition-colors"
              onMouseEnter={e => e.currentTarget.style.background='rgba(239,68,68,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <FiTrash2 className="text-sm" />
            </button>
          )}
        </div>
      </div>

      {/* Comentario */}
      {resena.comentario && (
        <p className="text-sm leading-relaxed mb-3" style={{ color:'var(--text-secondary)' }}>
          {resena.comentario}
        </p>
      )}

      {/* Foto */}
      {resena.imagen && (
        <div className="mt-2">
          <img src={resena.imagen} alt="Foto de la reseña"
            className="h-32 w-32 object-cover rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
            style={{ border:'1px solid var(--border-default)' }}
            onClick={() => window.open(resena.imagen, '_blank')}
            onError={e => { e.target.style.display='none'; }} />
          <p className="text-xs mt-1 flex items-center gap-1" style={{ color:'var(--text-muted)' }}>
            <FiCamera className="text-xs" /> Foto del cliente
          </p>
        </div>
      )}
    </div>
  );
}

export default function ListaResenas({ resenas, promedio, total, distribucion, onEliminar }) {
  if (total === 0) return (
    <div className="text-center py-10">
      <div className="text-5xl mb-3">💬</div>
      <p className="font-semibold" style={{ color:'var(--text-primary)' }}>Aún no hay reseñas</p>
      <p className="text-sm mt-1" style={{ color:'var(--text-muted)' }}>
        Sé el primero en compartir tu experiencia con este producto.
      </p>
    </div>
  );

  return (
    <div>
      {/* Resumen de calificaciones */}
      <div className="card p-5 mb-5">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          {/* Promedio grande */}
          <div className="text-center shrink-0">
            <div className="font-display text-6xl font-bold" style={{ color:'var(--text-primary)' }}>
              {promedio.toFixed(1)}
            </div>
            <Estrellas valor={promedio} tamaño={20} />
            <p className="text-xs mt-1" style={{ color:'var(--text-muted)' }}>{total} reseña{total !== 1 ? 's' : ''}</p>
          </div>

          {/* Barra de distribución */}
          <div className="flex-1 w-full space-y-1.5">
            {distribucion.map(d => (
              <BarraDistribucion key={d.estrellas} {...d} total={total} />
            ))}
          </div>
        </div>
      </div>

      {/* Lista de reseñas */}
      <div className="space-y-3">
        {resenas.map(r => (
          <TarjetaResena key={r._id} resena={r} onEliminar={onEliminar} />
        ))}
      </div>
    </div>
  );
}
