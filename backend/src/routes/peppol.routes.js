const express = require('express');
const router = express.Router();
const peppolController = require('../controllers/peppol.controller');
const { protect } = require('../middleware/auth.middleware');

// Routes PEPPOL
router.get('/facture/:id/xml', protect, peppolController.generatePeppolXML);
router.post('/facture/:id/send', protect, peppolController.sendPeppol);
router.get('/facture/:id/status', protect, peppolController.getPeppolStatus);

module.exports = router;
