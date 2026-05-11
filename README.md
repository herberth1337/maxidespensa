# 🛒 MaxiDespensa — Supermercado en Línea

Aplicación web full-stack completa para un supermercado, con catálogo de productos, carrito de compras, checkout, historial de pedidos, reseñas, factura PDF y panel de administración con gráficas.

---

## 🛠️ Tecnologías utilizadas

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Tailwind CSS |
| Backend | Node.js + Express |
| Base de datos | **SQL Server 2022** |
| ORM | Sequelize + Tedious |
| Autenticación | JWT (JSON Web Tokens) |
| Contraseñas | Bcrypt |
| Gráficas | Recharts |
| PDF | jsPDF + jspdf-autotable |
| Notificaciones | react-hot-toast |
| Iconos | react-icons |
| Control de versiones | Git + GitHub |

---

## 📁 Estructura del Proyecto

```
maxidespensa/
├── client/                        # Frontend React
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── common/            # Navbar, Footer, Layout
│       │   ├── admin/             # AdminLayout
│       │   ├── products/          # ProductCard
│       │   └── reviews/           # Estrellas, FormularioResena, ListaResenas
│       ├── context/               # AuthContext, CartContext, ThemeContext
│       ├── pages/
│       │   ├── admin/             # Dashboard, Productos, Pedidos, Usuarios
│       │   ├── Inicio.jsx         # Página principal con carrusel
│       │   ├── Catalogo.jsx       # Catálogo con filtros
│       │   ├── ProductoDetalle.jsx# Detalle + reseñas
│       │   ├── Carrito.jsx
│       │   ├── Checkout.jsx
│       │   ├── PedidoConfirmado.jsx
│       │   ├── MisPedidos.jsx     # Con descarga de factura PDF
│       │   ├── Perfil.jsx
│       │   ├── Login.jsx
│       │   └── Registro.jsx
│       └── utils/
│           ├── api.js             # Axios configurado con interceptores
│           └── generarFactura.js  # Generador de facturas PDF
│
├── server/                        # Backend Node.js + Express
│   ├── config/
│   │   └── database.js            # Conexión Sequelize → SQL Server
│   ├── models/
│   │   ├── index.js               # Asociaciones entre modelos
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── OrderItem.js
│   │   └── Review.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── products.js
│   │   ├── orders.js
│   │   ├── categories.js
│   │   └── reviews.js
│   ├── middleware/
│   │   └── auth.js                # Verificación JWT y roles
│   ├── index.js                   # Punto de entrada del servidor
│   └── seed.js                    # Datos de prueba
│
├── maxidespensa_sqlserver.sql      # Script principal de la BD
├── crear_tabla_reviews.sql         # Script tabla de reseñas
├── actualizar_imagenes_hd.sql      # Script para imágenes HD
└── package.json                    # Scripts raíz
```

---

## 🗄️ Base de Datos — SQL Server 2022

El proyecto usa **SQL Server 2022** (no MongoDB). La base de datos se llama `MaxiDespensa` y contiene 6 tablas:

| Tabla | Descripción |
|---|---|
| `Users` | Clientes y administradores |
| `Categories` | Categorías de productos |
| `Products` | Catálogo de productos |
| `Orders` | Pedidos realizados |
| `OrderItems` | Detalle de cada pedido |
| `Reviews` | Reseñas de productos |

---

## 🚀 Instalación y configuración

### Requisitos previos

- **Node.js** v18 o superior → https://nodejs.org
- **SQL Server 2022** (Developer Edition gratuita) → https://www.microsoft.com/sql-server/sql-server-downloads
- **SSMS** (SQL Server Management Studio) → https://aka.ms/ssmsfullsetup
- **Git** → https://git-scm.com

---

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu_usuario/maxidespensa.git
cd maxidespensa
```

---

### 2. Instalar dependencias

```bash
# Dependencias raíz
npm install

# Dependencias del backend
npm install --prefix server

# Dependencias del frontend
npm install --prefix client
```

---

### 3. Configurar variables de entorno

```bash
cd server
copy .env.example .env
```

Edita `server/.env` con tus datos de SQL Server:

```env
PORT=5000
NODE_ENV=development

JWT_SECRET=cambia_esto_por_algo_muy_secreto
JWT_EXPIRES_IN=7d

