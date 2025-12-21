const express = require('express');
const router = express.Router();
const devisController = require('../controllers/devis.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes CRUD
router.get('/', devisController.getAllDevis);
router.get('/:id', devisController.getDevisById);

// Les clients ET les admins peuvent créer un devis
router.post('/', devisController.createDevis);

// Seuls les admins peuvent modifier/supprimer
router.put('/:id', authorize('admin'), devisController.updateDevis);
router.delete('/:id', authorize('admin'), devisController.deleteDevis);

// Routes spécifiques (admin seulement)
router.patch('/:id/statut', authorize('admin'), devisController.updateStatut);
router.patch('/:id/remise', authorize('admin'), devisController.appliquerRemise);
router.post('/:id/convertir-facture', authorize('admin'), devisController.convertirEnFacture);

module.exports = router;
