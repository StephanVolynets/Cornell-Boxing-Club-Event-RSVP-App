import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Determine __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

const connectionString = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'cornell-boxing-events';

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
  if (!connectionString) {
    console.error('MONGODB_URI is not defined. Aborting initialization.');
    process.exit(1);
  }

  console.log('Using connection string:', connectionString.replace(/mongodb\+srv:\/\/[^:]+:[^@]+@/, 'mongodb+srv://[hidden]@'));
  console.log('Database name:', dbName);

  const client = new MongoClient(connectionString);
  try {
    await client.connect();
    console.log('Connected to MongoDB for initialization');

    const db = client.db(dbName);

    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Current collections:', collections.map(c => c.name));

    const eventsCollection = db.collection('events');

    // Drop existing collection to start fresh
    try {
      await eventsCollection.drop();
      console.log('Dropped existing events collection');
    } catch (e) {
      console.log('No existing events collection to drop');
    }

    // Insert sample events
    const result = await eventsCollection.insertMany(sampleEvents);
    console.log(`Successfully inserted ${result.insertedCount} sample events`);

    // Verify the insertion
    const insertedEvents = await eventsCollection.find({}).toArray();
    console.log('Inserted events:', insertedEvents.map(e => ({ name: e.name, _id: e._id })));

  } catch (err) {
    console.error('Error during database initialization:', err);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Database initialization complete');
  }
}

// Run initialization once on startup
initializeDatabase().catch(err => console.error(err));
