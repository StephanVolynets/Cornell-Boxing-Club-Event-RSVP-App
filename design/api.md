## API Endpoints
---

### Fetch All Events
- **Method:** GET
- **Path:** `/api/events`
- **Description:** Fetches all events from the database, excluding those with null properties.
- **Response Format:** Array of event objects.

### Create New Event
- **Method:** POST
- **Path:** `/api/events/create`
- **Description:** Creates a new event.
- **Request Body Format:**
```json
  {
    "name": "String",
    "description": "String",
    "date": "Date",
    "location": "String",
    "headCount": "Integer (optional, defaults to 0)"
  }
```
- **Response Format: Newly created event object.**

### Delete Event
- **Method:** DELETE
- **Path:** `/api/events/:id/delete`
- **Description:** Deletes an event by ID.
- **Parameters:** `id` - the MongoDB ObjectId of the event.
- **Response Format:** A success message or error message.

### RSVP to an Event
- **Method:** POST
- **Path:** `/api/events/:id/headCount/rsvp`
- **Description:** Increments the head count of an event by 1.
- **Parameters:** `id` - the MongoDB ObjectId of the event.
- **Response Format:** Updated event object.

### Un-RSVP to an Event
- **Method:** POST
- **Path:** `/api/events/:id/headCount/unrsvp`
- **Description:** Decrements the head count of an event by 1.
- **Parameters:** `id` - the MongoDB ObjectId of the event.
- **Response Format:** Updated event object.

### Edit Event (Not yet implemented)
- **Method:** PATCH
- **Path:** `/api/events/:id/edit`
- **Description:** Updates specified fields of an event.
- **Parameters:** `id` - the MongoDB ObjectId of the event.
- **Request Body Format:** Fields to update.
- **Response Format:** Updated event object.



# Database Schema:
---

## Events Collection

Each document in the `events` collection has the following schema:

- `_id`: ObjectId - Unique identifier for the event.
- `name`: String - Name of the event.
- `description`: String - Description of the event.
- `date`: Date - Date when the event is scheduled.
- `location`: String - Location where the event will take place.
- `headCount`: Integer - Number of people who have RSVPed to the event.

Example Document:
```json
{
  "_id": ObjectId("..."),
  "name": "Ithaca Farmers Market",
  "description": "A gathering of local farmers and artisans. Fresh produce, handmade crafts, and more.",
  "date": "2023-07-15",
  "location": "Ithaca Farmers Market Pavilion",
  "headCount": 0
}
