const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Registro público
router.post('/register', authController.register);
// Login público
router.post('/login', authController.login);
// Refresh token
router.post('/refresh', authController.refresh);
// Logout (precisa de refresh token válido)
router.post('/logout', authController.logout);
// Perfil do usuário autenticado
router.get('/me', authMiddleware, authController.me);

module.exports = router;
