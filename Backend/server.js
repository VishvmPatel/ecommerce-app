const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const socketService = require('./services/socketService');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    console.log('📍 Connection string:', process.env.MONGODB_URI ? 'Found' : 'Not found');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('🔍 Error details:', error);
    console.log('🔄 Retrying connection...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`✅ MongoDB Connected on retry: ${conn.connection.host}`);
      return true;
    } catch (retryError) {
      console.error('❌ MongoDB Connection Failed on retry:', retryError.message);
      console.log('💡 Possible solutions:');
      console.log('   1. Check MongoDB Atlas IP whitelist');
      console.log('   2. Verify cluster URL is correct');
      console.log('   3. Check internet connection');
      console.log('   4. Try different network (mobile hotspot)');
      process.exit(1);
    }
  }
};

io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  socket.on('join-admin', () => {
    socket.join('admin-room');
    console.log('👑 Admin joined admin room');
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

app.set('io', io);

socketService.setIO(io);

connectDB().then(() => {
  console.log('📊 MongoDB storage enabled');
}).catch((error) => {
  console.error('❌ Failed to connect to MongoDB:', error);
  process.exit(1);
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/addresses', require('./routes/addresses'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/reviews', require('./routes/reviews')); app.use('/api/admin', require('./routes/admin')); 
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Fashion Store API is running!',
    timestamp: new Date().toISOString()
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🔌 Socket.IO enabled for real-time updates`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});