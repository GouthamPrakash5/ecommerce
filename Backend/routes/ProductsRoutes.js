const express = require('express');
const router = express.Router();
const productsController = require('../controllers/ProductsController');
const authController = require('../controllers/AuthController');
const { uploadMultiple, handleUploadError } = require('../middleware/upload');

// Public routes (no authentication required)
router.get('/', productsController.getAllProducts);
router.get('/:id', productsController.getProductById);
router.get('/slug/:slug', productsController.getProductBySlug);
router.get('/search', productsController.searchProducts);
router.get('/category/:category', productsController.getProductsByCategory);
router.get('/featured', productsController.getFeaturedProducts);

// Protected routes (authentication required)
router.post('/:id/reviews', authController.verifyToken, productsController.addReview);

// Admin routes (authentication + admin role required)
router.post('/', authController.verifyToken, authController.requireAdmin, uploadMultiple, handleUploadError, productsController.createProduct);
router.put('/:id', authController.verifyToken, authController.requireAdmin, uploadMultiple, handleUploadError, productsController.updateProduct);
router.delete('/:id', authController.verifyToken, authController.requireAdmin, productsController.deleteProduct);
router.get('/stats/overview', authController.verifyToken, authController.requireAdmin, productsController.getProductStats);
router.put('/bulk/update', authController.verifyToken, authController.requireAdmin, productsController.bulkUpdateProducts);

module.exports = router;
