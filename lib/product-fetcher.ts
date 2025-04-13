import { cache } from "react"
import clientPromise from './mongodb'
import { fetchProductPrices } from './price-fetcher'
import { ObjectId } from 'mongodb'

// Product interface to define the structure of our product data
export interface Product {
  id?: string
  _id?: string
  name: string
  description: string
  brand?: string
  category: string
  images?: string[]
  specifications?: Record<string, string>
  currentPrice?: number
  originalPrice?: number
  stores?: Array<{
    name: string
    type: string
    price: number
    inStock: boolean
    location?: string
    lastUpdated?: Date
  }>
  reviews?: {
    rating: number
    count: number
  }
}

// Function to ensure a MongoDB document has the required Product interface fields
function ensureProductFields(mongoDoc: any): Product {
  // Create a default object with required fields if they're missing
  return {
    id: mongoDoc.id?.toString() || mongoDoc._id?.toString() || '',
    _id: mongoDoc._id?.toString() || '',
    name: mongoDoc.name || 'Unknown Product',
    description: mongoDoc.description || 'No description available',
    category: mongoDoc.category || 'Uncategorized',
    currentPrice: mongoDoc.currentPrice || 0,
    stores: mongoDoc.stores || [],
    ...mongoDoc // Include all other fields from the original document
  };
}

// Cache the product data to avoid excessive API calls
export const getProduct = cache(async (productId: string): Promise<Product | null> => {
  try {
    // First attempt to get the product from MongoDB
    const client = await clientPromise;
    const db = client.db();
    
    // Try to find product by ID or ObjectId
    let product = null;
    
    // Try to match by string ID first
    product = await db.collection('products').findOne({ id: productId });
    
    // If not found, try to find by MongoDB ObjectId
    if (!product) {
      try {
        product = await db.collection('products').findOne({ _id: new ObjectId(productId) });
      } catch (err) {
        // Invalid ObjectId format, that's ok
      }
    }
    
    if (!product) {
      console.error(`Product with ID ${productId} not found`);
      
      // Fallback to mock data for development
      if (process.env.NODE_ENV === 'development') {
        // Find in mock data
        const mockProduct = mockProducts.find((p) => p.id === productId);
        if (mockProduct) return mockProduct;
      }
      
      return null;
    }
    
    // Now get the price information from our separate collections
    const priceInfo = await fetchProductPrices(product._id.toString());
    
    // Return a combined object with both product and price info
    return ensureProductFields({
      ...product,
      ...priceInfo
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    
    // Fallback to mock data for development
    if (process.env.NODE_ENV === 'development') {
      await new Promise((resolve) => setTimeout(resolve, 800));
      const product = mockProducts.find((p) => p.id === productId);
      return product || null;
    }
    
    return null;
  }
});

// Function to search for products
export async function searchProducts(
  query: string,
  filters?: {
    brand?: string
    minPrice?: number
    maxPrice?: number
    category?: string
  },
): Promise<Product[]> {
  try {
    // Try to search in MongoDB first
    const client = await clientPromise;
    const db = client.db();
    
    const queryObj: Record<string, any> = {};
    
    // Add basic search criteria
    if (query) {
      queryObj.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ];
      
      if (filters?.brand) {
        queryObj.brand = { $regex: filters.brand, $options: 'i' };
      }
      
      if (filters?.category) {
        queryObj.category = { $regex: filters.category, $options: 'i' };
      }
    }
    
    // Execute the query with error handling
    let products: any[] = [];
    try {
      products = await db.collection('products').find(queryObj).limit(20).toArray();
      console.log(`Found ${products.length} products matching query: "${query}"`);
    } catch (dbErr) {
      console.error('Error executing search query:', dbErr);
      throw new Error('Database query failed');
    }
    
    // Get price information for each product with improved error handling
    const productsWithPrices = await Promise.all(
      products.map(async (product: any) => {
        try {
          if (product && product._id) {
            const priceInfo = await fetchProductPrices(product._id.toString());
            return ensureProductFields({
              ...product,
              ...priceInfo
            });
          } else {
            console.error('Found a product with invalid ID:', product);
            return ensureProductFields(product);
          }
        } catch (priceErr) {
          console.error(`Error fetching prices for product ${product._id}:`, priceErr);
          // Return the product without price information
          return ensureProductFields(product);
        }
      })
    );
    
    // Apply price filters if necessary
    let results = productsWithPrices;
    
    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      results = results.filter(product => {
        const price = product.currentPrice || 0;
        
        if (filters.minPrice !== undefined && price < filters.minPrice) {
          return false;
        }
        
        if (filters.maxPrice !== undefined && price > filters.maxPrice) {
          return false;
        }
        
        return true;
      });
    }
    
    return results;
  } catch (error) {
    console.error("Error searching products:", error);
    
    // Fallback to mock data for development
    if (process.env.NODE_ENV === 'development') {
      await new Promise((resolve) => setTimeout(resolve, 600));
      
      // Filter products based on query and filters
      return mockProducts.filter((product) => {
        // Basic search by name
        const matchesQuery =
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          (product.brand && product.brand.toLowerCase().includes(query.toLowerCase()));

        if (!matchesQuery) return false;

        // Apply additional filters if provided
        if (filters) {
          if (filters.brand && product.brand && product.brand.toLowerCase() !== filters.brand.toLowerCase()) {
            return false;
          }

          if (filters.category && product.category.toLowerCase() !== filters.category.toLowerCase()) {
            return false;
          }

          // Price filtering handled by the mock data
          const price = product.currentPrice || 0;
          
          if (filters.minPrice !== undefined && price < filters.minPrice) {
            return false;
          }

          if (filters.maxPrice !== undefined && price > filters.maxPrice) {
            return false;
          }
        }

        return true;
      });
    }
    
    throw error; // Rethrow to let calling code handle it
  }
}

