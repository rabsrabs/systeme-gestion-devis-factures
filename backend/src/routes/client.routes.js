const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { Client } = require('../models');

// GET - Lister tous les clients (admin only)
router.get('/', protect, async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json({ success: true, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET - Récupérer un client par ID
router.get('/:id', protect, async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client non trouvé' });
    }
    res.json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Créer un client (admin only)
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT - Modifier un client (admin OU le client lui-même)
router.put('/:id', protect, async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client non trouvé' });
    }
    
    // Vérifier si c'est un admin OU si le client modifie son propre profil
    const isAdmin = req.user.role === 'admin';
    const isOwnProfile = req.user.id_client == req.params.id || req.user.email === client.email;
    
    if (!isAdmin && !isOwnProfile) {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }
    
    await client.update(req.body);
    res.json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE - Supprimer un client (admin OU le client lui-même)
router.delete('/:id', protect, async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      return res.status(404).json({ success: false, message: 'Client non trouvé' });
    }
    
    // Vérifier si c'est un admin OU si le client supprime son propre compte
    const isAdmin = req.user.role === 'admin';
    const isOwnProfile = req.user.id_client == req.params.id || req.user.email === client.email;
    
    if (!isAdmin && !isOwnProfile) {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }
    
    await client.destroy();
    res.json({ success: true, message: 'Compte supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
