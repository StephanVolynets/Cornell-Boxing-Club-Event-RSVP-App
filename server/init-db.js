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
    return;
  }

  const client = new MongoClient(connectionString);
  try {
    await client.connect();
    console.log('Connected to MongoDB for initialization');

    const db = client.db(dbName);
    const eventsCollection = db.collection('events');
    const count = await eventsCollection.countDocuments();

    if (count === 0) {
      const result = await eventsCollection.insertMany(sampleEvents);
      console.log(`Inserted ${result.insertedCount} sample events`);
    } else {
      console.log(`Events collection already has ${count} documents, skipping sample data`);
    }
  } catch (err) {
    console.error('Error during database initialization:', err);
  } finally {
    await client.close();
  }
}

// Run initialization once on startup
initializeDatabase().catch(err => console.error(err));
