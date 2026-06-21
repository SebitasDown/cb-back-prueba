import express from 'express';
import { login, register, verifyEmail, forgotPassword, resetPassword } from './auth.controller.js';

const router = express.Router();

router.post('/', login);
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
