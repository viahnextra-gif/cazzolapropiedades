const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Registro público
router.post('/register', authController.registerUser);
// Login público
router.post('/login', authController.loginUser);
// Refresh token via cookie/body
router.post('/refresh', authController.refreshToken);
// Logout (invalida refresh token)
router.post('/logout', authController.logoutUser);
// Perfil autenticado
router.get('/me', authMiddleware, authController.getProfile);

module.exports = router;
