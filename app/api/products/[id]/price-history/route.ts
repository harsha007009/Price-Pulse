import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const productId = params.id;
  const searchParams = request.nextUrl.searchParams;
  const period = searchParams.get('period') || '6m';

  // Validate the product ID
  if (!productId) {
    return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    // Find product first to validate it exists
    let product;
    
    // Try to find by string ID first
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
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '1m':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
      default:
        startDate.setMonth(now.getMonth() - 6); // Default to 6 months
    }

    // Query price history for this product
    const priceHistories = await db.collection('pricehistories')
      .find({
        productId: product._id.toString(),
        timestamp: { $gte: startDate }
      })
      .sort({ timestamp: 1 })
      .toArray();

    // Return the price history data
    return NextResponse.json(priceHistories);
  } catch (error) {
    console.error('Error fetching price history:', error);
    return NextResponse.json({ error: 'Failed to fetch price history' }, { status: 500 });
  }
}