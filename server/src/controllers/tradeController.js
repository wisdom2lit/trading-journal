const TradeService = require('../services/tradeService');
const { z } = require('zod');
const { AppError } = require('../middlewares/errorHandler');

const tradeSchema = z.object({
  pair: z.string().min(1, 'Pair is required'),
  entry_price: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number()),
  stop_loss: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number()),
  take_profit: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number()),
  lot_size: z.preprocess((a) => parseFloat(z.string().parse(a)), z.number()),
  direction: z.enum(['buy', 'sell']),
  result: z.enum(['win', 'loss', 'breakeven']).optional().nullable(),
  notes: z.string().optional().nullable(),
  executed_at: z.string().optional()
});

const createTrade = async (req, res, next) => {
  try {
    const parsedData = tradeSchema.parse(req.body);
    const userId = req.user.id;
    const imageBuffer = req.file ? req.file.buffer : null;

    const trade = await TradeService.createTrade(userId, parsedData, imageBuffer);
    
    res.status(201).json({ success: true, data: trade });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
};

const getTrades = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await TradeService.getTrades(userId, req.query);
    
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

const getTradeById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const trade = await TradeService.getTradeById(req.params.id, userId);
    
    res.status(200).json({ success: true, data: trade });
  } catch (error) {
    next(error);
  }
};

const updateTrade = async (req, res, next) => {
  try {
    const parsedData = tradeSchema.partial().parse(req.body);
    const userId = req.user.id;
    const imageBuffer = req.file ? req.file.buffer : null;

    const trade = await TradeService.updateTrade(req.params.id, userId, parsedData, imageBuffer);
    
    res.status(200).json({ success: true, data: trade });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(error.errors[0].message, 400));
    } else {
      next(error);
    }
  }
};

const deleteTrade = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await TradeService.deleteTrade(req.params.id, userId);
    
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTrade, getTrades, getTradeById, updateTrade, deleteTrade
};
