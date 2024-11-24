import express from 'express';
import { signup, login, logout, refreshToken, getMe } from '../controllers/auth_controller.js'
import { authenticate } from '../middleware/authMiddleware.js';


const router = express.Router();


router.post('/signup', signup);

router.post('/login', login);

router.post('/logout', logout);

router.post('/refresh_token', refreshToken);

router.get('/me', authenticate, getMe);

//router.get('/profile', getProfile);

export { router };