// Minimal test server
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

console.log('🚀 Starting test server...');
console.log('PORT:', process.env.PORT);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
}));

app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test server is working!' });
});

// Test Firebase signin route
app.post('/api/auth/firebase-signin', (req, res) => {
  console.log('Firebase signin request received:', req.body);
  res.status(500).json({ message: 'Test error - Firebase not configured yet' });
});

app.listen(PORT, () => {
  console.log(`✅ Test server is running on port ${PORT}`);
  console.log(`🌐 Test URL: http://localhost:${PORT}/api/test`);
});
