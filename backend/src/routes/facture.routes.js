const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { Facture, Client } = require('../models');

router.get('/', protect, async (req, res) => {
  try {
    const factures = await Facture.findAll({ include: [Client] });
    res.json({ success: true, data: factures });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const facture = await Facture.create(req.body);
    res.status(201).json({ success: true, data: facture });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
