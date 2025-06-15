// Test MongoDB connection
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

console.log('🗄️ Testing MongoDB connection...');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set' : 'Not set');

const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    
    // Set a timeout for the connection
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });
    
    console.log('✅ MongoDB Connected:', conn.connection.host);
    console.log('✅ Database name:', conn.connection.name);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('✅ Collections found:', collections.length);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    if (error.name === 'MongoServerSelectionError') {
      console.error('This usually means:');
      console.error('- MongoDB server is not running');
      console.error('- Network connectivity issues');
      console.error('- Incorrect connection string');
      console.error('- Firewall blocking the connection');
    }
  }
};

testConnection();
