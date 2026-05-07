import React, { useState } from 'react';
import { FiCamera, FiX, FiSend } from 'react-icons/fi';
import Estrellas from './Estrellas';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function FormularioResena({ productId, ordenId, onResenaEnviada }) {
  const [calificacion, setCalificacion] = useState(0);
  const [hover,        setHover]        = useState(0);
  const [comentario,   setComentario]   = useState('');
  const [imagenUrl,    setImagenUrl]    = useState('');
  const [enviando,     setEnviando]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (calificacion === 0) { toast.error('Selecciona una calificación'); return; }
    setEnviando(true);
    try {
      const { data } = await api.post('/reviews', {
        productId,
        ordenId,
        calificacion,
        comentario: comentario.trim() || null,
        imagen:     imagenUrl.trim() || null,
      });
      toast.success('¡Gracias por tu reseña!');
      onResenaEnviada(data.resena);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al enviar reseña');
    } finally {
      setEnviando(false);
    }
  };

  const LABELS = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', '¡Excelente!'];
  const COLORES = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];

  return (
    <form onSubmit={handleSubmit} className="card p-5 animate-fade">
      <h3 className="font-display font-bold text-lg mb-4" style={{ color:'var(--text-primary)' }}>
        ✍️ Escribir reseña
      </h3>

      {/* Calificación con estrellas interactivas */}
      <div className="mb-4">
        <label className="text-xs font-semibold mb-2 block" style={{ color:'var(--text-secondary)' }}>
          Calificación *
        </label>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setCalificacion(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                className="transition-all duration-150"
                style={{
                  fontSize:  32,
                  color:     n <= (hover || calificacion) ? '#f59e0b' : 'var(--bg-muted)',
                  transform: n <= (hover || calificacion) ? 'scale(1.15)' : 'scale(1)',
                  background: 'none',
                  border:     'none',
                  cursor:     'pointer',
                  padding:    '2px',
                }}
              >
                ★
              </button>
            ))}
          </div>
          {(hover || calificacion) > 0 && (
            <span className="text-sm font-semibold" style={{ color: COLORES[hover || calificacion] }}>
              {LABELS[hover || calificacion]}
            </span>
          )}
        </div>
      </div>

      {/* Comentario */}
      <div className="mb-4">
        <label className="text-xs font-semibold mb-1.5 block" style={{ color:'var(--text-secondary)' }}>
          Comentario
        </label>
        <textarea
          value={comentario}
          onChange={e => setComentario(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="¿Qué te pareció el producto? Tu opinión ayuda a otros compradores..."
          className="input-field resize-none text-sm"
        />
        <p className="text-xs mt-1 text-right" style={{ color:'var(--text-muted)' }}>
          {comentario.length}/1000
        </p>
      </div>

      {/* URL de foto */}
      <div className="mb-5">
        <label className="text-xs font-semibold mb-1.5 block" style={{ color:'var(--text-secondary)' }}>
          📸 Foto del producto (opcional)
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={imagenUrl}
            onChange={e => setImagenUrl(e.target.value)}
            placeholder="https://... (pega la URL de tu foto)"
            className="input-field text-sm flex-1"
          />
          {imagenUrl && (
            <button type="button" onClick={() => setImagenUrl('')}
              className="p-2.5 rounded-xl transition-colors"
              style={{ background:'var(--bg-subtle)', color:'var(--text-muted)' }}>
              <FiX />
            </button>
          )}
        </div>
        {/* Preview de la imagen */}
        {imagenUrl && (
          <div className="mt-2 relative inline-block">
            <img src={imagenUrl} alt="Preview" className="h-24 w-24 object-cover rounded-xl"
              onError={e => { e.target.style.display='none'; }}
              style={{ border:'2px solid var(--border-default)' }} />
          </div>
        )}
        <p className="text-xs mt-1" style={{ color:'var(--text-muted)' }}>
          💡 Toma una foto del producto y súbela a <strong>imgbb.com</strong> o <strong>imgur.com</strong> para obtener el enlace.
        </p>
      </div>

      <button type="submit" disabled={enviando || calificacion === 0}
        className="btn-primary w-full justify-center gap-2 disabled:opacity-60">
        {enviando
          ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          : <FiSend />}
        {enviando ? 'Enviando...' : 'Publicar reseña'}
      </button>
    </form>
  );
}
