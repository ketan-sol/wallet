import express from 'express';
import { isUserVerified } from '../../middleware/auth.js';
import genMnemonic from './walletController.js';

const router = express.Router();

router.post('/generateMnemonic', isUserVerified, genMnemonic);

export default router;
