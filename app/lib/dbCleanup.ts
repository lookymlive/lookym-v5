import mongoose from 'mongoose';

// This file is only imported and used in Node.js environment
if (process.env.NODE_ENV === 'development') {
  process.on('SIGINT', async () => {
    try {
      await mongoose.connection.close();
      console.log('MongoDB connection closed due to app termination');
      process.exit(0);
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
      process.exit(1);
    }
  });
}
