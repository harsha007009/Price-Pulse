import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Connect to MongoDB
    await dbConnect();
    
    // Get products from MongoDB
    const dbProducts = await Product.find({}).lean();
    
    // Get products from JSON file
    const filePath = path.join(process.cwd(), 'data', 'products.json');
    const fileData = await fs.promises.readFile(filePath, 'utf8');
    const jsonProducts = JSON.parse(fileData).products;
    
    // Return both for comparison
    return NextResponse.json({
      dbProductsCount: dbProducts.length,
      jsonProductsCount: jsonProducts.length,
      dbProducts: dbProducts,
      firstDbProduct: dbProducts[0] || null,
      firstJsonProduct: jsonProducts[0] || null,
      message: "This endpoint is for testing database connectivity"
    });
  } catch (error) {
    console.error('Error in test-db:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
