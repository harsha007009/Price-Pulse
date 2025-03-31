import connectDB from '../lib/db';
import Product from '../models/Product';
import fs from 'fs';
import path from 'path';

async function importProducts() {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB');

    // Read the JSON file
    const jsonData = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'data/products.json'), 'utf-8')
    );

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const result = await Product.insertMany(jsonData.products);
    console.log(`Successfully imported ${result.length} products`);

    process.exit(0);
  } catch (error) {
    console.error('Error importing products:', error);
    process.exit(1);
  }
}

importProducts(); 