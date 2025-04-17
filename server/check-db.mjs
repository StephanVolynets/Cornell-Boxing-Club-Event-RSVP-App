import { MongoClient } from 'mongodb';

// Database connection info
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB_NAME || 'app';

async function checkDatabase() {
  console.log('Database checker script starting...');
  console.log(`Connecting to MongoDB at: ${connectionString}`);
  console.log(`Database name: ${dbName}`);

  let client;

  try {
    // Connect to MongoDB
    client = new MongoClient(connectionString);
    await client.connect();
    console.log('Connected successfully to MongoDB');

    // Get database and list collections
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));

    // Check events collection
    if (collections.some(c => c.name === 'events')) {
      console.log('\nChecking events collection:');
      const events = await db.collection('events').find({}).toArray();
      console.log(`Found ${events.length} events:`);

      events.forEach((event, index) => {
        console.log(`\nEvent ${index + 1}:`);
        console.log(`  ID: ${event._id}`);
        console.log(`  Name: ${event.name}`);
        console.log(`  Description: ${event.description?.substring(0, 30)}...`);
        console.log(`  Date: ${event.date}`);
        console.log(`  Location: ${event.location}`);
        console.log(`  Head Count: ${event.headCount}`);
        console.log(`  Participants: ${event.participants ? event.participants.length : 0}`);
      });
    } else {
      console.log('\nEvents collection not found.');
      console.log('Creating sample event...');

      // Create a sample event if none exist
      const result = await db.collection('events').insertOne({
        name: 'Sample Boxing Event',
        description: 'This is a sample event created by the database checker script.',
        date: new Date().toISOString().split('T')[0],
        location: 'Cornell Boxing Gym',
        headCount: 0,
        participants: []
      });

      console.log('Sample event created with ID:', result.insertedId);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('Database connection closed');
    }
  }
}

// Run the function
checkDatabase();
