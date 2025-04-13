// filepath: c:\price-pulse\scripts\test-signup.js
const mongoose = require('mongoose');
require('dotenv').config();

// Use the connection string from your existing configuration
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://harshavardhan20041973:harshavardhan20041973@cluster0.xwwwfk8.mongodb.net/price_pulse?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
async function connectToDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully for test!');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
}

// Define a User schema and model matching our TypeScript model
// This allows us to test without TypeScript compilation
const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  }
}, { timestamps: true });

// Add the password hashing middleware
const bcrypt = require('bcryptjs');
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Add the password comparison method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Test user signup function
async function testSignup() {
  try {
    // Use our local User model that matches the TypeScript definition
    const TestUser = mongoose.models.User || mongoose.model('User', UserSchema);
    
    // Generate a unique test username and email
    const timestamp = Date.now();
    const testUsername = `testuser_${timestamp}`;
    const testEmail = `test_${timestamp}@example.com`;
    const testPassword = 'password123';
    
    console.log(`Creating test user with username: ${testUsername}, email: ${testEmail}`);
    
    // Create a new user
    const newUser = new TestUser({
      username: testUsername,
      email: testEmail,
      password: testPassword
    });
    
    // Save the user to the database
    const savedUser = await newUser.save();
    
    console.log('Test user created successfully!');
    console.log('User details (without password):');
    console.log({
      id: savedUser._id,
      userId: savedUser.userId,
      username: savedUser.username,
      email: savedUser.email,
      // Note: the password should be hashed
      passwordIsHashed: savedUser.password !== testPassword
    });
    
    // Verify the password was hashed
    if (savedUser.password === testPassword) {
      console.error('WARNING: Password was not hashed!');
    } else {
      console.log('Password was correctly hashed.');
    }
    
    // Test password verification
    const isPasswordValid = await savedUser.comparePassword(testPassword);
    console.log(`Password verification: ${isPasswordValid ? 'SUCCESS' : 'FAILED'}`);
    
    return savedUser;
  } catch (error) {
    console.error('Test signup error:', error);
    throw error;
  }
}

// Run the test
async function runTest() {
  const isConnected = await connectToDB();
  
  if (!isConnected) {
    console.log('Failed to connect to the database. Test aborted.');
    process.exit(1);
  }
  
  try {
    const user = await testSignup();
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

runTest();