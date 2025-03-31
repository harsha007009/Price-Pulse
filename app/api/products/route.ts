import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).lean();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const data = await request.json();
    
    // Generate a unique ID if not provided
    if (!data.id) {
      data.id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }
    
    // Add timestamps for prices
    if (data.prices) {
      Object.keys(data.prices).forEach(platform => {
        if (typeof data.prices[platform] === 'object' && !Array.isArray(data.prices[platform])) {
          data.prices[platform].lastUpdated = new Date();
        }
      });
    }
    
    const product = await Product.create(data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
