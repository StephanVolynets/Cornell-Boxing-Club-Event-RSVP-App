import { MongoClient } from 'mongodb';

// Use environment variable or fallback to local connection
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB_NAME || 'app';

console.log('Connecting to MongoDB...');
console.log('Database name:', dbName);

const client = new MongoClient(connectionString);

let conn;
let db;

try {
  console.log('Attempting connection to:', connectionString);
  conn = await client.connect();
  console.log('Connected successfully to MongoDB');

  db = conn.db(dbName);
  console.log('Using database:', dbName);

  // Test the connection
  const collections = await db.listCollections().toArray();
  console.log('Available collections:', collections.map(c => c.name));
} catch (e) {
  console.error('MongoDB connection error:', e);
}

export default db;
