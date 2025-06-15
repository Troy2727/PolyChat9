// Simple debug server to test basic functionality
console.log('Starting debug server...');

try {
  console.log('Testing basic imports...');
  
  // Test basic Node.js
  console.log('Node.js version:', process.version);
  console.log('Current directory:', process.cwd());
  
  // Test environment variables
  console.log('Loading environment variables...');
  import('dotenv').then(dotenv => {
    dotenv.config();
    console.log('PORT from env:', process.env.PORT);
    console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
    
    // Test Express import
    console.log('Testing Express import...');
    import('express').then(express => {
      console.log('Express imported successfully');
      
      const app = express.default();
      const PORT = process.env.PORT || 5002;
      
      app.get('/test', (req, res) => {
        res.json({ message: 'Debug server working!' });
      });
      
      app.listen(PORT, () => {
        console.log(`Debug server running on port ${PORT}`);
      });
      
    }).catch(err => {
      console.error('Express import failed:', err);
    });
    
  }).catch(err => {
    console.error('Dotenv import failed:', err);
  });
  
} catch (error) {
  console.error('Debug server error:', error);
}
