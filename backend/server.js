const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const promoRoutes = require('./routes/promo');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/promo', promoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server ishlayapti' });
});

// Error handler
app.use(errorHandler);

// Start server AFTER database connection
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const connected = await connectDB();
  
  if (!connected) {
    console.log('MongoDB ga ulanib bo\'lmadi. 5 sekunddan keyin qayta urinish...');
    setTimeout(startServer, 5000);
    return;
  }

  app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishlayapti`);
    console.log(`MongoDB ulangan, server tayyor!`);
  });
};

startServer();

module.exports = app;
