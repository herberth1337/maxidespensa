# 🛒 MaxiDespensa — Supermercado en Línea

Aplicación web full-stack para un supermercado, con catálogo de productos, carrito de compras, checkout, historial de pedidos y panel de administrador.

Aplicación web full-stack para un supermercado, con catálogo de productos, carrito de compras, checkout, historial de pedidos y panel de administrador.

---

## 🛠️ Tecnologías

| Capa       | Tecnología                        |
|------------|-----------------------------------|
| Frontend   | React 18 + Tailwind CSS           |
| Backend    | Node.js + Express                 |
| Base de datos | MongoDB + Mongoose             |
| Autenticación | JWT (JSON Web Tokens)          |
| Notificaciones | react-hot-toast              |
| Iconos     | react-icons                       |

---

## 📁 Estructura del Proyecto

```
maxidespensa/
├── client/                  # Frontend React
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── common/      # Navbar, Footer, Layout
│       │   ├── admin/       # AdminLayout
│       │   └── products/    # ProductCard
│       ├── context/         # AuthContext, CartContext
│       ├── pages/           # Todas las páginas
│       │   └── admin/       # Dashboard, Productos, Pedidos, Usuarios
│       └── utils/           # api.js (axios configurado)
└── server/                  # Backend Express
    ├── models/              # User, Product, Category, Order
    ├── routes/              # auth, products, orders, users, categories
    ├── middleware/          # auth.js (JWT)
    ├── index.js             # Punto de entrada
    └── seed.js              # Datos de prueba
```

---

## 🚀 Cómo correr el proyecto localmente

### Requisitos previos
- **Node.js** v18 o superior
- **MongoDB** corriendo localmente (`mongod`) o una URI de MongoDB Atlas

---

### 1. Clonar / abrir el proyecto

```bash
cd maxidespensa
```

---

### 2. Instalar dependencias

```bash
# Instalar todo de una vez (requiere concurrently en root)
npm install
npm run install:all
```

O por separado:
```bash
cd server && npm install
cd ../client && npm install
```

---

### 3. Configurar variables de entorno del servidor

```bash
cd server
cp .env.example .env
```

Edita `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maxidespensa
JWT_SECRET=cambia_esto_por_algo_secreto_y_largo
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

> 💡 Si usas MongoDB Atlas, reemplaza `MONGODB_URI` con tu cadena de conexión.

---

### 4. Poblar la base de datos (seed)

```bash
npm run seed
```

Esto crea:
- 10 categorías (Frutas, Bebidas, Lácteos, etc.)
- 23 productos con imágenes
- 3 usuarios de prueba

**Credenciales de prueba:**
```
👑 Administrador: admin@maxidespensa.com / admin123
👤 Cliente:       juan@test.com / test123
```

---

### 5. Correr en modo desarrollo

```bash
# Desde la raíz del proyecto (corre frontend + backend juntos)
npm run dev
```

O por separado:
```bash
# Terminal 1 — Backend
npm run server

# Terminal 2 — Frontend
npm run client
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

---

## 🔐 Roles y accesos

| Ruta               | Cliente | Admin |
|--------------------|---------|-------|
| `/`                | ✅      | ✅    |
| `/catalogo`        | ✅      | ✅    |
| `/carrito`         | ✅      | ✅    |
| `/checkout`        | ✅      | ✅    |
| `/mis-pedidos`     | ✅      | ✅    |
| `/perfil`          | ✅      | ✅    |
| `/admin`           | ❌      | ✅    |
| `/admin/productos` | ❌      | ✅    |
| `/admin/pedidos`   | ❌      | ✅    |
| `/admin/usuarios`  | ❌      | ✅    |

---

## 🧩 Funcionalidades implementadas

### Clientes
- ✅ Registro e inicio de sesión con JWT
- ✅ Perfil editable (nombre, teléfono, dirección)
- ✅ Cambio de contraseña
- ✅ Catálogo con búsqueda, filtros y paginación
- ✅ Carrito persistente (localStorage)
- ✅ Checkout con validación de formulario
- ✅ Simulación de pago (efectivo, tarjeta, transferencia)
- ✅ Historial de pedidos con detalles expandibles
- ✅ Confirmación de pedido con número único

### Administrador
- ✅ Dashboard con estadísticas
- ✅ CRUD completo de productos (con imagen, precio, stock, categoría)
- ✅ Gestión de pedidos con cambio de estado
- ✅ Lista de usuarios con cambio de rol

### UX/Extras
- ✅ Notificaciones toast
- ✅ Skeleton loaders
- ✅ Diseño responsive (móvil y escritorio)
- ✅ Validación de formularios
- ✅ Manejo global de errores

---

## 📡 API Endpoints principales

```
POST   /api/auth/registro
POST   /api/auth/login
GET    /api/auth/me

GET    /api/products          (con ?buscar, ?categoria, ?precioMin/Max, ?page)
POST   /api/products          🔒 Admin
PUT    /api/products/:id      🔒 Admin
DELETE /api/products/:id      🔒 Admin

GET    /api/categories
POST   /api/categories        🔒 Admin

GET    /api/orders/mis-pedidos  🔒 Cliente
GET    /api/orders              🔒 Admin
POST   /api/orders              🔒 Autenticado
PUT    /api/orders/:id/estado   🔒 Admin

GET    /api/users/perfil        🔒 Autenticado
PUT    /api/users/perfil        🔒 Autenticado
GET    /api/users               🔒 Admin
```

---

## ⚙️ Scripts disponibles

```bash
npm run dev          # Inicia frontend + backend en paralelo
npm run server       # Solo backend (nodemon)
npm run client       # Solo frontend (React dev server)
npm run seed         # Poblar base de datos con datos de prueba
npm run build        # Build de producción del frontend
npm run install:all  # Instalar dependencias de client y server
```

---

## 🌐 Despliegue en producción

1. **Build del frontend:**
   ```bash
   npm run build
   ```

2. **Servir el build desde Express** (agrega en `server/index.js`):
   ```js
   app.use(express.static(path.join(__dirname, '../client/build')));
   app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')));
   ```

3. **Variables de entorno en el servidor:**
   - `NODE_ENV=production`
   - `MONGODB_URI=<tu-uri-atlas>`
   - `JWT_SECRET=<secreto-seguro>`
   - `CLIENT_URL=<tu-dominio>`

---

## 📄 Licencia

MIT — Libre para uso educativo y comercial.
