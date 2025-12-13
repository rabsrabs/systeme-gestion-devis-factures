const express = require('express');
const router = express.Router();
const devisController = require('../controllers/devis.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Toutes les routes nécessitent une authentification
router.use(protect);

// Routes CRUD
router.get('/', devisController.getAllDevis);
router.get('/:id', devisController.getDevisById);
router.post('/', authorize('admin'), devisController.createDevis);
router.put('/:id', authorize('admin'), devisController.updateDevis);
router.delete('/:id', authorize('admin'), devisController.deleteDevis);

// Routes spécifiques
router.patch('/:id/statut', authorize('admin'), devisController.updateStatut);
router.post('/:id/convertir-facture', authorize('admin'), devisController.convertirEnFacture);

module.exports = router;
