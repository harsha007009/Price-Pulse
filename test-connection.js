require('dotenv').config();
const { MongoClient } = require('mongodb');
const { searchProducts } = require('./lib/product-fetcher');

// Print MongoDB URI status
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "Defined (value hidden for security)" : "Undefined");

// Test database connection and product fetching
async function testDbConnection() {
  try {
    // Test direct MongoDB connection
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log("✓ MongoDB connection successful");
    
    // Check if products collection exists and get count
    const db = client.db();
    const collections = await db.listCollections().toArray();
    const hasProductsCollection = collections.some(col => col.name === 'products');
    
    if (hasProductsCollection) {
      const productsCount = await db.collection('products').countDocuments();
      console.log(`✓ Products collection found with ${productsCount} documents`);
      
      // Try to fetch a sample product
      if (productsCount > 0) {
        const sampleProduct = await db.collection('products').findOne({});
        console.log("✓ Sample product found:", {
          id: sampleProduct._id,
          name: sampleProduct.name || 'No name',
          hasDescription: !!sampleProduct.description,
          hasCategory: !!sampleProduct.category
        });
      }
    } else {
      console.log("⚠ Products collection not found in database");
    }
    
    // Test searchProducts function
    try {
      console.log("\nTesting searchProducts function...");
      const searchResults = await searchProducts("test");
      console.log(`✓ searchProducts function returned ${searchResults.length} results`);
      
      if (searchResults.length > 0) {
        // Check if results have required fields
        const allFieldsPresent = searchResults.every(product => 
          product.name && product.description && product.category);
        
        console.log(`${allFieldsPresent ? '✓' : '⚠'} Required fields present in results: ${allFieldsPresent}`);
        
        // Log first result
        console.log("First search result:", {
          id: searchResults[0].id || searchResults[0]._id,
          name: searchResults[0].name,
          category: searchResults[0].category,
          descriptionLength: searchResults[0].description?.length || 0
        });
      }
    } catch (searchError) {
      console.error("✗ Error testing searchProducts function:", searchError);
    }
    
    await client.close();
    console.log("\n✓ Tests completed, connection closed");
    
  } catch (error) {
    console.error("✗ Error connecting to MongoDB:", error);
  }
}

testDbConnection();