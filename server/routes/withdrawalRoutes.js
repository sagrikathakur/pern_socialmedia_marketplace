import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  createWithdrawal,
  getWithdrawals,
  markAsPaid
} from '../controllers/withdrawalController.js';

const router = express.Router();

// All routes require auth
router.use(requireAuth);

router.post('/', createWithdrawal);
router.get('/', getWithdrawals);
router.put('/:id/withdraw', markAsPaid);

export default router;
