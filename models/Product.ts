import mongoose, { Schema, Document } from 'mongoose';

interface IProduct extends Document {
  id: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  images: string[];
  specifications: Record<string, string>;
  prices: {
    amazon?: {
      price: number;
      link: string;
      inStock: boolean;
      lastUpdated: Date;
    };
    flipkart?: {
      price: number;
      link: string;
      inStock: boolean;
      lastUpdated: Date;
    };
    localStores?: Array<{
      name: string;
      branch: string;
      price: number;
      inStock: boolean;
      lastUpdated: Date;
    }>;
  };
  reviews: {
    rating: number;
    count: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    images: [{ type: String }],
    specifications: { type: Map, of: String },
    prices: {
      amazon: {
        price: Number,
        link: String,
        inStock: Boolean,
        lastUpdated: Date,
      },
      flipkart: {
        price: Number,
        link: String,
        inStock: Boolean,
        lastUpdated: Date,
      },
      localStores: [
        {
          name: String,
          branch: String,
          price: Number,
          inStock: Boolean,
          lastUpdated: Date,
        },
      ],
    },
    reviews: {
      rating: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);