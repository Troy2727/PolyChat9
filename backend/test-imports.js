// Test imports one by one
console.log('Testing imports...');

try {
  console.log('1. Testing express...');
  const express = await import('express');
  console.log('✅ Express imported');

  console.log('2. Testing dotenv...');
  const dotenv = await import('dotenv');
  console.log('✅ Dotenv imported');

  console.log('3. Testing cors...');
  const cors = await import('cors');
  console.log('✅ CORS imported');

  console.log('4. Testing cookie-parser...');
  const cookieParser = await import('cookie-parser');
  console.log('✅ Cookie-parser imported');

  console.log('5. Testing path...');
  const path = await import('path');
  console.log('✅ Path imported');

  console.log('6. Testing auth routes...');
  const authRoutes = await import('./src/routes/auth.route.js');
  console.log('✅ Auth routes imported');

  console.log('7. Testing user routes...');
  const userRoutes = await import('./src/routes/user.route.js');
  console.log('✅ User routes imported');

  console.log('8. Testing chat routes...');
  const chatRoutes = await import('./src/routes/chat.route.js');
  console.log('✅ Chat routes imported');

  console.log('9. Testing upload routes...');
  const uploadRoutes = await import('./src/routes/upload.route.js');
  console.log('✅ Upload routes imported');

  console.log('10. Testing db connection...');
  const db = await import('./src/lib/db.js');
  console.log('✅ DB module imported');

  console.log('\n🎉 All imports successful!');

} catch (error) {
  console.error('❌ Import failed:', error.message);
  console.error('Stack:', error.stack);
}
