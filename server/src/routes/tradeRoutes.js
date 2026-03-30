const express = require('express');
const { createTrade, getTrades, getTradeById, updateTrade, deleteTrade } = require('../controllers/tradeController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

const router = express.Router();

router.use(protect); // All trade routes require authentication

router.route('/')
  .get(getTrades)
  .post(upload.single('chart_image'), createTrade);

router.route('/:id')
  .get(getTradeById)
  .put(upload.single('chart_image'), updateTrade)
  .delete(deleteTrade);

module.exports = router;
