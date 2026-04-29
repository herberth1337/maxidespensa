// client/src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [oscuro, setOscuro] = useState(() => {
    const guardado = localStorage.getItem('tema');
    if (guardado) return guardado === 'oscuro';
    // Detectar preferencia del sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (oscuro) {
      root.classList.add('dark');
      localStorage.setItem('tema', 'oscuro');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('tema', 'claro');
    }
  }, [oscuro]);

  // Cambio de tema con efecto ripple desde el botón
  const toggleTema = useCallback((e) => {
    // Crear el elemento ripple desde donde se hizo click
    const ripple = document.createElement('div');
    ripple.classList.add('theme-ripple', oscuro ? 'theme-ripple-light' : 'theme-ripple-dark');

    if (e?.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      ripple.style.left = `${rect.left + rect.width / 2 - 20}px`;
      ripple.style.top  = `${rect.top  + rect.height / 2 - 20}px`;
    } else {
      ripple.style.left = '50%';
      ripple.style.top  = '50%';
    }

    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);

    // Cambiar tema ligeramente después para que el ripple se vea
    setTimeout(() => setOscuro(prev => !prev), 50);
  }, [oscuro]);

  return (
    <ThemeContext.Provider value={{ oscuro, toggleTema }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return ctx;
};
