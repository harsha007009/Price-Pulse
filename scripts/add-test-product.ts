// scripts/add-test-product.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product';

dotenv.config({ path: '.env.local' });

async function addTestProduct() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env.local');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const testProduct = {
      id: `test_${Date.now()}`,
      name: 'Test Product',
      description: 'This is a test product added via script',
      brand: 'Test Brand',
      category: 'Test Category',
      images: ['https://via.placeholder.com/150'],
      specifications: {
        weight: '150g',
        color: 'Black'
      },
      prices: {
        amazon: {
          price: 599,
          link: 'https://amazon.com/test',
          inStock: true,
          lastUpdated: new Date()
        },
        flipkart: {
          price: 579,
          link: 'https://flipkart.com/test',
          inStock: true,
          lastUpdated: new Date()
        },
        localStores: []
      },
      reviews: {
        rating: 4.2,
        count: 5
      }
    };

    const product = await Product.create(testProduct);
    console.log('Product added successfully:', product);
  } catch (error) {
    console.error('Error adding test product:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

addTestProduct();
