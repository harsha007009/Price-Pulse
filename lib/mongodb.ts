// lib/mongodb.ts
import mongoose, { ConnectOptions } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Add TypeScript declaration for global.mongoose
declare global {
  var mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB');
        return mongoose;
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Ensure the error is rethrown
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset promise on failure
    throw e; // Rethrow the error
  }

  return cached.conn;
}

export default dbConnect;

export async function checkDbConnection() {
  try {
    const connection = await dbConnect();
    if (connection.connection.readyState === 1) {
      console.log('Database is connected');
      return true;
    } else {
      console.log('Database is not connected');
      return false;
    }
  } catch (error) {
    console.error('Error checking database connection:', error);
    return false;
  }
}
