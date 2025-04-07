import { config } from 'dotenv';
config();

import dbConnect from '../lib/mongoose';
import { Product } from '../models/Product';
import { Store } from '../models/Store';
import { PriceHistory } from '../models/PriceHistory';

// Import mock products data
import { mockProducts } from './migrate-mock-data';

async function migrateProducts() {
  let connection;
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable inside .env');
    }

    // Validate mock data
    if (!Array.isArray(mockProducts) || mockProducts.length === 0) {
      throw new Error('Mock products data is invalid or empty');
    }

    // Connect to MongoDB using Mongoose
    connection = await dbConnect();
    console.log('Connected to MongoDB successfully');

    // Clear existing collections
    await Promise.all([
      Product.deleteMany({}),
      Store.deleteMany({}),
      PriceHistory.deleteMany({})
    ]);
    console.log('Cleared existing collections');

    // Extract and insert unique stores
    const storeSet = new Set<string>();
    mockProducts.forEach(product => {
      product.prices.localStores?.forEach(store => {
        storeSet.add(JSON.stringify({ name: store.name, branch: store.branch }));
      });
    });

    const uniqueStores = Array.from(storeSet).map(store => JSON.parse(store));
    if (uniqueStores.length > 0) {
      await Store.insertMany(uniqueStores);
      console.log(`Inserted ${uniqueStores.length} stores`);
    }

    // Insert products with validation
    const validatedProducts = mockProducts.map(product => ({
      ...product,
      specifications: Object.fromEntries(
        Object.entries(product.specifications).map(([key, value]) => [key, String(value)])
      )
    }));

    const insertedProducts = await Product.insertMany(validatedProducts, { ordered: false });
    console.log(`Inserted ${insertedProducts.length} products`);

    // Create and insert price history records
    const priceHistoryRecords = mockProducts.flatMap(product => {
      const records = [];
      const now = new Date();

      if (product.prices.amazon) {
        records.push({
          productId: product.id,
          source: 'amazon',
          price: product.prices.amazon.price,
          timestamp: product.prices.amazon.lastUpdated || now
        });
      }

      if (product.prices.flipkart) {
        records.push({
          productId: product.id,
          source: 'flipkart',
          price: product.prices.flipkart.price,
          timestamp: product.prices.flipkart.lastUpdated || now
        });
      }

      product.prices.localStores?.forEach(store => {
        records.push({
          productId: product.id,
          source: 'local',
          storeName: store.name,
          storeBranch: store.branch,
          price: store.price,
          timestamp: store.lastUpdated || now
        });
      });

      return records;
    });

    if (priceHistoryRecords.length > 0) {
      await PriceHistory.insertMany(priceHistoryRecords);
      console.log(`Inserted ${priceHistoryRecords.length} price history records`);
    }

    console.log('Data migration completed successfully');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.disconnect();
      console.log('Database connection closed');
    }
    process.exit(0);
  }
}

// Run the migration
migrateProducts();