import express from 'express';
import { getCartItems, addToCart, removeFromCart, updateCartItem, removeAllFromCart } from '../controllers/cartController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticate);

router.route('/')
  .get(getCartItems)
  .post(addToCart);

router.route('/:id')
  .delete(removeFromCart)
  .put(updateCartItem);

router.post('/remove-all', removeAllFromCart);

export default router;