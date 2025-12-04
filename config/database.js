const mongoose = require('mongoose');
require('dotenv').config();

const getMongoURI = () => {
    if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }
  
    const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 27017;
  const database = process.env.DB_NAME || 'silianos_voyage';
  
  return `mongodb://${host}:${port}/${database}`;
};

const mongoURI = getMongoURI();

const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

mongoose.connect(mongoURI, options)
  .then(() => {
    console.log('✅ Connected to MongoDB database!');
    console.log(`📊 Database: ${process.env.DB_NAME || 'silianos_voyage'}`);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Check your .env file and MongoDB server status');
    console.error('Make sure MongoDB is running: mongod --version');
    process.exit(1);
  });

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = mongoose;
