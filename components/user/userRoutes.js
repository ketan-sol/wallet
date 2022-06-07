import express from 'express';
import { login } from '../../middleware/auth.js';
import verifyEmail from '../../utils/email.js';
import signup from './userController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verifyEmail', verifyEmail);

export default router;
