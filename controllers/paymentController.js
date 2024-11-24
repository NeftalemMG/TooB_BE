import { stripe } from '../lib/stripe.js';
import Order from '../models/orderModel.js';

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, items } = req.body;

    console.log('Received items:', items); // Add this log

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects the amount in cents
      currency: 'usd',
    });

    const order = new Order({
      user: req.user._id,
      products: items.map(item => ({
        product: item._id, // Assuming item._id is the product ID
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount: amount,
      stripeSessionId: paymentIntent.client_secret,
    });

    console.log('Created order:', order); // Add this log

    await order.save();

    res.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order._id,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Error creating payment intent', error: error.message });
  }
};