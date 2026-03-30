const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

const authRoutes = require('./authRoutes');
const tradeRoutes = require('./tradeRoutes');
const stripeRoutes = require('./stripeRoutes');

router.use('/auth', authRoutes);
router.use('/trades', tradeRoutes);
router.use('/stripe', stripeRoutes); // Webhook is handled in app.js, this is for other stripe routes

module.exports = router;
