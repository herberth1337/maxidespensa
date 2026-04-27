// server/seed.js  — poblar SQL Server con datos de prueba
require('dotenv').config();
const { sequelize, conectar } = require('./config/database');
const { User, Category, Product } = require('./models/index');

async function seed() {
  await conectar();
  console.log('\n🌱 Iniciando seed...\n');

  // Nota: las tablas ya deben existir (ejecuta primero el .sql)
  // Este script solo inserta datos de prueba

  // ── Categorías ─────────────────────────────────────────────
  const cats = await Category.bulkCreate([
    { Nombre: 'Frutas y Verduras',  Icono: '🥦', Color: '#22c55e' },
    { Nombre: 'Carnes y Embutidos', Icono: '🥩', Color: '#ef4444' },
    { Nombre: 'Lácteos y Huevos',   Icono: '🥛', Color: '#f59e0b' },
    { Nombre: 'Panadería',          Icono: '🍞', Color: '#d97706' },
    { Nombre: 'Bebidas',            Icono: '🥤', Color: '#3b82f6' },
    { Nombre: 'Limpieza',           Icono: '🧹', Color: '#8b5cf6' },
    { Nombre: 'Higiene Personal',   Icono: '🧴', Color: '#ec4899' },
    { Nombre: 'Granos y Cereales',  Icono: '🌾', Color: '#f97316' },
    { Nombre: 'Snacks y Dulces',    Icono: '🍫', Color: '#a16207' },
    { Nombre: 'Congelados',         Icono: '🧊', Color: '#06b6d4' },
  ], { ignoreDuplicates: true });
  console.log(`📁 ${cats.length} categorías insertadas`);

  // Obtener IDs reales de las categorías recién creadas
  const [fv, ce, le, pan, beb, lim, , gc, snk] =
    await Category.findAll({ order: [['CategoryId','ASC']] });

  // ── Usuarios ───────────────────────────────────────────────
  const users = await User.bulkCreate([
    { Nombre: 'Administrador', Email: 'admin@maxidespensa.com', PasswordHash: 'admin123', Rol: 'admin',   Telefono: '+502 2222 1111' },
    { Nombre: 'Juan Pérez',    Email: 'juan@test.com',          PasswordHash: 'test123',  Rol: 'cliente', Telefono: '+502 5555 4321' },
    { Nombre: 'María García',  Email: 'maria@test.com',         PasswordHash: 'test123',  Rol: 'cliente', Telefono: '+502 4444 9876' },
  ], { ignoreDuplicates: true });
  console.log(`👤 ${users.length} usuarios insertados`);

  // ── Productos ──────────────────────────────────────────────
  const prods = await Product.bulkCreate([
    { CategoryId: fv.CategoryId,  Nombre: 'Manzanas Rojas',    Descripcion: 'Manzanas frescas importadas 2kg', Precio: 35, PrecioAnterior: 40, Stock: 50, Imagen: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400', Unidad: 'kg',     Destacado: true  },
    { CategoryId: fv.CategoryId,  Nombre: 'Plátanos',          Descripcion: 'Plátanos maduros de temporada',   Precio: 12, Stock: 80, Imagen: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', Unidad: 'kg',     Destacado: false },
    { CategoryId: fv.CategoryId,  Nombre: 'Aguacates Hass',    Descripcion: 'Aguacates listos para comer',     Precio: 18, Stock: 35, Imagen: 'https://images.unsplash.com/photo-1560155016-bd4879ae8f21?w=400', Unidad: 'unidad', Destacado: true  },
    { CategoryId: le.CategoryId,  Nombre: 'Leche Entera 1L',   Descripcion: 'Leche entera pasteurizada',       Precio: 16, PrecioAnterior: 18, Stock: 100, Imagen: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400', Unidad: 'litro',  Destacado: true  },
    { CategoryId: le.CategoryId,  Nombre: 'Huevos x30',        Descripcion: 'Cartón de 30 huevos medianos',    Precio: 45, Stock: 60, Imagen: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400', Unidad: 'unidad', Destacado: true  },
    { CategoryId: le.CategoryId,  Nombre: 'Queso Fresco 500g', Descripcion: 'Queso fresco artesanal',          Precio: 38, Stock: 25, Imagen: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400', Unidad: 'g',      Destacado: false },
    { CategoryId: beb.CategoryId, Nombre: 'Agua Pura 1.5L',    Descripcion: 'Agua pura embotellada',           Precio: 8,  PrecioAnterior: 10, Stock: 200, Imagen: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=400', Unidad: 'litro',  Destacado: true  },
    { CategoryId: beb.CategoryId, Nombre: 'Café Molido 250g',  Descripcion: 'Café guatemalteco molido',        Precio: 42, Stock: 30, Imagen: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400', Unidad: 'g',      Destacado: true  },
    { CategoryId: gc.CategoryId,  Nombre: 'Arroz Blanco 1kg',  Descripcion: 'Arroz blanco extra',              Precio: 18, Stock: 120, Imagen: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', Unidad: 'kg',     Destacado: true  },
    { CategoryId: gc.CategoryId,  Nombre: 'Frijoles Negros 1kg',Descripcion: 'Frijoles negros secos',          Precio: 24, Stock: 85, Imagen: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400', Unidad: 'kg',     Destacado: false },
    { CategoryId: pan.CategoryId, Nombre: 'Pan Blanco 680g',   Descripcion: 'Pan blanco de molde',             Precio: 28, Stock: 35, Imagen: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400', Unidad: 'unidad', Destacado: true  },
    { CategoryId: lim.CategoryId, Nombre: 'Detergente 1L',     Descripcion: 'Detergente líquido para ropa',    Precio: 55, PrecioAnterior: 65, Stock: 40, Imagen: 'https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=400', Unidad: 'litro',  Destacado: false },
    { CategoryId: ce.CategoryId,  Nombre: 'Pollo Entero',      Descripcion: 'Pollo fresco de granja',          Precio: 85, Stock: 20, Imagen: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=400', Unidad: 'kg',     Destacado: true  },
    { CategoryId: snk.CategoryId, Nombre: 'Papas Fritas 150g', Descripcion: 'Papas fritas sabor sal',          Precio: 16, Stock: 90, Imagen: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400', Unidad: 'g',      Destacado: false },
  ], { ignoreDuplicates: true });
  console.log(`📦 ${prods.length} productos insertados`);

  console.log('\n✅ Seed completado!');
  console.log('   Admin  → admin@maxidespensa.com / admin123');
  console.log('   Cliente→ juan@test.com / test123\n');
  process.exit(0);
}

seed().catch(err => { console.error('❌', err.message); process.exit(1); });
