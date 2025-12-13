const express = require('express');
const { authentification } = require('../middleware/auth.middleware');
const router = express.Router();

// Routes paiements - à implémenter
router.get('/', authentification, (req, res) => {
  res.json({ message: 'Liste des paiements - à implémenter' });
});

router.post('/', authentification, (req, res) => {
  res.json({ message: 'Enregistrer un paiement - à implémenter' });
});

module.exports = router;
