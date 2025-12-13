const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Routes publiques
router.post('/register', authController.register);
router.post('/login', authController.login);

// Routes protégées
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);
router.put('/password', protect, authController.changePassword);

module.exports = router;
