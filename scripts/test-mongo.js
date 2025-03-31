const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB!");
    
    const db = client.db('price-pulse');
    const collection = db.collection('products');
    
    // Test inserting a simple document
    await collection.insertOne({ test: 'connection test' });
    console.log("Successfully inserted test document!");
    
    // Clean up test document
    await collection.deleteOne({ test: 'connection test' });
    console.log("Successfully cleaned up test document!");
    
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  } finally {
    await client.close();
  }
}

run(); 