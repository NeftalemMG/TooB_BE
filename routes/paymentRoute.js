import express from 'express';
import { createPaymentIntent } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-payment-intent', authenticate, createPaymentIntent);

export default router;

