const connectDB = require('../db/connection');
const User = require('../models/User');

async function checkUsers() {
  try {
    await connectDB();
    const users = await User.find({});
    console.log('Users in database:', users);
    console.log('Total users:', users.length);
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    process.exit();
  }
}

checkUsers();