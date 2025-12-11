const express = require('express');
const { authentification } = require('../middleware/auth.middleware');
const router = express.Router();

// Routes factures - à implémenter
router.get('/', authentification, (req, res) => {
  res.json({ message: 'Liste des factures - à implémenter' });
});

router.post('/', authentification, (req, res) => {
  res.json({ message: 'Créer une facture - à implémenter' });
});

module.exports = router;
