import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  getUserListings,
  updateListingStatus,
  updateCredentials
} from '../controllers/listingController.js';

const router = express.Router();

// Public routes
router.get('/', getListings);
router.get('/:id', getListingById);

// Authenticated routes
router.get('/user/all', requireAuth, getUserListings); // Changed from /user to /user/all or router order, let's keep /user/all so it does not conflict with /:id
router.post('/', requireAuth, createListing);
router.put('/:id', requireAuth, updateListing);
router.delete('/:id', requireAuth, deleteListing);
router.put('/:id/status', requireAuth, updateListingStatus);
router.put('/:id/credentials', requireAuth, updateCredentials);

export default router;