// Function to get trending products
export async function getTrendingProducts(): Promise<Product[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // Get most recent products with price changes
    const products = await db.collection('products')
      .find({})
      .sort({ updatedAt: -1 })
      .limit(4)
      .toArray();
    
    // Add price data
    const productsWithPrices = await Promise.all(
      products.map(async (product: any) => {
        try {
          if (product && product._id) {
            const priceInfo = await fetchProductPrices(product._id.toString());
            return ensureProductFields({
              ...product,
              ...priceInfo
            });
          } else {
            return ensureProductFields(product);
          }
        } catch (err) {
          console.error(`Error fetching prices for trending product ${product._id}:`, err);
          return ensureProductFields(product);
        }
      })
    );
    
    return productsWithPrices;
  } catch (error) {
    console.error("Error getting trending products:", error);
    
    // Fallback to mock data
    if (process.env.NODE_ENV === 'development') {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockProducts.slice(0, 4);
    }
    
    return [];
  }
}

// Function to get recently tracked products
export async function getRecentlyTrackedProducts(): Promise<Product[]> {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    // In a real app, this would be based on user's tracking history
    // For now, return products with most price history records
    const pipeline = [
      {
        $lookup: {
          from: 'pricehistories',
          localField: '_id',
          foreignField: 'productId',
          as: 'priceHistories'
        }
      },
      {
        $addFields: {
          historyCount: { $size: '$priceHistories' }
        }
      },
      {
        $sort: { historyCount: -1 }
      },
      {
        $limit: 3
      },
      {
        $project: {
          priceHistories: 0,
          historyCount: 0
        }
      }
    ];
    
    const products = await db.collection('products').aggregate(pipeline).toArray();
    
    // Add price data
    const productsWithPrices = await Promise.all(
      products.map(async (product: any) => {
        try {
          if (product && product._id) {
            const priceInfo = await fetchProductPrices(product._id.toString());
            return ensureProductFields({
              ...product,
              ...priceInfo
            });
          } else {
            return ensureProductFields(product);
          }
        } catch (err) {
          console.error(`Error fetching prices for tracked product ${product._id}:`, err);
          return ensureProductFields(product);
        }
      })
    );
    
    return productsWithPrices;
  } catch (error) {
    console.error("Error getting recently tracked products:", error);
    
    // Fallback to mock data
    if (process.env.NODE_ENV === 'development') {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return [mockProducts[2], mockProducts[0], mockProducts[5]];
    }
    
    return [];
  }
}

// Mock product database - used as fallback during development
// These will be gradually phased out as the real database is populated
const mockProducts: Product[] = [
  {
    id: "iphone-15-pro-256gb",
    name: "Apple iPhone 15 Pro (256GB)",
    description:
      "The iPhone 15 Pro features a 6.1-inch Super Retina XDR display with ProMotion technology, A17 Pro chip, and a pro camera system with 48MP main camera. It comes with a titanium design, USB-C connector, and all-day battery life.",
    category: "Smartphones",
    currentPrice: 131900,
    originalPrice: 134000,
    stores: [
      {
        name: "Amazon",
        type: "Online",
        price: 131900,
        inStock: true,
        lastUpdated: new Date("2023-06-01T12:00:00Z"),
      },
      {
        name: "Flipkart",
        type: "Online",
        price: 129900,
        inStock: true,
        lastUpdated: new Date("2023-06-01T14:30:00Z"),
      },
      {
        name: "Reliance Digital",
        type: "Retail",
        price: 134000,
        inStock: true,
        location: "Daba Gardens",
        lastUpdated: new Date("2023-06-01T10:00:00Z"),
      },
    ],
    reviews: {
      rating: 4.8,
      count: 1243,
    },
  },
  {
    id: "samsung-galaxy-s23-ultra",
    name: "Samsung Galaxy S23 Ultra",
    description:
      "The Samsung Galaxy S23 Ultra features a 6.8-inch Dynamic AMOLED 2X display, Snapdragon 8 Gen 2 processor, and a 200MP main camera. It comes with an S Pen, 5000mAh battery, and runs on Android 13.",
    category: "Smartphones",
    currentPrice: 124999,
    originalPrice: 129999,
    stores: [
      {
        name: "Amazon",
        type: "Online",
        price: 124999,
        inStock: true,
        lastUpdated: new Date("2023-06-01T12:00:00Z"),
      },
      {
        name: "Flipkart",
        type: "Online",
        price: 119999,
        inStock: true,
        lastUpdated: new Date("2023-06-01T14:30:00Z"),
      },
    ],
    reviews: {
      rating: 4.7,
      count: 987,
    },
  },
]

