const stripe = require('../utils/stripe');
const UserModel = require('../models/userModel');
const { AppError } = require('../middlewares/errorHandler');

const createCheckoutSession = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userEmail = req.user.email;

    // Create session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID || 'price_1placeholder',
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/billing?canceled=true`,
      customer_email: userEmail,
      client_reference_id: userId,
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

const handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Need raw body for stripe webhook signature verification
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder');
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id;
      const stripeCustomerId = session.customer;

      if (userId) {
        await UserModel.updateStripeCustomerId(userId, stripeCustomerId);
        await UserModel.updateSubscription(userId, 'pro');
      }
    } else if (event.type === 'customer.subscription.deleted') {
      // Handle subscription cancellation
      // Assuming a method like updateSubscriptionByStripeId exists or mapping is done.
      // For MVP, we skip full deletion logic or leave a comment.
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { createCheckoutSession, handleWebhook };
