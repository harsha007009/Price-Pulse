require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://harshavardhan20041973:harshavardhan20041973@cluster0.xwwwfk8.mongodb.net/price_pulse?retryWrites=true&w=majority&appName=Cluster0";

async function checkUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB (price_pulse database)');
    
    // Create a basic user schema to query the database
    const userSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.models.User || mongoose.model('User', userSchema);
    
    const users = await User.find({});
    console.log('Users in database:');
    users.forEach(user => {
      console.log({
        _id: user._id.toString(),
        userId: user.userId,
        username: user.username,
        email: user.email,
        hasPassword: !!user.password,
        fields: Object.keys(user._doc).filter(key => !key.startsWith('_'))
      });
    });
    console.log('Total users:', users.length);
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
}

checkUsers();