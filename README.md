# Stephans Project 2 INFO 2310 

*Since this projects environment was built in a private Cornell Repository I had to use a template. [Why my commits are missing]*

# Event RSVP App

A full-stack MERN (MongoDB, Express.js, React, Node.js) application for managing event RSVPs.

## Overview

This Event RSVP App allows users to create, view, and RSVP to events. It features a RESTful API backend built with Express.js and MongoDB, and a React frontend for a seamless user experience.

## Key Features

- Create and manage events
- RSVP and un-RSVP to events
- View all events with their details
- Real-time head count updates

## Technical Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Frontend**: React (with hooks for state management)
- **API Communication**: Axios for HTTP requests

## API Endpoints

The app includes several RESTful API endpoints for event management:

- `GET /api/events`: Fetch all events
- `POST /api/events/create`: Create a new event
- `DELETE /api/events/:id/delete`: Delete an event
- `POST /api/events/:id/headCount/rsvp`: RSVP to an event
- `POST /api/events/:id/headCount/unrsvp`: Un-RSVP from an event

## Data Model

Events are stored in MongoDB with the following schema:

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  date: Date,
  location: String,
  headCount: Integer
}
```

## Frontend Architecture

The React frontend is structured with components for displaying events and managing RSVPs. It uses React hooks (useState, useEffect) for state management and side effects.
![Xnip2024-08-26_20-38-03](https://github.com/user-attachments/assets/cd1f1018-596c-4a62-bb53-6be46cb98f47)

# Getting Started
## Client

```sh
cd client
```

**Install dependencies:**

```sh
npm install
```

**Start development server:**

```sh
npm start
```

## Server

```sh
cd server
```

**Install dependencies:**

```sh
npm install
```

**Initialize database:**

```sh
mongosh init.mongo.js
```

**Start development server:**

```sh
npm run dev
```


## Contributing

Prof. Kyle Harms for teaching me how to harness these technologies. 



