const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  console.log('MongoDB ga ulanilmoqda...');
  console.log('URI:', uri ? uri.replace(/\/\/.*@/, '//***:***@') : 'TOPILMADI!');
  
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 15000,
    });
    console.log(`✅ MongoDB ulandi: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error('❌ MongoDB ulanish xatosi:');
    console.error('   Xato turi:', error.name);
    console.error('   Xabar:', error.message);
    if (error.reason) {
      console.error('   Sabab:', JSON.stringify(error.reason, null, 2));
    }
    return false;
  }
};

module.exports = connectDB;
