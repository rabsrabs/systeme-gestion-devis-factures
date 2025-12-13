const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', protect, async (req, res) => {
  res.json({ success: true, data: [], message: 'Paiements endpoint' });
});

module.exports = router;
