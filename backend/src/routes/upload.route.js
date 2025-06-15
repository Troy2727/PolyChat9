import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { uploadSingle, validateImageUpload } from '../middleware/upload.middleware.js';
import { uploadProfilePicture, deleteProfilePicture } from '../controllers/upload.controller.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protectRoute);

// Upload profile picture
router.post(
  '/profile-picture',
  uploadSingle('profilePicture'),
  validateImageUpload,
  uploadProfilePicture
);

// Delete profile picture
router.delete('/profile-picture', deleteProfilePicture);

export default router;
