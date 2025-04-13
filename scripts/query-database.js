const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Atlas connection string
const MONGODB_URI = 'mongodb+srv://harshavardhan20041973:harshavardhan20041973@cluster0.xwwwfk8.mongodb.net/price_pulse?retryWrites=true&w=majority&appName=Cluster0';

// Helper function to format output nicely
const formatOutput = (data) => {
  if (Array.isArray(data)) {
    console.log(`Found ${data.length} documents:`);
    data.forEach((item, index) => {
      console.log(`\n[${index + 1}] ${JSON.stringify(item, null, 2)}`);
    });
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
};

// Function to query a collection
const queryCollection = async (collectionName, query = {}, limit = 10) => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);
    const results = await collection.find(query).limit(limit).toArray();
    console.log(`\n===== Results from ${collectionName} =====`);
    formatOutput(results);
    return results;
  } catch (error) {
    console.error(`Error querying ${collectionName}:`, error);
    return [];
  }
};

// Function to get database stats
const getDatabaseStats = async () => {
  try {
    const db = mongoose.connection.db;
    const stats = await db.stats();
    const collectionsInfo = await db.listCollections().toArray();
    
    console.log('\n===== Database Stats =====');
    console.log(`Database: ${db.databaseName}`);
    console.log(`Total Collections: ${stats.collections}`);
    console.log(`Total Documents: ${stats.objects}`);
    console.log(`Database Size: ${(stats.dataSize / (1024 * 1024)).toFixed(2)} MB`);
    
    console.log('\n===== Collections =====');
    for (const collection of collectionsInfo) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`${collection.name}: ${count} documents`);
    }
  } catch (error) {
    console.error('Error getting database stats:', error);
  }
};

// Parse command line arguments
const parseArgs = () => {
  const args = process.argv.slice(2);
  let collection = null;
  let query = {};
  let limit = 10;
  
  // Parse remaining args
  if (args.length > 0) {
    collection = args[0];
    
    if (args.length > 1) {
      try {
        query = JSON.parse(args[1]);
      } catch (e) {
        console.error('Invalid JSON query format. Using empty query object.');
      }
    }
    
    if (args.length > 2) {
      limit = parseInt(args[2]) || 10;
    }
  }
  
  return { collection, query, limit };
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas successfully!');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return false;
  }
};

// Main function to run queries
const runQueries = async () => {
  const isConnected = await connectDB();
  
  if (!isConnected) {
    console.log('Failed to connect to the database. Check your connection string and try again.');
    return;
  }
  
  const { collection, query, limit } = parseArgs();
  
  // Get the database name
  const dbName = mongoose.connection.db.databaseName;
  console.log(`\nConnected to database: ${dbName}`);
  
  // Get overall database stats
  await getDatabaseStats();
  
  if (collection) {
    // Run specific query
    await queryCollection(collection, query, limit);
  } else {
    console.log('\nNo specific collection provided. Try running with arguments:');
    console.log('Example: node scripts/query-database.js products {} 5');
    console.log('This will show 5 documents from the products collection');
    
    // Show some examples of data by default
    console.log('\nShowing some sample data from common collections...');
    
    // Try to query common collections
    const commonCollections = ['products', 'stores', 'pricehistories', 'users'];
    for (const collection of commonCollections) {
      await queryCollection(collection, {}, 3);
    }
  }
  
  // Close the connection when done
  mongoose.connection.close();
  console.log('\nDatabase connection closed');
};

// Run the script
runQueries().catch(console.error);