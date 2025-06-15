// Test Firebase Admin SDK configuration
import dotenv from 'dotenv';
import fs from 'fs';
import admin from 'firebase-admin';

dotenv.config();

console.log('🔥 Testing Firebase Admin SDK...');
console.log('Environment variables:');
console.log('- GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
console.log('- PORT:', process.env.PORT);

try {
  // Test if the service account file exists
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  if (fs.existsSync(serviceAccountPath)) {
    console.log('✅ Service account file exists');
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    console.log('✅ Service account parsed successfully');
    console.log('- Project ID:', serviceAccount.project_id);
    console.log('- Client Email:', serviceAccount.client_email);
  } else {
    console.log('❌ Service account file not found at:', serviceAccountPath);
  }

  // Test Firebase Admin initialization
  console.log('\n🔥 Testing Firebase Admin initialization...');
  
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS),
      projectId: 'polychat9',
      storageBucket: 'polychat9.firebasestorage.app'
    });
    console.log('✅ Firebase Admin initialized successfully');
  } else {
    console.log('✅ Firebase Admin already initialized');
  }

  // Test auth service
  const auth = admin.auth();
  console.log('✅ Firebase Auth service accessible');

  console.log('\n🎉 All Firebase tests passed!');
  
} catch (error) {
  console.error('❌ Firebase test failed:', error.message);
  console.error('Full error:', error);
}
