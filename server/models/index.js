// server/models/index.js
const User      = require('./User');
const Category  = require('./Category');
const Product   = require('./Product');
const Order     = require('./Order');
const OrderItem = require('./OrderItem');
const Review    = require('./Review');

// ── Asociaciones ───────────────────────────────────────────────
// Category ──< Products
Category.hasMany(Product,   { foreignKey: 'CategoryId', as: 'productos' });
Product.belongsTo(Category, { foreignKey: 'CategoryId', as: 'categoria' });

// User ──< Orders
User.hasMany(Order,   { foreignKey: 'UserId', as: 'pedidos' });
Order.belongsTo(User, { foreignKey: 'UserId', as: 'usuario' });

// Order ──< OrderItems
Order.hasMany(OrderItem,   { foreignKey: 'OrderId', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'OrderId' });

// Product ──< OrderItems
Product.hasMany(OrderItem,   { foreignKey: 'ProductId', as: 'lineasPedido' });
OrderItem.belongsTo(Product, { foreignKey: 'ProductId', as: 'producto' });

// Product ──< Reviews
Product.hasMany(Review,   { foreignKey: 'ProductId', as: 'resenas' });
Review.belongsTo(Product, { foreignKey: 'ProductId', as: 'producto' });

// User ──< Reviews
User.hasMany(Review,   { foreignKey: 'UserId', as: 'resenas' });
Review.belongsTo(User, { foreignKey: 'UserId', as: 'usuario' });

// Order ──< Reviews
Order.hasMany(Review,   { foreignKey: 'OrderId', as: 'resenas' });
Review.belongsTo(Order, { foreignKey: 'OrderId' });

module.exports = { User, Category, Product, Order, OrderItem, Review };