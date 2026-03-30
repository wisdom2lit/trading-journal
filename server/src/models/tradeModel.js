const supabase = require('../config/supabase');

class TradeModel {
  static async create(tradeData) {
    const { data, error } = await supabase
      .from('trades')
      .insert([tradeData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByUserId(userId, { limit = 50, offset = 0 } = {}) {
    const { data, error, count } = await supabase
      .from('trades')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('executed_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error && error.code !== 'PGRST116') throw error;
    return { data, count };
  }

  static async findById(id, userId) {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async update(id, userId, updates) {
    const { data, error } = await supabase
      .from('trades')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async delete(id, userId) {
    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  }
}

module.exports = TradeModel;
