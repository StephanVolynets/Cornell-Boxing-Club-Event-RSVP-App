import { MongoClient } from 'mongodb';

// Use environment variable or fallback to local connection
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017';

// Extract db name from connection string or use default
let dbName;
if (connectionString.includes('mongodb+srv://')) {
  // For Atlas connection strings
  try {
    // Try to extract the database name from the connection string
    const urlParts = connectionString.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    dbName = lastPart.split('?')[0];
    // If empty, use fallback
    if (!dbName) dbName = process.env.MONGODB_DB_NAME || 'cornell-boxing-events';
  } catch (e) {
    dbName = process.env.MONGODB_DB_NAME || 'cornell-boxing-events';
  }
} else {
  // For regular connection strings
  dbName = process.env.MONGODB_DB_NAME || 'cornell-boxing-events';
}

console.log('Connecting to MongoDB...');
console.log('Database name:', dbName);

// Create a new MongoClient
const client = new MongoClient(connectionString, {
  maxPoolSize: 10
});

let conn;
let db;

try {
  // Log connection attempt but hide sensitive info
  console.log('Attempting connection to MongoDB...');

  // Connect to the MongoDB server
  conn = await client.connect();
  console.log('Connected successfully to MongoDB server');

  // Get database handle
  db = conn.db(dbName);
  console.log('Using database:', dbName);

  // Test the connection by listing collections
  const collections = await db.listCollections().toArray();
  console.log('Available collections:', collections.map(c => c.name));

  if (collections.length === 0) {
    console.log('No collections found. The database might be empty.');
    // You could initialize with sample data here if needed
  }
} catch (e) {
  console.error('MongoDB connection error:', e);
}

export default db;
