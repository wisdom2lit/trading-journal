const TradeModel = require('../models/tradeModel');
const UploadService = require('./uploadService');
const { AppError } = require('../middlewares/errorHandler');

class TradeService {
  static async createTrade(userId, tradeData, imageBuffer) {
    let chart_image_url = null;
    
    if (imageBuffer) {
      const uploadResult = await UploadService.uploadImage(imageBuffer);
      chart_image_url = uploadResult.secure_url;
    }

    const trade = {
      user_id: userId,
      pair: tradeData.pair,
      entry_price: tradeData.entry_price,
      stop_loss: tradeData.stop_loss,
      take_profit: tradeData.take_profit,
      lot_size: tradeData.lot_size,
      direction: tradeData.direction,
      result: tradeData.result,
      notes: tradeData.notes,
      executed_at: tradeData.executed_at || new Date().toISOString(),
      chart_image_url
    };

    return await TradeModel.create(trade);
  }

  static async getTrades(userId, query) {
    const limit = parseInt(query.limit) || 50;
    const page = parseInt(query.page) || 1;
    const offset = (page - 1) * limit;

    return await TradeModel.findByUserId(userId, { limit, offset });
  }

  static async getTradeById(id, userId) {
    const trade = await TradeModel.findById(id, userId);
    if (!trade) {
      throw new AppError('Trade not found', 404);
    }
    return trade;
  }

  static async updateTrade(id, userId, tradeData, imageBuffer) {
    // Verify exists
    await this.getTradeById(id, userId);

    const updates = { ...tradeData };
    
    if (imageBuffer) {
      const uploadResult = await UploadService.uploadImage(imageBuffer);
      updates.chart_image_url = uploadResult.secure_url;
    }

    return await TradeModel.update(id, userId, updates);
  }

  static async deleteTrade(id, userId) {
    await this.getTradeById(id, userId);
    return await TradeModel.delete(id, userId);
  }
}

module.exports = TradeService;
