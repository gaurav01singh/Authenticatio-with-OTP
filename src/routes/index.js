const express = require('express');
const authRoutes = require('./authRoutes');

const router = express.Router();

router.use('/auth', authRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

module.exports = router;
