import "path";
// connect to MongoDB
import { ObjectId } from "mongodb";
import db from "./db/conn.mjs";
import "dotenv/config";
import express from "express";
import cors from "cors";

const port = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(express.json());

// RESTful API Setup:
// docs were really good: https://www.mongodb.com/docs/manual/crud/

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

// Endpoint to create a new event
app.post("/api/events/create", async (req, res) => {
  const { name, description, date, location, headCount } = req.body;

  try {
    const newEvent = {
      name,
      description,
      date,
      location,
      headCount: headCount || 0 // Default to 0 if not provided
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


// Endpoint to: Fetch a single event DID NOT FINISH!!!
// // Endpoint to edit an existing event
// app.patch("/api/events/:id/edit", async (req, res) => {
//   try {
//     // Extract the event ID from the request parameters
//     const eventId = new ObjectId(req.params.id);

//     // Get the update data from the request body
//     const updateData = req.body;

//     // Optional: Validate the update data here

//     // Update the event in the database
//     const result = await db.collection("events").updateOne(
//       { _id: eventId },
//       { $set: updateData }
//     );

//     if (result.modifiedCount === 0) {
//       return res.status(404).send({ message: "Event not found or no update made" });
//     }

//     // Fetch and return the updated event
//     const updatedEvent = await db.collection("events").findOne({ _id: eventId });
//     res.json(updatedEvent);
//   } catch (err) {
//     // Handle errors, such as invalid ObjectId format
//     res.status(500).json({ error: err.message });
//   }
// });



// RSVP to an event:
 // url makes sense, when id is passed we incremement headCount element (RSVP)
app.post("/api/events/:id/headCount/rsvp", async (req, res) => {
  try {
    // took me a WHILE to remember about mongos strict typing.
    // convert to ObjectId
    const eventId = new ObjectId(req.params.id);
    // store in result to verify it was modified
    const result = await db
    // CRUD to increment ($inc)
      .collection("events")
      .updateOne({ _id: eventId }, { $inc: { headCount: 1 } });

    // Check for update, if not, return 404
    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .send({ message: "Event not found or already RSVPed" });
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
    const result = await db
      .collection("events")
      .updateOne({ _id: eventId }, { $inc: { headCount: -1 } });

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .send({ message: "Event not found or already RSVPed" });
    }

    const updatedEvent = await db
      .collection("events")
      .findOne({ _id: eventId });
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 404 - Not Found
app.use((req, res, next) => {
  res.status(404).json({ message: "Resource not found" });
});

// 500 - Server Error
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// My ports kept switching, just so I can see it in the console
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}/`);
});
