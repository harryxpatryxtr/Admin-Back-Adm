const mongoose = require('mongoose');

const connectDB = async (uri) => {
  try {
    if (!uri) {
      throw new Error('MONGODB_URI must be configured');
    }
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.name, error.code || 'UNKNOWN');
    throw error;
  }
};

module.exports = { connectDB };
