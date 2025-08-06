const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

// Public routes (no authentication required)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Admin registration route (requires admin authentication)
router.post('/admin/register', authController.verifyToken, authController.requireAdmin, authController.registerAdmin);
// router.post('/admin/register',  authController.registerAdmin);

// Protected routes (authentication required)
router.get('/profile', authController.verifyToken, authController.getProfile);
router.put('/profile', authController.verifyToken, authController.updateProfile);
router.put('/change-password', authController.verifyToken, authController.changePassword);
router.get('/purchase-history', authController.verifyToken, authController.getPurchaseHistory);

// Admin routes (authentication + admin role required)
router.get('/users', authController.verifyToken, authController.requireAdmin, authController.getAllUsers);
router.get('/users/:userId', authController.verifyToken, authController.requireAdmin, authController.getUserById);
router.put('/users/:userId/block', authController.verifyToken, authController.requireAdmin, authController.toggleUserBlock);
router.put('/users/:userId/role', authController.verifyToken, authController.requireAdmin, authController.changeUserRole);
router.delete('/users/:userId', authController.verifyToken, authController.requireAdmin, authController.deleteUser);

module.exports = router;


