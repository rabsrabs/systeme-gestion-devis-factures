const express = require('express');
const { authentification } = require('../middleware/auth.middleware');
const router = express.Router();

// Routes clients - à implémenter
router.get('/', authentification, (req, res) => {
  res.json({ message: 'Liste des clients - à implémenter' });
});

router.post('/', authentification, (req, res) => {
  res.json({ message: 'Créer un client - à implémenter' });
});

module.exports = router;
