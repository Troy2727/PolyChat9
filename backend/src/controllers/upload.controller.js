import { uploadToFirebaseStorage, deleteFromFirebaseStorage } from '../lib/firebase-storage.js';
import { upsertStreamUser } from '../lib/stream.js';
import User from '../models/User.js';

/**
 * Upload profile picture
 */
export const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user._id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload to Firebase Storage
    const { url, error } = await uploadToFirebaseStorage(
      file.buffer,
      file.originalname,
      file.mimetype,
      userId.toString()
    );

    if (error) {
      return res.status(500).json({ 
        message: 'Failed to upload image',
        error: error 
      });
    }

    // Get current user to check for existing avatar
    const currentUser = await User.findById(userId);
    const oldAvatarUrl = currentUser.avatarUrl;

    // Update user with new avatar URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatarUrl: url },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update Stream user with new avatar
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: url,
      });
      console.log(`Stream user avatar updated for ${updatedUser.fullName}`);
    } catch (streamError) {
      console.log('Error updating Stream user avatar:', streamError.message);
    }

    // Delete old avatar from Firebase Storage if it exists and is not a random avatar
    if (oldAvatarUrl && !oldAvatarUrl.includes('avatar.iran.liara.run') && !oldAvatarUrl.includes('storage.googleapis.com')) {
      try {
        await deleteFromFirebaseStorage(oldAvatarUrl);
      } catch (deleteError) {
        console.log('Error deleting old avatar:', deleteError);
        // Don't fail the request if old avatar deletion fails
      }
    }

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      user: updatedUser,
      avatarUrl: url
    });

  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({ 
      message: 'Internal Server Error',
      error: error.message 
    });
  }
};

/**
 * Delete profile picture (revert to random avatar)
 */
export const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get current user
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const currentAvatarUrl = currentUser.avatarUrl;

    // Update user to remove custom avatar (will fall back to random avatar)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatarUrl: '' },
      { new: true }
    ).select('-password');

    // Update Stream user to use random avatar
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.randomAvatarUrl || updatedUser.profilePic || '',
      });
      console.log(`Stream user avatar reverted for ${updatedUser.fullName}`);
    } catch (streamError) {
      console.log('Error updating Stream user avatar:', streamError.message);
    }

    // Delete the uploaded avatar from Firebase Storage
    if (currentAvatarUrl && currentAvatarUrl.includes('storage.googleapis.com')) {
      try {
        await deleteFromFirebaseStorage(currentAvatarUrl);
      } catch (deleteError) {
        console.log('Error deleting avatar from storage:', deleteError);
        // Don't fail the request if deletion fails
      }
    }

    res.status(200).json({
      success: true,
      message: 'Profile picture deleted successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Delete profile picture error:', error);
    res.status(500).json({ 
      message: 'Internal Server Error',
      error: error.message 
    });
  }
};
