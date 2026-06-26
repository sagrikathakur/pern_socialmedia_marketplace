import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import upload from '../configs/multer.js';
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
router.post('/', requireAuth, upload.array('images', 5), createListing);
router.put('/:id', requireAuth, upload.array('images', 5), updateListing);
router.delete('/:id', requireAuth, deleteListing);
router.put('/:id/status', requireAuth, updateListingStatus);
router.put('/:id/credentials', requireAuth, updateCredentials);

export default router;
