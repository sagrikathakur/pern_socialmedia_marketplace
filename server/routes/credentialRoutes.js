import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  submitCredentials,
  verifyCredentials,
  changeCredentials,
  getCredentialsForListing
} from '../controllers/credentialController.js';

const router = express.Router();

// All routes require auth
router.use(requireAuth);

router.post('/submit/:listingId', submitCredentials);
router.get('/:listingId', getCredentialsForListing);
router.put('/:listingId/verify', verifyCredentials);
router.put('/:listingId/change', changeCredentials);

export default router;