DB_HOST=NOMBRE_DE_TU_PC
DB_PORT=1433
DB_NAME=MaxiDespensa
DB_USER=sa
DB_PASSWORD=TuPassword123!
DB_INSTANCE=NOMBRE_INSTANCIA
DB_WINDOWS_AUTH=false
DB_ENCRYPT=false
```

> 💡 Para encontrar el nombre de tu instancia: abre SSMS y mira el nodo raíz del árbol (ej: `DESKTOP-ABC123\HERBERTH`). El host sería `DESKTOP-ABC123` y la instancia `HERBERTH`.

---

### 4. Crear la base de datos

Abre **SSMS**, conéctate a tu servidor y ejecuta en este orden:

```sql
-- 1. Crear tablas principales (categorías, productos, usuarios, pedidos)
-- Archivo: maxidespensa_sqlserver.sql

-- 2. Crear tabla de reseñas
-- Archivo: crear_tabla_reviews.sql
```

---

### 5. Poblar con datos de prueba

```bash
cd ..
npm run seed
```

Esto crea automáticamente:
- 10 categorías (Frutas, Bebidas, Lácteos, etc.)
- 23 productos con imágenes
- 3 usuarios de prueba

---

### 6. Correr el proyecto

```bash
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

Para detenerlo: `Ctrl + C`

---

## 🔑 Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| 👑 Administrador | admin@maxidespensa.com | admin123 |
| 👤 Cliente | juan@test.com | test123 |
| 👤 Cliente | maria@test.com | test123 |

---

## ✅ Funcionalidades implementadas

### Para clientes
- ✅ Registro e inicio de sesión con JWT
- ✅ Página principal con carrusel automático de productos
- ✅ Catálogo con búsqueda, filtros por categoría/precio y paginación
- ✅ Carrito de compras persistente
- ✅ Checkout con validación de formulario
- ✅ Simulación de pago (efectivo, tarjeta, transferencia)
- ✅ Historial de pedidos con detalles expandibles
- ✅ Descarga de factura en PDF por cada pedido
- ✅ Sistema de reseñas con estrellas, comentario y foto
- ✅ Perfil editable con cambio de contraseña
- ✅ Modo oscuro con animación de transición
- ✅ Diseño responsive (móvil y escritorio)

### Para administradores
- ✅ Dashboard con 4 gráficas (ventas, estados, categorías, pedidos)
- ✅ CRUD completo de productos con imagen, precio, stock y categoría
- ✅ Gestión de pedidos con cambio de estado
- ✅ Gestión de usuarios con cambio de roles

---

## 📡 API Endpoints

```
POST   /api/auth/registro
POST   /api/auth/login
GET    /api/auth/me                      🔒

GET    /api/products                     (filtros: buscar, categoria, precioMin/Max, page)
GET    /api/products/:id
POST   /api/products                     🔒 Admin
PUT    /api/products/:id                 🔒 Admin
DELETE /api/products/:id                 🔒 Admin

GET    /api/categories
POST   /api/categories                   🔒 Admin

GET    /api/orders/mis-pedidos           🔒 Cliente
GET    /api/orders                       🔒 Admin
POST   /api/orders                       🔒 Autenticado
PUT    /api/orders/:id/estado            🔒 Admin

GET    /api/reviews/producto/:productId
GET    /api/reviews/puede-resenir/:productId  🔒
POST   /api/reviews                      🔒 (solo compradores)
DELETE /api/reviews/:id                  🔒

GET    /api/users/perfil                 🔒
PUT    /api/users/perfil                 🔒
PUT    /api/users/cambiar-password       🔒
GET    /api/users                        🔒 Admin
PUT    /api/users/:id/rol                🔒 Admin
```

---

## ⚙️ Scripts disponibles

```bash
npm run dev          # Frontend + Backend en paralelo
npm run server       # Solo backend (nodemon)
npm run client       # Solo frontend
npm run seed         # Poblar BD con datos de prueba
npm run build        # Build de producción del frontend
npm run install:all  # Instalar todas las dependencias
```

---

## 🔐 Roles y accesos

| Ruta | Cliente | Admin |
|---|---|---|
| `/` | ✅ | ✅ |
| `/catalogo` | ✅ | ✅ |
| `/carrito` | ✅ | ✅ |
| `/checkout` | ✅ | ✅ |
| `/mis-pedidos` | ✅ | ✅ |
| `/perfil` | ✅ | ✅ |
| `/admin/*` | ❌ | ✅ |

---

## 🌐 Despliegue en producción

1. Build del frontend:
```bash
npm run build --prefix client
```

2. Agrega al final de `server/index.js`:
```js
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')));
```

3. Variables de entorno en producción:
```env
NODE_ENV=production
CLIENT_URL=https://tu-dominio.com
DB_ENCRYPT=true
```

---

## 📄 Licencia

MIT — Libre para uso educativo y comercial.
