import clientPromise from './mongodb';

/**
 * Fetches product price information from the price histories collection
 * @param {string} productId - The ID of the product
 * @param {Object} options - Optional parameters
 * @param {boolean} options.includeAllRecords - Whether to include all price history records or just the latest
 * @param {number} options.limit - Number of records to return per store
 * @returns {Promise<Object>} - Prices from different stores
 */
export async function fetchProductPrices(productId, options = {}) {
  const { includeAllRecords = false, limit = 1 } = options;
  
  try {
    // Check if productId is valid to prevent errors
    if (!productId) {
      console.error('Invalid product ID provided to fetchProductPrices');
      return { stores: [] };
    }

    const client = await clientPromise;
    const db = client.db();
    
    // Get the latest price for each store
    const aggregationPipeline = [
      { $match: { productId: productId.toString() } },
      { $sort: { timestamp: -1 } }
    ];
    
    if (!includeAllRecords) {
      // Group by store and get only the latest price for each
      aggregationPipeline.push(
        { 
          $group: {
            _id: "$storeName",
            price: { $first: "$price" },
            storeName: { $first: "$storeName" },
            storeBranch: { $first: "$storeBranch" },
            source: { $first: "$source" },
            timestamp: { $first: "$timestamp" },
            inStock: { $first: "$inStock" },
            storeType: { 
              $first: { 
                $cond: [
                  { $in: ["$source", ["amazon", "flipkart"]] },
                  "online",
                  "local"
                ]
              }
            }
          }
        }
      );
    }
    
    // Execute the aggregation
    const priceRecords = await db
      .collection('pricehistories')
      .aggregate(aggregationPipeline)
      .toArray();
    
    // Format the results in a structure similar to the original embedded stores
    const result = {
      stores: []
    };
    
    // Process each price record
    for (const record of priceRecords) {
      // Add to the stores array
      result.stores.push({
        name: record.storeName,
        type: record.storeType || (record.source === 'local' ? 'local' : 'online'),
        price: record.price,
        inStock: record.inStock !== undefined ? record.inStock : true,
        location: record.storeBranch && record.source === 'local' ? record.storeBranch : undefined,
        lastUpdated: record.timestamp
      });
    }
    
    // Find the lowest price
    if (result.stores.length > 0) {
      result.currentPrice = Math.min(...result.stores.map(store => store.price));
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching product prices:', error);
    return { stores: [] };
  }
}

/**
 * Fetches prices for products in a specific category
 * @param {string} category - Product category
 * @param {number} limit - Maximum number of products to return
 * @returns {Promise<Array>} - Products with price information
 */
export async function fetchCategoryPrices(category, limit = 10) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Get products in the specified category
    const products = await db
      .collection('products')
      .find({ category })
      .limit(limit)
      .toArray();
    
    // Get price info for each product
    const productsWithPrices = await Promise.all(
      products.map(async (product) => {
        try {
          const priceInfo = await fetchProductPrices(product._id.toString());
          return {
            ...product,
            ...priceInfo
          };
        } catch (err) {
          console.error(`Error fetching prices for product ${product._id}:`, err);
          return product; // Return product without price info if there's an error
        }
      })
    );
    
    return productsWithPrices;
  } catch (error) {
    console.error('Error fetching category prices:', error);
    return [];
  }
}

/**
 * Adds a new price record for a product
 * @param {string} productId - Product ID
 * @param {string} storeName - Store name
 * @param {number} price - Product price
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - The created price record
 */
export async function addPriceRecord(productId, storeName, price, options = {}) {
  const { 
    inStock = true, 
    storeBranch = 'Online',
    source = storeName.toLowerCase() 
  } = options;
  
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Get store information
    const store = await db.collection('stores').findOne({ name: storeName });
    
    if (!store) {
      throw new Error(`Store not found: ${storeName}`);
    }
    
    // Create new price record
    const priceRecord = {
      productId: productId.toString(),
      source: store.type === 'local' ? 'local' : source,
      storeName,
      storeBranch: store.branch || storeBranch,
      price,
      inStock,
      timestamp: new Date()
    };
    
    // Insert the record
    const result = await db.collection('pricehistories').insertOne(priceRecord);
    
    return { 
      success: true, 
      priceRecord: { 
        ...priceRecord, 
        _id: result.insertedId 
      } 
    };
  } catch (error) {
    console.error('Error adding price record:', error);
    return { success: false, error: error.message };
  }
}