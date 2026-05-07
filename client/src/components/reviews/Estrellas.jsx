// Componente reutilizable de estrellas
import React from 'react';

export default function Estrellas({ valor, max = 5, tamaño = 18, interactivo = false, onChange }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(max)].map((_, i) => {
        const llena = i < Math.floor(valor);
        const media = !llena && i < valor;
        return (
          <span
            key={i}
            onClick={() => interactivo && onChange && onChange(i + 1)}
            style={{
              fontSize:   tamaño,
              cursor:     interactivo ? 'pointer' : 'default',
              color:      llena || media ? '#f59e0b' : '#d1d5db',
              transition: 'transform 0.15s, color 0.15s',
              display:    'inline-block',
            }}
            onMouseEnter={e => { if (interactivo) e.currentTarget.style.transform = 'scale(1.2)'; }}
            onMouseLeave={e => { if (interactivo) e.currentTarget.style.transform = 'scale(1)'; }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
