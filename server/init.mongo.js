use('app');

// Drop the existing events collection if it exists!!
db.events.drop();

// Create a new events collection with Cornell Boxing Club events
db.createCollection('events');
db.events.insertMany([
  {
    name: "Boxing Basics Workshop",
    description: "Learn the fundamentals of boxing: stance, footwork, and jab training for beginners.",
    date: "2025-05-15",
    location: "Cornell Boxing Gym, Ithaca",
    headCount: 0
  },
  {
    name: "Advanced Sparring Session",
    description: "Take your skills further with structured sparring sessions and advanced techniques.",
    date: "2025-05-22",
    location: "Cornell Boxing Gym, Ithaca",
    headCount: 0
  },
  {
    name: "Fitness & Conditioning Bootcamp",
    description: "High intensity conditioning workout tailored for boxing performance.",
    date: "2025-06-05",
    location: "Cornell Sports Fitness Room",
    headCount: 0
  },
  {
    name: "Boxing Tactics Seminar",
    description: "Insightful seminar on strategy, mental toughness, and ring control.",
    date: "2025-06-12",
    location: "Cornell Barton Hall",
    headCount: 0
  },
  {
    name: "Championship Preview Night",
    description: "Meet local champions and preview the upcoming championship bouts.",
    date: "2025-06-20",
    location: "Cornell Boxing Arena",
    headCount: 0
  },
  {
    name: "Fight Strategy Masterclass",
    description: "Learn advanced fight strategies from veteran boxing trainers.",
    date: "2025-07-01",
    location: "Cornell Sports Center",
    headCount: 0
  },
  {
    name: "Youth Boxing Initiation",
    description: "An introductory session for young athletes interested in boxing. Ages 8-14 are welcome.",
    date: "2025-07-10",
    location: "Cornell Youth Gym, Ithaca",
    headCount: 0
  },
  {
    name: "Technique & Mentorship",
    description: "Join an open sparring session and receive mentorship from experienced boxers.",
    date: "2025-07-18",
    location: "Cornell Boxing Gym, Ithaca",
    headCount: 0
  }
]);

print('Database initialized with Cornell Boxing Club events.');
