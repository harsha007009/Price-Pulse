const mongoose = require('mongoose');
require('dotenv').config();

// Use a direct connection string if the environment variable isn't available
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://harshavardhan20041973:harshavardhan20041973@cluster0.xwwwfk8.mongodb.net/price_pulse?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log('MongoDB successfully connected! 🚀');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;