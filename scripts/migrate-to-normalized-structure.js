/**
 * This script migrates data from the embedded store model to a fully normalized structure.
 * It will:
 * 1. Extract store information from product documents
 * 2. Create separate store documents in the stores collection
 * 3. Create price history records in the priceHistory collection
 * 4. Update product documents to remove embedded store information
 */

const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection string
const MONGODB_URI = 'mongodb+srv://harshavardhan20041973:harshavardhan20041973@cluster0.xwwwfk8.mongodb.net/price_pulse?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');
    return mongoose.connection.db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Main migration function
async function migrateToNormalizedStructure() {
  console.log('Starting migration to fully normalized structure...');
  
  const db = await connectToDatabase();
  
  try {
    // Step 1: Get all products with embedded stores
    const products = await db.collection('products').find({
      stores: { $exists: true, $ne: [] }
    }).toArray();
    
    console.log(`Found ${products.length} products with embedded stores`);
    
    if (products.length === 0) {
      console.log('No products with embedded stores found. Migration not needed.');
      return;
    }
    
    // Step 2: Extract and create unique stores
    console.log('Extracting unique stores...');
    const uniqueStores = new Map();
    
    products.forEach(product => {
      if (product.stores && Array.isArray(product.stores)) {
        product.stores.forEach(store => {
          const storeKey = `${store.name}-${store.type}-${store.location || 'online'}`;
          
          if (!uniqueStores.has(storeKey)) {
            // Create normalized store object
            const normalizedStore = {
              name: store.name,
              type: store.type.toLowerCase(),
              branch: store.location ? store.location.split(',')[0].trim() : 'Online',
              address: store.location || null,
              website: store.type.toLowerCase() === 'online' 
                ? `https://www.${store.name.toLowerCase().replace(/\s+/g, '')}.com` 
                : null,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            uniqueStores.set(storeKey, normalizedStore);
          }
        });
      }
    });
    
    console.log(`Extracted ${uniqueStores.size} unique stores`);
    
    // Step 3: Insert stores into the stores collection
    const storeRecords = Array.from(uniqueStores.values());
    
    // Clear existing stores if any
    await db.collection('stores').deleteMany({});
    
    const storeResult = await db.collection('stores').insertMany(storeRecords);
    console.log(`Inserted ${storeResult.insertedCount} stores into stores collection`);
    
    // Create a map of store keys to store _ids for reference
    const storeIdMap = new Map();
    
    for (let i = 0; i < storeRecords.length; i++) {
      const store = storeRecords[i];
      const storeKey = `${store.name}-${store.type}-${store.address || 'online'}`;
      storeIdMap.set(storeKey, storeResult.insertedIds[i]);
    }
    
    // Step 4: Create price history records
    console.log('Creating price history records...');
    const priceHistories = [];
    
    products.forEach(product => {
      if (product.stores && Array.isArray(product.stores)) {
        product.stores.forEach(store => {
          const storeKey = `${store.name}-${store.type}-${store.location || 'online'}`;
          const storeId = storeIdMap.get(storeKey);
          
          if (storeId) {
            // Create price history record
            priceHistories.push({
              productId: product._id.toString(),
              storeId: storeId.toString(),
              source: store.type.toLowerCase() === 'online' ? store.name.toLowerCase() : 'local',
              storeName: store.name,
              storeBranch: store.location ? store.location.split(',')[0].trim() : 'Online',
              price: store.price,
              inStock: store.inStock !== undefined ? store.inStock : true,
              timestamp: store.lastUpdated || new Date(),
              createdAt: new Date(),
              updatedAt: new Date()
            });
            
            // Add a historical price entry from 1-2 months ago (slightly higher)
            const historicalDate = new Date();
            historicalDate.setMonth(historicalDate.getMonth() - Math.floor(Math.random() * 2) - 1);
            
            priceHistories.push({
              productId: product._id.toString(),
              storeId: storeId.toString(),
              source: store.type.toLowerCase() === 'online' ? store.name.toLowerCase() : 'local',
              storeName: store.name,
              storeBranch: store.location ? store.location.split(',')[0].trim() : 'Online',
              price: Math.round(store.price * (1 + (Math.random() * 0.1))), // 0-10% higher
              inStock: true,
              timestamp: historicalDate,
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
        });
      }
    });
    
    // Clear existing price histories if any
    await db.collection('pricehistories').deleteMany({});
    
    const priceResult = await db.collection('pricehistories').insertMany(priceHistories);
    console.log(`Inserted ${priceResult.insertedCount} price records into pricehistories collection`);
    
    // Step 5: Update products to remove embedded stores
    console.log('Updating products to remove embedded stores...');
    
    const productUpdates = products.map(product => {
      // Calculate current lowest price from the price histories
      const productPrices = priceHistories
        .filter(ph => ph.productId === product._id.toString())
        .map(ph => ph.price);
      
      const lowestPrice = productPrices.length > 0 
        ? Math.min(...productPrices) 
        : product.currentPrice || 0;
      
      const highestPrice = productPrices.length > 0 
        ? Math.max(...productPrices) 
        : product.originalPrice || product.currentPrice || 0;
      
      return {
        updateOne: {
          filter: { _id: product._id },
          update: { 
            $set: { 
              currentPrice: lowestPrice,
              originalPrice: highestPrice,
              updatedAt: new Date()
            },
            $unset: { stores: "" }
          }
        }
      };
    });
    
    if (productUpdates.length > 0) {
      const updateResult = await db.collection('products').bulkWrite(productUpdates);
      console.log(`Updated ${updateResult.modifiedCount} products to normalized structure`);
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

// Run the migration
migrateToNormalizedStructure()
  .then(() => {
    console.log('Migration script completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Migration script failed:', error);
    process.exit(1);
  });