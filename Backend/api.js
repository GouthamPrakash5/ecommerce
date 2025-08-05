const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./routes/AuthRoutes');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productsRoutes = require('./routes/ProductsRoutes');

// API Routes
router.use('/auth', authRoutes);

// Legacy routes (keeping for compatibility)
router.use('/', indexRouter);
router.use('/users', usersRouter);
router.use('/products', productsRoutes);

// API Health Check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'RainbowShop API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Documentation endpoint
router.get('/docs', (req, res) => {
  res.json({
    success: true,
    message: 'RainbowShop API Documentation',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register (name, email, password, age?, role?)',
        registerAdmin: 'POST /api/auth/admin/register (name, email, password, age) (admin only)',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        updateProfile: 'PUT /api/auth/profile (name?, email?, age?)',
        changePassword: 'PUT /api/auth/change-password',
        purchaseHistory: 'GET /api/auth/purchase-history',
        users: 'GET /api/auth/users (admin only)',
        userById: 'GET /api/auth/users/:userId (admin only)',
        toggleUserBlock: 'PUT /api/auth/users/:userId/block (admin only)',
        changeUserRole: 'PUT /api/auth/users/:userId/role (admin only)',
        deleteUser: 'DELETE /api/auth/users/:userId (admin only)'
      },
      products: {
        getAll: 'GET /api/products',
        getById: 'GET /api/products/:id',
        getBySlug: 'GET /api/products/slug/:slug',
        create: 'POST /api/products (admin only, supports file upload)',
        update: 'PUT /api/products/:id (admin only, supports file upload)',
        delete: 'DELETE /api/products/:id (admin only)',
        search: 'GET /api/products/search?q=query',
        byCategory: 'GET /api/products/category/:category',
        featured: 'GET /api/products/featured',
        addReview: 'POST /api/products/:id/reviews (auth required)',
        stats: 'GET /api/products/stats/overview (admin only)',
        bulkUpdate: 'PUT /api/products/bulk/update (admin only)'
      },
      health: 'GET /api/health',
      docs: 'GET /api/docs'
    }
  });
});

module.exports = router;

