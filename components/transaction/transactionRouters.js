import express from 'express';
import { getTransaction, transfer } from './transactionController.js';

const router = express.Router();

router.get('/:txhash', getTransaction);
router.post('/transfer', transfer);

export default router;
