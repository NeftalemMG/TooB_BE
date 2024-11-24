import express from 'express';
import { getAdminStats } from '../controllers/adminController.js';
import { authenticate, adminRoute } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', authenticate, adminRoute, getAdminStats);

export default router;