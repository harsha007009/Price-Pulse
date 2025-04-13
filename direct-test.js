// direct-test.js
const mongoose = require('mongoose');

async function testConnection() {
  try {
    const uri = "mongodb+srv://harshavardhan20041973:harshavardhan20041973@cluster0.xwwwfk8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    await mongoose.connect(uri);
    console.log('MongoDB successfully connected! 🚀');
    return true;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return false;
  } finally {
    // Close the connection
    await mongoose.disconnect();
  }
}

testConnection();