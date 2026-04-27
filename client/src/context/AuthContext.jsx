import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(() => {
    try { return JSON.parse(localStorage.getItem('usuario')); } catch { return null; }
  });
  const [cargando, setCargando] = useState(true);

  // Verificar token al iniciar
  useEffect(() => {
    const verificar = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setCargando(false); return; }
      try {
        const { data } = await api.get('/auth/me');
        setUsuario(data.usuario);
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        setUsuario(null);
      } finally {
        setCargando(false);
      }
    };
    verificar();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data;
  }, []);

  const registro = useCallback(async (datos) => {
    const { data } = await api.post('/auth/registro', datos);
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  }, []);

  const actualizarUsuario = useCallback((datos) => {
    setUsuario(prev => ({ ...prev, ...datos }));
    localStorage.setItem('usuario', JSON.stringify({ ...usuario, ...datos }));
  }, [usuario]);

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, registro, logout, actualizarUsuario, esAdmin: usuario?.rol === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
