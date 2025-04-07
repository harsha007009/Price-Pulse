import mongoose, { Schema, Document } from 'mongoose';

interface IStore extends Document {
  name: string;
  branch: string;
  location?: {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const StoreSchema = new Schema<IStore>(
  {
    name: { type: String, required: true },
    branch: { type: String, required: true },
    location: {
      address: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
  },
  { timestamps: true }
);

// Create a compound unique index on name and branch
StoreSchema.index({ name: 1, branch: 1 }, { unique: true });

export const Store = mongoose.models.Store || mongoose.model<IStore>('Store', StoreSchema);