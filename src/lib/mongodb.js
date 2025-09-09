import { MongoClient } from 'mongodb';
import { getMongoUri } from './mongodb-uri';
const config = require('../config/config');

// Ensure this only runs on the server side
if (typeof window !== 'undefined') {
  throw new Error('MongoDB client cannot be used in the browser');
}

// Lazy load URI to avoid build-time execution
let uri = null;
function getUri() {
  if (uri === null) {
    uri = getMongoUri();
    if (!uri) {
      throw new Error('Please configure MongoDB connection. Either set MONGODB_URI or provide DB_CONNECTION, DB_HOST, DB_DATABASE, DB_USERNAME, and DB_PASSWORD in your environment variables.');
    }
  }
  return uri;
}

const options = {};

let clientPromise = null;

function getClientPromise() {
  if (!clientPromise) {
    if (config.SERVER.NODE_ENV === 'development') {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      if (!global._mongoClientPromise) {
        const client = new MongoClient(getUri(), options);
        global._mongoClientPromise = client.connect();
      }
      clientPromise = global._mongoClientPromise;
    } else {
      // In production mode, it's best to not use a global variable.
      const client = new MongoClient(getUri(), options);
      clientPromise = client.connect();
    }
  }
  return clientPromise;
}

export default getClientPromise;

export async function getDb() {
  const client = await getClientPromise();
  return client.db();
}
