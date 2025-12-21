const express = require('express');
const router = express.Router();
const factureController = require('../controllers/facture.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);

// Routes
router.get('/', factureController.getAllFactures);
router.get('/:id/pdf', factureController.generatePDF);

module.exports = router;
