const express = require('express');
const router = express.Router();

// GET /api/events/availability
router.get('/availability', (req, res) => {
  res.json([
    { date: '2025-01-22', available: true },
    { date: '2025-01-23', available: true },
    { date: '2025-01-24', available: true }
  ]);
});

// GET /api/events
router.get('/', (req, res) => {
  res.json({ message: 'Events API is working!' });
});

// POST /api/events
router.post('/', (req, res) => {
  res.json({ message: 'Event received!', data: req.body });
});

module.exports = router; 