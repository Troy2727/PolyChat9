import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  if (admin.apps.length === 0) {
    try {
      // Load service account key from file
      const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

      if (!serviceAccountPath) {
        throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable is not set');
      }

      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'polychat9',
        storageBucket: 'polychat9.firebasestorage.app'
      });
      console.log('Firebase Admin initialized successfully with service account');
    } catch (error) {
      console.error('Firebase Admin initialization error:', error);
      throw new Error('Failed to initialize Firebase Admin SDK. Please check your Firebase configuration.');
    }
  }
  return admin;
};

// Verify Firebase ID token
export const verifyFirebaseToken = async (idToken) => {
  try {
    console.log('Verifying Firebase token...');
    const firebaseAdmin = initializeFirebaseAdmin();
    console.log('Firebase admin initialized, verifying token...');
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    console.log('Token verified successfully for user:', decodedToken.uid);
    return { user: decodedToken, error: null };
  } catch (error) {
    console.error('Firebase token verification error:', error);
    console.error('Error details:', error.code, error.message);
    return { user: null, error: error.message };
  }
};

// Create custom token for LinkedIn authentication
export const createCustomToken = async (uid, additionalClaims = {}) => {
  try {
    const firebaseAdmin = initializeFirebaseAdmin();
    const customToken = await firebaseAdmin.auth().createCustomToken(uid, additionalClaims);
    return { token: customToken, error: null };
  } catch (error) {
    console.error('Custom token creation error:', error);
    return { token: null, error: error.message };
  }
};

// Get or create Firebase user
export const getOrCreateFirebaseUser = async (userData) => {
  try {
    const firebaseAdmin = initializeFirebaseAdmin();
    const { uid, email, displayName, photoURL } = userData;
    
    let userRecord;
    try {
      // Try to get existing user
      userRecord = await firebaseAdmin.auth().getUser(uid);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        // Create new user
        userRecord = await firebaseAdmin.auth().createUser({
          uid,
          email,
          displayName,
          photoURL
        });
      } else {
        throw error;
      }
    }
    
    return { user: userRecord, error: null };
  } catch (error) {
    console.error('Firebase user creation/retrieval error:', error);
    return { user: null, error: error.message };
  }
};

export default initializeFirebaseAdmin;
