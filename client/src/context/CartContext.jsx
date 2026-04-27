import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('carrito')) || []; } catch { return []; }
  });
  const [abierto, setAbierto] = useState(false);

  // Persistir carrito en localStorage
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items));
  }, [items]);

  const agregar = useCallback((producto, cantidad = 1) => {
    setItems(prev => {
      const existe = prev.find(i => i._id === producto._id);
      if (existe) {
        return prev.map(i =>
          i._id === producto._id
            ? { ...i, cantidad: Math.min(i.cantidad + cantidad, producto.stock) }
            : i
        );
      }
      return [...prev, { ...producto, cantidad }];
    });
  }, []);

  const eliminar = useCallback((id) => {
    setItems(prev => prev.filter(i => i._id !== id));
  }, []);

  const actualizarCantidad = useCallback((id, cantidad) => {
    if (cantidad < 1) { eliminar(id); return; }
    setItems(prev => prev.map(i => i._id === id ? { ...i, cantidad } : i));
  }, [eliminar]);

  const limpiar = useCallback(() => setItems([]), []);

  const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const cantidadTotal = items.reduce((acc, i) => acc + i.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, agregar, eliminar, actualizarCantidad, limpiar, total, cantidadTotal, abierto, setAbierto }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
};
