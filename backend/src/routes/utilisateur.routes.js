const express = require('express');
const router = express.Router();
const { Utilisateur } = require('../models');
const { protect, isAdmin } = require('../middleware/auth.middleware');

// GET tous les utilisateurs (admin seulement)
router.get('/', protect, async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.findAll({
      attributes: ['id_utilisateur', 'nom', 'prenom', 'email', 'telephone', 'role', 'actif', 'date_creation']
    });
    res.json({ success: true, data: utilisateurs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
