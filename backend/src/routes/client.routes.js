const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const { Client } = require('../models');

router.get('/', protect, async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.json({ success: true, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
