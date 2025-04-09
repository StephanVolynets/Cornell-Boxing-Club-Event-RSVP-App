import { MongoClient } from 'mongodb';

// Use environment variable or fallback to local connection
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017';

const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
} catch (e) {
  console.error(e);
}

let db = conn.db(process.env.MONGODB_DB_NAME || 'app');

export default db;
