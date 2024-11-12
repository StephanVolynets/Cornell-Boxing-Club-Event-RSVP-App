use('app');

// Dropping the existing events collection if it exists
db.events.drop();

// Inserting new event data into the events collection
db.createCollection('events');
db.events.insertMany([
  {
    name: 'Ithaca Farmers Market',
    description: 'A gathering of local farmers and artisans. Fresh produce, handmade crafts, and more.',
    date: '2023-07-15',
    location: 'Ithaca Farmers Market Pavilion',
    headCount: 0
  },
  {
    name: 'Cayuga Lake Wine Trail Tour',
    description: 'Explore local wineries around Cayuga Lake with guided tours and tastings.',
    date: '2023-08-10',
    location: 'Cayuga Lake',
    headCount: 0
  },
  {
    name: 'Sciencenter Family Day',
    description: 'A fun day of interactive science activities for children and families.',
    date: '2023-09-05',
    location: 'Sciencenter',
    headCount: 0
  },
  {
    name: 'Ithaca Festival Parade',
    description: 'Annual parade celebrating the community with music, art, and dance.',
    date: '2023-06-02',
    location: 'Downtown Ithaca',
    headCount: 0
  },
  {
    name: 'Cornell University Open Lectures',
    description: 'Series of open lectures on various topics by professors and guest speakers.',
    date: '2023-10-12',
    location: 'Cornell University',
    headCount: 0
  },
  {
    name: 'Ithaca Jazz and Blues Jam',
    description: 'Evening of live jazz and blues performances by local musicians.',
    date: '2023-07-21',
    location: 'The Haunt',
    headCount: 0
  },
  {
    name: 'Buttermilk Falls Hiking Adventure',
    description: 'Guided hiking tour of the beautiful Buttermilk Falls State Park.',
    date: '2023-08-18',
    location: 'Buttermilk Falls State Park',
    headCount: 0
  },
  {
    name: 'Downtown Ithaca Food Tour',
    description: 'Culinary tour showcasing the best of Ithaca’s food scene.',
    date: '2023-09-10',
    location: 'Downtown Ithaca',
    headCount: 0
  }
]);

print('Database initialized with sample event data in Ithaca, New York.');
