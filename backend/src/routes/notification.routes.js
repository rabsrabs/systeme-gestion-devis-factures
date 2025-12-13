const express = require('express');
const { authentification } = require('../middleware/auth.middleware');
const router = express.Router();

// Routes notifications - à implémenter
router.get('/', authentification, (req, res) => {
  res.json({ message: 'Liste des notifications - à implémenter' });
});

module.exports = router;
