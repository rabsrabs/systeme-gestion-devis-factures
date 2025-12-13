const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { PrestationService } = require('../models');

router.get('/', protect, async (req, res) => {
  try {
    const prestations = await PrestationService.findAll();
    res.json({ success: true, data: prestations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const prestation = await PrestationService.create(req.body);
    res.status(201).json({ success: true, data: prestation });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
