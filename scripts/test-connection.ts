import connectDB from '../lib/db';

async function testConnection() {
  try {
    await connectDB();
    console.log('Successfully connected to MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

testConnection(); 