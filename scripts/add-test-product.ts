import 'dotenv/config';
import dbConnect from '../lib/db';
import Product from '../models/Product';

async function addTestProduct() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    const testProduct = {
      id: 'simple_test_product',
      name: 'Simple Test Product',
      description: 'A simple test product',
      brand: 'Test Brand',
      category: 'Electronics',
      images: ['https://example.com/test-image.jpg'],
      specifications: {
        color: 'Black',
        size: 'Medium'
      },
      prices: {
        amazon: {
          price: 999,
          link: 'https://amazon.com/test-product',
          inStock: true,
          lastUpdated: new Date()
        },
        flipkart: {
          price: 989,
          link: 'https://flipkart.com/test-product',
          inStock: true,
          lastUpdated: new Date()
        },
        localStores: []
      },
      reviews: {
        rating: 4.5,
        count: 100
      }
    };

    console.log('Attempting to create product...');
    const product = await Product.create(testProduct);
    console.log('Test product added successfully:', JSON.stringify(product, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error adding test product:', error);
    process.exit(1);
  }
}

addTestProduct(); 