import { cache } from "react"
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

// Product interface to define the structure of our product data
export interface Product {
  id: string
  name: string
  description: string
  brand: string
  category: string
  images: string[]
  specifications: Record<string, string>
  prices: {
    amazon?: {
      price: number
      link: string
      inStock: boolean
      lastUpdated: Date
    }
    flipkart?: {
      price: number
      link: string
      inStock: boolean
      lastUpdated: Date
    }
    localStores?: Array<{
      name: string
      branch: string
      address: string
      price: number
      inStock: boolean
      lastUpdated: Date
    }>
  }
  reviews: {
    rating: number
    count: number
  }
}

// Cache the product data to avoid excessive API calls
export const getProduct = cache(async (productId: string): Promise<Product | null> => {
  try {
    await dbConnect();
    const product = await Product.findOne({ id: productId }).lean();
    return product;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
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
    await dbConnect();
    
    // Build the search query
    const searchQuery: any = {};
    
    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ];
    }
    
    if (filters?.brand) {
      searchQuery.brand = { $regex: filters.brand, $options: 'i' };
    }
    
    if (filters?.category) {
      searchQuery.category = { $regex: filters.category, $options: 'i' };
    }
    
    // Price filters - simplified to avoid complex query issues
    const priceConditions = [];
    
    if (filters?.minPrice !== undefined) {
      if (priceConditions.length === 0) {
        searchQuery['$or'] = searchQuery['$or'] || [];
      }
      searchQuery['$or'].push({ 'prices.amazon.price': { $gte: filters.minPrice } });
      searchQuery['$or'].push({ 'prices.flipkart.price': { $gte: filters.minPrice } });
    }
    
    if (filters?.maxPrice !== undefined) {
      if (priceConditions.length === 0 && !searchQuery['$or']) {
        searchQuery['$or'] = [];
      }
      searchQuery['$or'].push({ 'prices.amazon.price': { $lte: filters.maxPrice } });
      searchQuery['$or'].push({ 'prices.flipkart.price': { $lte: filters.maxPrice } });
    }
    
    console.log('Search query:', JSON.stringify(searchQuery));
    const products = await Product.find(searchQuery).lean();
    console.log(`Found ${products.length} products for query: "${query}"`);
    return products;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
}

// Function to get trending products
export async function getTrendingProducts(): Promise<Product[]> {
  try {
    await dbConnect();
    // In a real app, you might sort by popularity or recent views
    const products = await Product.find({}).limit(5).lean();
    return products;
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return [];
  }
}

// Function to get recently tracked products
export async function getRecentlyTrackedProducts(): Promise<Product[]> {
  try {
    await dbConnect();
    // In a real app, you might track user's recently viewed products
    const products = await Product.find({}).sort({ _id: -1 }).limit(5).lean();
    return products;
  } catch (error) {
    console.error('Error fetching recently tracked products:', error);
    return [];
  }
}
