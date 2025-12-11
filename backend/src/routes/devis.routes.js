const express = require('express');
const { authentification } = require('../middleware/auth.middleware');
const router = express.Router();

// Routes devis - à implémenter
router.get('/', authentification, (req, res) => {
  res.json({ message: 'Liste des devis - à implémenter' });
});

router.post('/', authentification, (req, res) => {
  res.json({ message: 'Créer un devis - à implémenter' });
});

module.exports = router;
