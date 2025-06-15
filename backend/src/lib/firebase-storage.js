import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid';
import initializeFirebaseAdmin from './firebase-admin.js';

/**
 * Upload file to Firebase Storage
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} fileName - Original file name
 * @param {string} mimeType - File MIME type
 * @param {string} userId - User ID for organizing files
 * @returns {Promise<{url: string, error: null} | {url: null, error: string}>}
 */
export const uploadToFirebaseStorage = async (fileBuffer, fileName, mimeType, userId) => {
  try {
    const firebaseAdmin = initializeFirebaseAdmin();

    // Try to list buckets to debug access issues
    try {
      const [buckets] = await firebaseAdmin.storage().getBuckets();
      console.log('Available buckets:', buckets.map(bucket => bucket.name));
    } catch (listError) {
      console.log('Could not list buckets:', listError.message);
    }

    // Try different bucket name formats
    let bucket;
    try {
      bucket = firebaseAdmin.storage().bucket('polychat9.firebasestorage.app');
    } catch (error) {
      console.log('Trying alternative bucket name...');
      bucket = firebaseAdmin.storage().bucket('polychat9.appspot.com');
    }

    // Generate unique filename
    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `avatars/${userId}/${uuidv4()}.${fileExtension}`;

    // Create file reference
    const file = bucket.file(uniqueFileName);

    // Upload file
    await file.save(fileBuffer, {
      metadata: {
        contentType: mimeType,
        metadata: {
          originalName: fileName,
          uploadedBy: userId,
          uploadedAt: new Date().toISOString()
        }
      }
    });

    // Make file publicly accessible
    await file.makePublic();

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${uniqueFileName}`;

    return { url: publicUrl, error: null };
  } catch (error) {
    console.error('Firebase Storage upload error:', error);

    // Fallback: For development, return a placeholder URL
    // In production, you should set up proper Firebase credentials
    if (error.message.includes('Bucket name not specified') ||
        error.message.includes('invalid-argument') ||
        error.message.includes('bucket does not exist') ||
        error.message.includes('specified bucket does not exist') ||
        (error.status === 404) ||
        (error.response && error.response.status === 404)) {
      console.warn('Firebase Storage not properly configured. Using fallback avatar generation.');
      // Generate a random avatar as fallback
      const fallbackUrl = generateRandomAvatar();
      return { url: fallbackUrl, error: null };
    }

    return { url: null, error: error.message };
  }
};

/**
 * Delete file from Firebase Storage
 * @param {string} fileUrl - Public URL of the file to delete
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
export const deleteFromFirebaseStorage = async (fileUrl) => {
  try {
    const firebaseAdmin = initializeFirebaseAdmin();
    const bucket = firebaseAdmin.storage().bucket();
    
    // Extract file path from URL
    const urlParts = fileUrl.split('/');
    const bucketName = urlParts[3];
    const filePath = urlParts.slice(4).join('/');
    
    if (bucketName !== bucket.name) {
      throw new Error('File does not belong to this storage bucket');
    }
    
    // Delete file
    await bucket.file(filePath).delete();
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Firebase Storage delete error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Generate random avatar URL
 * @returns {string} Random avatar URL
 */
export const generateRandomAvatar = () => {
  const idx = Math.floor(Math.random() * 100) + 1;
  return `https://avatar.iran.liara.run/public/${idx}.png`;
};
