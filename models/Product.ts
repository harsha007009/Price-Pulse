import mongoose from 'mongoose';
import { Product } from '@/lib/types';

const priceSchema = new mongoose.Schema({
  price: { type: Number, required: true },
  link: { type: String, required: true },
  inStock: { type: Boolean, required: true },
  lastUpdated: { type: Date, required: true },
  seller: String
});

const localStoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  branch: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: Number, required: true },
  inStock: { type: Boolean, required: true },
  lastUpdated: { type: Date, required: true },
  distance: String
});

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  images: [{ type: String }],
  specifications: { type: Map, of: mongoose.Schema.Types.Mixed },
  prices: {
    amazon: priceSchema,
    flipkart: priceSchema,
    localStores: [localStoreSchema]
  },
  reviews: {
    rating: { type: Number, required: true },
    count: { type: Number, required: true }
  }
}, {
  timestamps: true
});

export default mongoose.models.Product || mongoose.model<Product>('Product', productSchema); 