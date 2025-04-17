// ! Built by Stephan (from SCRATCH)!

import "path";
import { ObjectId } from "mongodb";
import db from "./db/conn.mjs";
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 8080;
const app = express();

// Get current file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_for_dev";

// Fix CORS configuration
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:8080", process.env.FRONTEND_URL || "*"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());

// Authentication middleware
const authenticateAdmin = (req, res, next) => {
  try {
    console.log("Authenticating admin...");
    console.log("Cookies:", req.cookies);
    console.log("Headers:", req.headers);

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    console.log("Token:", token);

    if (!token) {
      console.log("No token found");
      return res.status(401).json({ message: "Authentication required" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("Decoded token:", decoded);
      req.admin = decoded;
      next();
    } catch (error) {
      console.log("Token verification error:", error.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } catch (error) {
    console.log("Authentication error:", error);
    return res.status(500).json({ message: "Server error during authentication" });
  }
};

// Admin authentication route
app.post("/api/admin/login", async (req, res) => {
  try {
    console.log("Login attempt:", req.body);
    const { username, password } = req.body;

    // For this implementation, we'll use hardcoded credentials
    // In a production app, you would store these securely in a database with hashed passwords
    if (username === "Coach" && password === "monkey") {
      // Create JWT token
      const token = jwt.sign(
        { username, role: "admin" },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Set token as HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: 'lax', // Changed from 'strict' to allow cross-site requests
        secure: process.env.NODE_ENV === 'production'
      });

      console.log("Login successful, token created");
      return res.status(200).json({
        message: "Login successful",
        user: { username, role: "admin" }
      });
    }

    console.log("Invalid credentials");
    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
});

// Admin logout route
app.post("/api/admin/logout", (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: "Logout successful" });
});

// Auth status check endpoint
app.get("/api/admin/check-auth", authenticateAdmin, (req, res) => {
  console.log("Auth check successful for user:", req.admin);
  return res.status(200).json({
    isAuthenticated: true,
    user: req.admin
  });
});

// Testing endpoint to verify API is working
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

// Debug endpoint to check events directly (no auth required)
app.get("/api/debug/events", async (req, res) => {
  try {
    console.log("Debug: Fetching events");
    const events = await db.collection("events").find({}).toArray();
    console.log(`Debug: Found ${events.length} events`);
    res.json({ count: events.length, events: events });
  } catch (err) {
    console.error("Debug: Error fetching events:", err);
    res.status(500).json({ error: err.message });
  }
});

// Debug endpoint for auth testing with cors
app.get("/api/debug/auth-test", (req, res) => {
  // Log headers for debugging
  console.log("Debug auth test - Headers:", req.headers);

  // Get cookie and auth header
  const cookies = req.cookies;
  const authHeader = req.headers.authorization;

  res.json({
    message: "Auth test endpoint",
    cookies: cookies || {},
    hasAuthHeader: !!authHeader,
    timestamp: new Date().toISOString()
  });
});

// RESTful API Setup:
// docs are really good: https://www.mongodb.com/docs/manual/crud/

// Fetching all events && details from the MongoDB database
// This route is used to display all events on the client side, initial load.
app.get("/api/events", async (req, res) => {
  try {
    // Build the query to exclude events with null properties
    const query = {
      name: { $ne: null },
      description: { $ne: null },
      date: { $ne: null },
      location: { $ne: null },
      // Add other fields you want to check for null values
    };

    // Fetch events based on the query
    const events = await db.collection("events").find(query).toArray();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch a single event by ID
app.get("/api/events/:id", async (req, res) => {
  try {
    // Convert string ID to MongoDB ObjectId
    let eventId;
    try {
      eventId = new ObjectId(req.params.id);
    } catch (idError) {
      console.error("Invalid ObjectId format:", req.params.id);
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    const event = await db.collection("events").findOne({ _id: eventId });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    console.error("Error fetching single event:", err);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to create a new event
app.post("/api/events/create", async (req, res) => {
  const { name, description, date, location, headCount } = req.body;

  try {
    const newEvent = {
      name,
      description,
      date,
      location,
      headCount: headCount || 0, // Default to 0 if not provided
      participants: [] // Array to store emails of participants
    };

    // Insert the new event into the database
    const result = await db.collection("events").insertOne(newEvent);

    // Check if the insert operation was acknowledged
    if (result.acknowledged) {
      // Use the insertedId to find the document and return it
      const event = await db.collection("events").findOne({ _id: result.insertedId });
      res.status(201).json(event);
    } else {
      throw new Error("Insertion failed");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Endpoint to: Delete an event
app.delete("/api/events/:id/delete", async (req, res) => {
  try {
    const eventId = new ObjectId(req.params.id);
    const result = await db.collection("events").deleteOne({ _id: eventId });

    if (result.deletedCount === 1) {
      res.status(200).json({ message: "Event successfully deleted" });
    } else {
      throw new Error("Event not found or already deleted");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an event (public endpoint)
app.put("/api/events/:id", async (req, res) => {
  try {
    console.log("Public: Updating event ID:", req.params.id);
    console.log("Public: Update data:", req.body);

    // Important: Validate the ID format first
    let eventId;
    try {
      eventId = new ObjectId(req.params.id);
      console.log("Public: Converted to ObjectId:", eventId);
    } catch (idError) {
      console.error("Public: Invalid ObjectId format:", req.params.id, idError);
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    const { name, description, date, location } = req.body;
    console.log("Public: Extracted fields:", { name, description, date, location });

    if (!name || !description || !date || !location) {
      console.log("Public: Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the event exists first
    const eventExists = await db.collection("events").findOne({ _id: eventId });
    if (!eventExists) {
      console.log("Public: Event not found for update:", eventId);
      return res.status(404).json({ message: "Event not found" });
    }

    const result = await db.collection("events").updateOne(
      { _id: eventId },
      { $set: {
        name,
        description,
        date,
        location
      }}
    );

    console.log("Public: Update result:", result);

    if (result.matchedCount === 0) {
      console.log("Public: No event matched the ID:", eventId);
      return res.status(404).json({ message: "Event not found" });
    }

    const updatedEvent = await db.collection("events").findOne({ _id: eventId });
    console.log("Public: Updated event:", updatedEvent);
    res.json(updatedEvent);
  } catch (err) {
    console.error("Public: Error updating event:", err);
    res.status(500).json({ error: err.message });
  }
});

// RSVP to an event:
// url makes sense, when id is passed we incremement headCount element (RSVP)
app.post("/api/events/:id/headCount/rsvp", async (req, res) => {
  try {
    // Remember mongos strict typing.
    // convert to ObjectId
    const eventId = new ObjectId(req.params.id);
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required for RSVP" });
    }

    // Check if the user has already RSVP'd to this event
    const event = await db.collection("events").findOne({ _id: eventId });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Initialize participants array if it doesn't exist
    const participants = event.participants || [];

    // Check if email already exists in participants
    if (participants.includes(email)) {
      return res.status(400).json({ message: "You have already registered for this event" });
    }

    // Add email to participants and increment headCount
    const result = await db.collection("events").updateOne(
      { _id: eventId },
      {
        $inc: { headCount: 1 },
        $push: { participants: email }
      }
    );

    // Check for update, if not, return 404
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .send({ message: "Event not found or update failed" });
    }

    // If updated, return updated event
    const updatedEvent = await db
      .collection("events")
      .findOne({ _id: eventId });
    res.json(updatedEvent);
  }
  catch (err) { // Catch errors during the process.
    res.status(500).json({ error: err.message });
  }
});

// UN-RSVP to an event:
// Same logic as above but decrement with -1, kind of redundant but,
// I wanted to make sure I understood the logic.
app.post("/api/events/:id/headCount/unrsvp", async (req, res) => {
  try {
    const eventId = new ObjectId(req.params.id);
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required for un-RSVP" });
    }

    // Check if the user has RSVP'd to this event
    const event = await db.collection("events").findOne({ _id: eventId });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Initialize participants array if it doesn't exist
    const participants = event.participants || [];

    // Check if email exists in participants
    if (!participants.includes(email)) {
      return res.status(400).json({ message: "You are not registered for this event" });
    }

    // Remove email from participants and decrement headCount
    const result = await db.collection("events").updateOne(
      { _id: eventId },
      {
        $inc: { headCount: -1 },
        $pull: { participants: email }
      }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .send({ message: "Event not found or update failed" });
    }

    const updatedEvent = await db
      .collection("events")
      .findOne({ _id: eventId });
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const clientBuildPath = path.join(__dirname, '../client/build');
  console.log(`Serving static files from: ${clientBuildPath}`);
  app.use(express.static(clientBuildPath));

  // Any route that's not an API route should be handled by React
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, 'index.html'));
  });
}

// 404 - Not Found (for API routes only in production)
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    res.status(404).json({ message: "Resource not found" });
  } else {
    next();
  }
});

// 500 - Server Error
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// My ports kept switching, just so I can see it in the console
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}/`);
});

//
// Endpoint to: Fetch a single event DID NOT FINISH!!!

// app.patch("/api/events/:id/edit", async (req, res) => {
//   try {
//     const eventId = new ObjectId(req.params.id);
//     const updateData = req.body;
//     const result = await db.collection("events").updateOne(
//       { _id: eventId },
//       { $set: updateData }
//     );

//     if (result.modifiedCount === 0) {
//       return res.status(404).send({ message: "Event not found or no update made" });
//     }

// Fetch and return the updated event

//     const updatedEvent = await db.collection("events").findOne({ _id: eventId });
//     res.json(updatedEvent);
//   } catch (err) {

// Handle errors, such as invalid ObjectId format

//     res.status(500).json({ error: err.message });
//   }
// });

// Admin routes for event management
app.get("/api/admin/events", authenticateAdmin, async (req, res) => {
  try {
    console.log("Fetching admin events");
    // Use the same query as the public endpoint to ensure we get valid events
    const query = {
      name: { $ne: null },
      description: { $ne: null },
      date: { $ne: null },
      location: { $ne: null },
    };

    // Show all queries and collections for debugging
    console.log("Database collections:");
    const collections = await db.listCollections().toArray();
    console.log(collections.map(c => c.name));

    // Use explicit 'events' collection based on our DB checker results
    const events = await db.collection("events").find(query).toArray();
    console.log(`Found ${events.length} events:`, events);
    res.json(events);
  } catch (err) {
    console.error("Error in admin events endpoint:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all RSVPs for a specific event
app.get("/api/admin/events/:id/rsvps", authenticateAdmin, async (req, res) => {
  try {
    console.log("Fetching RSVPs for event ID:", req.params.id);

    // Important: Validate the ID format first
    let eventId;
    try {
      eventId = new ObjectId(req.params.id);
    } catch (idError) {
      console.error("Invalid ObjectId format:", req.params.id);
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    const event = await db.collection("events").findOne({ _id: eventId });

    if (!event) {
      console.log("Event not found");
      return res.status(404).json({ message: "Event not found" });
    }

    console.log("Found event:", event.name);
    console.log("Participants:", event.participants || []);

    // Return the participants array (emails)
    res.json({
      event: {
        name: event.name,
        date: event.date,
        _id: event._id
      },
      participants: event.participants || []
    });
  } catch (err) {
    console.error("Error in RSVPs endpoint:", err);
    res.status(500).json({ error: err.message });
  }
});

// Debug endpoint to fetch RSVPs directly (no auth)
app.get("/api/debug/events/:id/rsvps", async (req, res) => {
  try {
    console.log("Debug: Fetching RSVPs for event ID:", req.params.id);

    // Important: Validate the ID format first
    let eventId;
    try {
      eventId = new ObjectId(req.params.id);
    } catch (idError) {
      console.error("Debug: Invalid ObjectId format:", req.params.id);
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    const event = await db.collection("events").findOne({ _id: eventId });

    if (!event) {
      console.log("Debug: Event not found");
      return res.status(404).json({ message: "Event not found" });
    }

    console.log("Debug: Found event:", event.name);
    console.log("Debug: Participants:", event.participants || []);

    // Return the participants array (emails)
    res.json({
      event: {
        name: event.name,
        date: event.date,
        _id: event._id
      },
      participants: event.participants || []
    });
  } catch (err) {
    console.error("Debug: Error in RSVPs endpoint:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update an event
app.put("/api/admin/events/:id", authenticateAdmin, async (req, res) => {
  try {
    console.log("Admin: Updating event ID:", req.params.id);
    console.log("Admin: Update data:", req.body);

    // Important: Validate the ID format first
    let eventId;
    try {
      eventId = new ObjectId(req.params.id);
      console.log("Admin: Converted to ObjectId:", eventId);
    } catch (idError) {
      console.error("Admin: Invalid ObjectId format:", req.params.id, idError);
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    const { name, description, date, location } = req.body;
    console.log("Admin: Extracted fields:", { name, description, date, location });

    if (!name || !description || !date || !location) {
      console.log("Admin: Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the event exists first
    const eventExists = await db.collection("events").findOne({ _id: eventId });
    if (!eventExists) {
      console.log("Admin: Event not found for update:", eventId);
      return res.status(404).json({ message: "Event not found" });
    }

    const result = await db.collection("events").updateOne(
      { _id: eventId },
      { $set: {
        name,
        description,
        date,
        location
      }}
    );

    console.log("Admin: Update result:", result);

    if (result.matchedCount === 0) {
      console.log("Admin: No event matched the ID:", eventId);
      return res.status(404).json({ message: "Event not found" });
    }

    const updatedEvent = await db.collection("events").findOne({ _id: eventId });
    console.log("Admin: Updated event:", updatedEvent);
    res.json(updatedEvent);
  } catch (err) {
    console.error("Admin: Error updating event:", err);
    res.status(500).json({ error: err.message });
  }
});

// Debug endpoint to update an event (no auth)
app.put("/api/debug/events/:id", async (req, res) => {
  try {
    console.log("Debug: Updating event ID:", req.params.id);
    console.log("Debug: Update data:", req.body);

    // Important: Validate the ID format first
    let eventId;
    try {
      eventId = new ObjectId(req.params.id);
      console.log("Debug: Converted to ObjectId:", eventId);
    } catch (idError) {
      console.error("Debug: Invalid ObjectId format:", req.params.id, idError);
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    const { name, description, date, location } = req.body;
    console.log("Debug: Extracted fields:", { name, description, date, location });

    if (!name || !description || !date || !location) {
      console.log("Debug: Missing required fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the event exists first
    const eventExists = await db.collection("events").findOne({ _id: eventId });
    if (!eventExists) {
      console.log("Debug: Event not found for update:", eventId);
      return res.status(404).json({ message: "Event not found" });
    }

    const result = await db.collection("events").updateOne(
      { _id: eventId },
      { $set: {
        name,
        description,
        date,
        location
      }}
    );

    console.log("Debug: Update result:", result);

    if (result.matchedCount === 0) {
      console.log("Debug: No event matched the ID:", eventId);
      return res.status(404).json({ message: "Event not found" });
    }

    const updatedEvent = await db.collection("events").findOne({ _id: eventId });
    console.log("Debug: Updated event:", updatedEvent);
    res.json(updatedEvent);
  } catch (err) {
    console.error("Debug: Error updating event:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete an RSVP from an event
app.delete("/api/admin/events/:id/rsvps/:email", authenticateAdmin, async (req, res) => {
  try {
    console.log("Removing RSVP from event:", req.params.id, "Email:", req.params.email);

    // Important: Validate the ID format first
    let eventId;
    try {
      eventId = new ObjectId(req.params.id);
    } catch (idError) {
      console.error("Invalid ObjectId format:", req.params.id);
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    const emailToRemove = req.params.email;

    // Get the event to check if the email exists
    const event = await db.collection("events").findOne({ _id: eventId });

    if (!event) {
      console.log("Event not found");
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.participants || !event.participants.includes(emailToRemove)) {
      console.log("Email not found in participants");
      return res.status(404).json({ message: "Email not found in participants" });
    }

    // Remove the email and decrement headCount
    const result = await db.collection("events").updateOne(
      { _id: eventId },
      {
        $pull: { participants: emailToRemove },
        $inc: { headCount: -1 }
      }
    );

    console.log("RSVP removal result:", result);

    if (result.modifiedCount === 0) {
      return res.status(500).json({ message: "Failed to remove participant" });
    }

    const updatedEvent = await db.collection("events").findOne({ _id: eventId });
    console.log("Updated event after removal:", updatedEvent);
    res.json(updatedEvent);
  } catch (err) {
    console.error("Error removing RSVP:", err);
    res.status(500).json({ error: err.message });
  }
});

// Debug endpoint to remove an RSVP (no auth)
app.delete("/api/debug/events/:id/rsvps/:email", async (req, res) => {
  try {
    console.log("Debug: Removing RSVP from event:", req.params.id, "Email:", req.params.email);

    // Important: Validate the ID format first
    let eventId;
    try {
      eventId = new ObjectId(req.params.id);
    } catch (idError) {
      console.error("Debug: Invalid ObjectId format:", req.params.id);
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    const emailToRemove = req.params.email;

    // Get the event to check if the email exists
    const event = await db.collection("events").findOne({ _id: eventId });

    if (!event) {
      console.log("Debug: Event not found");
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.participants || !event.participants.includes(emailToRemove)) {
      console.log("Debug: Email not found in participants");
      return res.status(404).json({ message: "Email not found in participants" });
    }

    // Remove the email and decrement headCount
    const result = await db.collection("events").updateOne(
      { _id: eventId },
      {
        $pull: { participants: emailToRemove },
        $inc: { headCount: -1 }
      }
    );

    console.log("Debug: RSVP removal result:", result);

    if (result.modifiedCount === 0) {
      return res.status(500).json({ message: "Failed to remove participant" });
    }

    const updatedEvent = await db.collection("events").findOne({ _id: eventId });
    console.log("Debug: Updated event after removal:", updatedEvent);
    res.json(updatedEvent);
  } catch (err) {
    console.error("Debug: Error removing RSVP:", err);
    res.status(500).json({ error: err.message });
  }
});
