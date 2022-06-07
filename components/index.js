import express from 'express';
import userRouter from './user/userRoutes.js';
import transactionRouter from './transaction/transactionRouters.js';
import walletRouter from './wallet/walletRoutes.js';

const router = express.Router();

router.use('/user', userRouter);
router.use('/transaction', transactionRouter);
router.use('/wallet', walletRouter);

export default router;
