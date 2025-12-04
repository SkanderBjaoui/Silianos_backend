const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Regular user routes
router.post('/user/login', authController.userLogin);
router.post('/user/register', authController.userRegister);
router.put('/user/profile', authController.updateUserProfile);

// Admin routes
router.post('/admin/login', authController.login);
router.post('/admin/register', authController.register);
router.get('/verify', authController.verifyToken);

module.exports = router;

