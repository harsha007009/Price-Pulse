const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function importProducts() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('price-pulse');
    const collection = db.collection('products');

    // Read the JSON file
    const jsonData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data/products.json'), 'utf-8')
    );

    // Clear existing products
    await collection.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const result = await collection.insertMany(jsonData.products);
    console.log(`Successfully imported ${result.insertedCount} products`);

  } catch (error) {
    console.error('Error importing products:', error);
  } finally {
    await client.close();
  }
}

importProducts(); 