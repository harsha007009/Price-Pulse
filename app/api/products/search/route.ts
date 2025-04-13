import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

// Define mock product interface to fix type errors
interface MockProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  currentPrice: number;
  brand?: string; // Make brand optional since not all products have it
  stores: {
    name: string;
    type: string;
    price: number;
    inStock: boolean;
  }[];
  reviews: {
    rating: number;
    count: number;
  };
}

// Define more mock products for better search results
const mockProducts: MockProduct[] = [
  {
    id: "mock-iphone",
    name: "Apple iPhone 15 Pro (Mock)",
    description: "A mock iPhone product for development testing",
    category: "Smartphones",
    currentPrice: 131900,
    stores: [
      { name: "Amazon", type: "Online", price: 131900, inStock: true }
    ],
    reviews: { rating: 4.8, count: 1243 }
  },
  {
    id: "mock-samsung",
    name: "Samsung Galaxy S23 Ultra (Mock)",
    description: "A mock Samsung product for development testing",
    category: "Smartphones",
    currentPrice: 124999,
    stores: [
      { name: "Flipkart", type: "Online", price: 124999, inStock: true }
    ],
    reviews: { rating: 4.7, count: 987 }
  },
  {
    id: "mock-pixel",
    name: "Google Pixel 8 Pro (Mock)",
    description: "A mock Google Pixel product for testing searches",
    category: "Smartphones",
    currentPrice: 99999,
    stores: [
      { name: "Amazon", type: "Online", price: 99999, inStock: true }
    ],
    reviews: { rating: 4.6, count: 756 }
  },
  {
    id: "mock-tv",
    name: "Sony Bravia 55 inch 4K TV (Mock)",
    description: "A mock TV product for development testing",
    category: "Televisions",
    currentPrice: 79990,
    stores: [
      { name: "Croma", type: "Online", price: 79990, inStock: true }
    ],
    reviews: { rating: 4.5, count: 432 }
  }
];

// Helper function to ensure all required fields are present
function ensureProductFields(product: any) {
  return {
    id: product.id?.toString() || product._id?.toString() || `mock-${Date.now()}`,
    name: product.name || 'Unknown Product',
    description: product.description || 'No description available',
    category: product.category || 'Uncategorized',
    currentPrice: product.currentPrice || 0,
    stores: product.stores || [],
    ...product
  };
}

export async function GET(request: NextRequest) {
  try {
    // Parse search parameters
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q") || ""
    console.log(`Search request received for query: "${query}"`);
    
    const brand = searchParams.get("brand") || undefined
    const category = searchParams.get("category") || undefined
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined
    
    // Check if we're in development mode to decide on fallback behavior
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Try to connect to the database and search for products
    try {
      // Set a timeout for the database query
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database connection timeout')), 5000)
      );
      
      // Try to connect with a timeout
      const clientPromiseWithTimeout = Promise.race([
        clientPromise,
        timeoutPromise
      ]) as Promise<any>;
      
      const client = await clientPromiseWithTimeout;
      const db = client.db();
      
      // Build the query object
      let queryObj: Record<string, any> = {};
      
      // Only return all products if we're intentionally doing a blank search
      if (!query && !brand && !category) {
        // Limit results to avoid returning the entire database
        const products = await db.collection('products').find({}).limit(10).toArray();
        const processedProducts = products.map((product: any) => ensureProductFields(product));
        return NextResponse.json(processedProducts);
      }
      
      // Build search query with more precise filtering
      if (query) {
        queryObj.$or = [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { brand: { $regex: query, $options: 'i' } }  // Also search in the brand field
        ];
      }
      
      if (brand) {
        queryObj.brand = { $regex: brand, $options: 'i' };
      }
      
      if (category) {
        queryObj.category = { $regex: category, $options: 'i' };
      }
      
      console.log("MongoDB search query:", JSON.stringify(queryObj));
      
      // Execute search query with a timeout
      const products = await db.collection('products').find(queryObj).limit(20).toArray();
      console.log(`Database search found ${products.length} products for query "${query}"`);
      
      // Ensure all products have the required fields
      const processedProducts = products.map((product: any) => ensureProductFields(product));
      
      // Apply price filters
      let results = processedProducts;
      if (minPrice !== undefined || maxPrice !== undefined) {
        results = results.filter((product: any) => {
          const price = product.currentPrice || 0;
          if (minPrice !== undefined && price < minPrice) return false;
          if (maxPrice !== undefined && price > maxPrice) return false;
          return true;
        });
      }
      
      // If no results found in development mode, return mock data
      if (results.length === 0 && isDevelopment) {
        console.log("No results found in database, returning mock data");
        return NextResponse.json(getFilteredMockProducts(query, brand, category, minPrice, maxPrice));
      }
      
      return NextResponse.json(results);
      
    } catch (dbError) {
      console.error("Database search error:", dbError);
      
      // Always return mock data in development mode
      if (isDevelopment) {
        console.log("Returning mock product data for development due to DB error");
        return NextResponse.json(getFilteredMockProducts(query, brand, category, minPrice, maxPrice));
      }
      
      // In production, return empty results instead of error
      return NextResponse.json([]);
    }
  } catch (error) {
    console.error("Search API error:", error);
    
    // Return mock data in development mode even for general errors
    if (process.env.NODE_ENV === 'development') {
      console.log("Returning mock data due to general error");
      const query = request.nextUrl.searchParams.get("q") || "";
      return NextResponse.json(getFilteredMockProducts(query));
    }
    
    // Return a user-friendly error
    return NextResponse.json(
      { error: "We couldn't complete your search right now. Please try again later." }, 
      { status: 500 }
    );
  }
}

// Helper function to filter mock products based on search criteria
function getFilteredMockProducts(
  query?: string, 
  brand?: string, 
  category?: string,
  minPrice?: number,
  maxPrice?: number
) {
  let filteredProducts = [...mockProducts];
  
  // Filter by search query
  if (query) {
    filteredProducts = filteredProducts.filter((p: MockProduct) => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(query.toLowerCase())) // Also search in brand
    );
  }
  
  // Filter by brand
  if (brand) {
    filteredProducts = filteredProducts.filter((p: MockProduct) => 
      p.name.toLowerCase().includes(brand.toLowerCase())
    );
  }
  
  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter((p: MockProduct) => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  // Apply price filters
  if (minPrice !== undefined || maxPrice !== undefined) {
    filteredProducts = filteredProducts.filter((product: MockProduct) => {
      const price = product.currentPrice || 0;
      if (minPrice !== undefined && price < minPrice) return false;
      if (maxPrice !== undefined && price > maxPrice) return false;
      return true;
    });
  }
  
  return filteredProducts;
}

