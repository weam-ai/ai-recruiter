import { MongoClient } from 'mongodb';
const config = require('../config/config');

// Ensure this only runs on the server side
if (typeof window !== 'undefined') {
  throw new Error('MongoDB client cannot be used in the browser');
}

if (!config.DATABASE.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = config.DATABASE.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (config.SERVER.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb() {
  const client = await clientPromise;
  return client.db();
}
