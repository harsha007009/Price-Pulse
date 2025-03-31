const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function verifyProducts() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('price-pulse');
    const collection = db.collection('products');

    // Get all products
    const products = await collection.find({}).toArray();
    
    console.log('\nFound', products.length, 'products:');
    products.forEach(product => {
      console.log('\n-------------------');
      console.log('Name:', product.name);
      console.log('Brand:', product.brand);
      console.log('Category:', product.category);
      console.log('Amazon Price:', product.prices.amazon?.price);
      console.log('Flipkart Price:', product.prices.flipkart?.price);
      console.log('Local Stores:', product.prices.localStores?.length || 0);
    });

  } catch (error) {
    console.error('Error verifying products:', error);
  } finally {
    await client.close();
  }
}

verifyProducts(); 