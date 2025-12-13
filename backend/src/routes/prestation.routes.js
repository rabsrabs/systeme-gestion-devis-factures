const express = require('express');
const { authentification } = require('../middleware/auth.middleware');
const router = express.Router();

// Routes prestations - à implémenter
router.get('/', authentification, (req, res) => {
  res.json({ message: 'Liste des prestations - à implémenter' });
});

router.post('/', authentification, (req, res) => {
  res.json({ message: 'Créer une prestation - à implémenter' });
});

module.exports = router;
