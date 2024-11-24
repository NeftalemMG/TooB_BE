import express from 'express';
import { getOrderById, getUserOrders } from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes - require authentication
router.get('/user', authenticate, getUserOrders);
router.get('/:id', authenticate, getOrderById);

export default router;