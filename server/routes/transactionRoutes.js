import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  purchaseListing,
  getTransactions,
  getUserPurchases
} from '../controllers/transactionController.js';

const router = express.Router();

// All routes require auth
router.use(requireAuth);

router.post('/purchase', purchaseListing);
router.get('/', getTransactions); // For admin, though we could use general auth for simplicity
router.get('/user/all', getUserPurchases);

export default router;
