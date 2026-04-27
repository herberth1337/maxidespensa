// server/models/index.js
// Punto central: importa todos los modelos y define las asociaciones

const User      = require('./User');
const Category  = require('./Category');
const Product   = require('./Product');
const Order     = require('./Order');
const OrderItem = require('./OrderItem');

// ── Asociaciones ───────────────────────────────────────────────
// Category  ──< Products
Category.hasMany(Product,  { foreignKey: 'CategoryId', as: 'productos' });
Product.belongsTo(Category,{ foreignKey: 'CategoryId', as: 'categoria' });

// User  ──< Orders
User.hasMany(Order,   { foreignKey: 'UserId', as: 'pedidos' });
Order.belongsTo(User, { foreignKey: 'UserId', as: 'usuario' });

// Order  ──< OrderItems
Order.hasMany(OrderItem,    { foreignKey: 'OrderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order,  { foreignKey: 'OrderId' });

// Product  ──< OrderItems  (para navegar hacia el producto original)
Product.hasMany(OrderItem,   { foreignKey: 'ProductId', as: 'lineasPedido' });
OrderItem.belongsTo(Product, { foreignKey: 'ProductId', as: 'producto' });

module.exports = { User, Category, Product, Order, OrderItem };
