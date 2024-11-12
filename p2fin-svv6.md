# Project 2 Final Submission (p2fin) Grade

Your submission must be fully functional for credit; we cannot grade non-functioning code for partial credit.

All files must be in the location specified in the assignment's requirements for credit; our grading process cannot reliably locate your work in other locations.

No credit provided for methods used not presented in class.

**Student's NetID:** svv6


**Grader Instructions:**

- Grade in Codespaces.
- Start the development servers.
  - After `cd client`, run `npm install` and `npm start` to start the client.
  - After `cs server`, run `npm install`, `mongosh init.mongo.sh`, and `npm run dev` to start the server.
- Open the student's submission in **Firefox**.
- Code must be functional for credit; no partial credit for non-working code.


## Events API Design
_full, half, or no credit_

- (0 / 6) The plan of API design is documented in `design-plan/api.md` with the following information for each endpoint:
  - The action (CRUD operation)
  - The HTTP method
  - The URI
  - The request body (if any)
  - The response body (if any)
  - The response status code(s)
- (0 / 4) The REST API employs the REST API guidelines/best practices covered in class.
  - Use the conventional resource URIs for endpoints as presented in class. (i.e. `/api/PLURAL_NOUN`)
  - All URIs/resources are lowercase.
  - Use the conventional HTTP methods for endpoints for each CRUD operation.
- (0 / 4) The API supports creating, reading, updating, deleting events and RSVP/un-RSVP.
  - Appropriate action is chosen for each endpoint.
  - i.e. RSVP/un-RSVP should not be a `GET` request.
- (0 / 6) An HTTP notebook (`server/api.http`) is provided and documented the API with an example of each endpoint.

**Events API Design Total: (0 / 20)**
> Explanation for points lost:
> -20 no API design


## Events API Implementation
_full, half, or no credit_

**Grader Instructions:**

- Test all endpoints in the HTTP notebook (`server/api.http`)
- Test all endpoints in the order presented in the HTTP notebook.
- For tests that require an event ID, replace the ID in the HTTP notebook with a valid ID. This is the only change you may make to the notebook.
- If an endpoint does not exist in the notebook, you cannot grade it.

- (0 / 6) A create event endpoint is functional.
  - The endpoint creates an event in the database.
  - The request body contains JSON event data.
- (0 / 4) When creating or updating data in the database, only the data for the event itself is set.
  - Developers can't change the head count explicitly.

- (0 / 6) A read all events endpoint is functional.
  - The endpoint queries the database for all events.
  - The response body contains JSON event data.

- (0 / 6) A update event endpoint is functional.
  - The endpoint updates an event in the database.
  - The URI contains the event ID.
  - The request body contains JSON event data to update.

- (0 / 6) A delete event endpoint is functional.
  - The endpoint deletes an event in the database.
  - The URI contains the event ID.

- (0 / 6) RSVP/un-RSVP endpoint(s) are functional.
  - The URI contains the event ID.
  - The endpoint updates the head count for an event in the database.

- ( 0/ 6) For all requests that send JSON data to the server, each piece of data is explicitly set in the database query. (e.g. `{ name: req.body.name }`).
  - The spread operator should not be used.

**Events API Implementation Total: (0 / 40)**
> Explanation for points lost:
> cannot test the api


## Final App
_full, half, or no credit_

- (0 / 6) The final app looks, feels, and functions like an app.
  - Common app design patterns are used.
  - App does not look like a webpage.
- (0 / 4) App is professional, polished, and complete.

- (0 / 8) All events are presented in the main view.
  - Events are stored in the database.
  - Events are loaded via a REST API call.
- (0 / 4) Each event displays an accurate head count.
  - The head count is stored in the database.
  - The head count is loaded via a REST API call.
- (0 / 8) User's may RSVP/un-RSVP for events.
  - The app updates the head count for each event in the database.
  - The app displays the user's RSVP status (is not persistent on page refresh).
- (0 / 8) The implementation employs best practices for client-side rendering.
  - Use of components, props, state, events, etc.
  - Server API calls are asynchronous.

**Final App Total: (0 / 38)**
> Explanation for points lost:
> cannot see your website


## Overall

> **What did the student do well?**
>
> **Do you have any additional feedback for the student?**
>

**Overall Total: (0 / 98)**
