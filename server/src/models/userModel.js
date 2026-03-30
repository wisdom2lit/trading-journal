const supabase = require('../config/supabase');

class UserModel {
  static async create({ email, passwordHash, subscriptionTier = 'free' }) {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email, password_hash: passwordHash, subscription_tier: subscriptionTier }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is no rows returned
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async updateStripeCustomerId(id, stripeCustomerId) {
    const { data, error } = await supabase
      .from('users')
      .update({ stripe_customer_id: stripeCustomerId })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateSubscription(id, tier) {
    const { data, error } = await supabase
      .from('users')
      .update({ subscription_tier: tier })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
}

module.exports = UserModel;
