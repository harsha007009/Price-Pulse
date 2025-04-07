import mongoose, { Schema, Document } from 'mongoose';

interface IPriceHistory extends Document {
  productId: string;
  source: 'amazon' | 'flipkart' | 'local';
  storeName?: string;
  storeBranch?: string;
  price: number;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PriceHistorySchema = new Schema<IPriceHistory>(
  {
    productId: { type: String, required: true, ref: 'Product' },
    source: { type: String, required: true, enum: ['amazon', 'flipkart', 'local'] },
    storeName: { type: String },
    storeBranch: { type: String },
    price: { type: Number, required: true },
    timestamp: { type: Date, required: true },
  },
  { timestamps: true }
);

// Create compound indexes for efficient querying
PriceHistorySchema.index({ productId: 1, timestamp: -1 });
PriceHistorySchema.index({ productId: 1, source: 1, timestamp: -1 });
PriceHistorySchema.index({ storeName: 1, storeBranch: 1, timestamp: -1 });

export const PriceHistory = mongoose.models.PriceHistory || mongoose.model<IPriceHistory>('PriceHistory', PriceHistorySchema);