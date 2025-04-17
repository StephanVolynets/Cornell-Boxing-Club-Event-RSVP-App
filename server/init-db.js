// Script to initialize the MongoDB database with sample events
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current file path and set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Get connection string from environment variable
const connectionString = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'cornell-boxing-events';

// Output environment info for debugging
console.log('Environment variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- MONGODB_DB_NAME:', dbName);
console.log('- MONGODB_URI:', connectionString ? 'Found (value hidden for security)' : 'Not found');

// Sample event data
const sampleEvents = [
  {
    name: 'Boxing Basics Workshop',
    description: 'Beginner friendly repetition training, lets build muscle memory!',
    date: new Date('2025-05-21'),
    location: 'Barton Hall',
    headCount: 0,
    participants: []
  },
  {
    name: 'Advanced Footwork Clinic',
    description: 'Learn advanced footwork techniques to improve your mobility and positioning in the ring.',
    date: new Date('2025-06-15'),
    location: 'Helen Newman Hall',
    headCount: 0,
    participants: []
  },
  {
    name: 'Boxing Tactics Seminar',
    description: 'Insightful seminar on strategy, mental toughness, and ring control.',
    date: new Date('2025-06-11'),
    location: 'Cornell Barton Hall',
    headCount: 0,
    participants: []
  },
  {
    name: 'Sparring Session',
    description: 'Controlled sparring practice for intermediate and advanced boxers. Proper equipment required.',
    date: new Date('2025-07-05'),
    location: 'Cornell Boxing Gym',
    headCount: 0,
    participants: []
  }
];

async function initializeDatabase() {
  console.log('Initializing database...');

  if (!connectionString) {
    console.error('MONGODB_URI is not defined in environment variables');
    console.error('Please make sure you have a .env file in the server directory with MONGODB_URI defined');
    process.exit(1);
  }

  const client = new MongoClient(connectionString);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Get database
    const db = client.db(dbName);
    console.log(`Using database: ${dbName}`);

    // Check if events collection exists and has documents
    const collections = await db.listCollections({ name: 'events' }).toArray();
    const eventsCollection = db.collection('events');
    const count = await eventsCollection.countDocuments();

    if (collections.length > 0 && count > 0) {
      console.log(`Events collection already exists with ${count} documents.`);
      console.log('Database is already initialized. Skipping sample data creation.');
    } else {
      console.log('Events collection is empty or does not exist. Creating sample data...');

      // Insert sample events
      const result = await eventsCollection.insertMany(sampleEvents);
      console.log(`${result.insertedCount} sample events inserted successfully.`);
    }

    // List all collections for verification
    const allCollections = await db.listCollections().toArray();
    console.log('All collections in database:', allCollections.map(c => c.name));

    console.log('Database initialization complete.');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed.');
  }
}

// Run the initialization function
initializeDatabase()
  .catch(console.error)
  .finally(() => {
    console.log('Initialization script completed.');
  });
