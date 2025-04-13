import { MongoClient, Db } from 'mongodb';

// Use a direct connection string as a fallback if environment variable isn't available
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://harshavardhan20041973:harshavardhan20041973@cluster0.xwwwfk8.mongodb.net/price_pulse?retryWrites=true&w=majority&appName=Cluster0";

// Make sure we have a MongoDB URI before proceeding
if (!MONGODB_URI) {
  console.error('MongoDB URI is missing in both environment variables and fallback');
  throw new Error('MongoDB connection configuration is missing');
}

console.log('MongoDB URI configured:', !!MONGODB_URI); // Log if URI exists without exposing it

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options);
    globalWithMongo._mongoClientPromise = client.connect().catch(err => {
      console.error('Failed to connect to MongoDB:', err);
      throw err;
    });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect().catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  });
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db();
}

export async function connectToDb(): Promise<void> {
  try {
    const client = await clientPromise;
    console.log('Successfully connected to MongoDB.');
    return;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}