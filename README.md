# Cornell Boxing Club Event Registration App

> Created by **Stephan Volynets**
>> A modern, responsive MERN stack application for managing Cornell Boxing Club event registrations with an intuitive user interface.
>>> This was my final project for [INFO 2310](https://classes.cornell.edu/browse/roster/SP25/class/INFO/2310).   Special Thanks to [Professor Kyle Harms](https://kharms.infosci.cornell.edu/index.html) for teaching me Client Side Rendering & all things HTTP communication!

### Main Application View

<div align="center">
  <img src="https://github.com/user-attachments/assets/5719d311-39ce-40f1-9c3b-fac787b8538a" alt="Screenshot"  >
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/3cb9a527-32f8-43bc-88fd-5b057d27b81c" alt="Screenshot" >
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/5b5708e4-f4be-4380-a71f-8a85f408174c" alt="Screenshot"  >
</div>

### Admin Dashboard 

<div align="center">
  <img src="https://github.com/user-attachments/assets/f5e24b3d-fdc4-44aa-8a50-0e290564da55" alt="Screenshot"  >
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/558e6b14-2be9-4e7d-a4e9-a873483652e2" alt="Screenshot"  >
</div>

<div align="center">
  <img src="https://github.com/user-attachments/assets/90ccbf79-2254-4fda-9c68-6d46716dace3" alt="Screenshot"  >
</div>

### Mobile Responsive Design
<div align="center">
  <img src="https://github.com/user-attachments/assets/d2f670c1-d4d0-47b5-8fb3-5064f598d156" alt="Screenshot" width="50%" height="800">
</div>


<div align="center">
  <img src="https://github.com/user-attachments/assets/f39146b7-2b77-472a-af9f-0f415bf22d6c" alt="Screenshot" width="50%" height="800">
</div>


<div align="center">
  <img src="https://github.com/user-attachments/assets/fc3bca38-985b-44ac-996f-b29ca6b02b97" alt="Screenshot" width="50%" height="800">
</div>

### Dark Mode

<div align="center">
  <img src="https://github.com/user-attachments/assets/4bcd6c5b-1c49-45a9-af29-b285aa3bd55a" alt="Screenshot"  >
</div>


## Features

- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Dynamic Event Cards**: Consistent card layout with all event details
- **Real-time RSVP System**: Users can register and cancel registrations
- **Dark/Light Mode**: Toggle between themes with animated transitions
- **Animated UI Elements**: Engaging animations including floating boxing gloves
- **Cornell Email Validation**: Ensures registrations are from Cornell students
- **Admin Dashboard**: Complete event management interface
- **User-friendly Interface**: Intuitive design optimized for all users

## Technology Stack

- **Frontend**: React with hooks for state management
- **UI Framework**: Chakra UI with custom theme
- **Animations**: Framer Motion
- **Backend**: Express.js REST API
- **Database**: MongoDB for event and registration storage
- **State Management**: React Context API and local state
- **HTTP Client**: Axios for API communication

## Application Architecture

### Component Structure

```
App
├── ThemeToggle
├── Router
│   ├── MainApp (Home Page)
│   │   ├── Header
│   │   ├── EventList
│   │   │   ├── EventsHeader (with animated boxing gloves)
│   │   │   └── EventCard (multiple)
│   │   │       └── ReservationModal
│   │   └── Footer
│   ├── AdminPanel
│   │   ├── AdminLogin
│   │   └── AdminDashboard
│   │       ├── Event Management
│   │       └── RSVP Management
│   └── DebugPage
└── Toast Notifications
```

### Data Flow

- Events are fetched from MongoDB via Express API
- User RSVPs are tracked in both state and localStorage
- RSVP actions trigger API calls to update event registrations
- Admin authentication uses backend session management
- Theme preferences are managed through Chakra UI's context


## Usage Guide

### For Event Attendees

1. **Browse Events**: View all upcoming boxing events on the homepage
2. **Toggle Theme**: Use the theme toggle in the top right to switch between light and dark mode
3. **Register for Events**: Click the "Register Now" button to sign up for an event
4. **Enter Email**: Provide your Cornell email (must end with @cornell.edu)
5. **Manage Registrations**: Cancel registrations at any time from the event card

### For Administrators

1. **Access Admin Panel**: Navigate to /admin and log in with provided credentials
2. **Manage Events**: Create, edit, and delete boxing events
3. **View Registrations**: See all participants for each event
4. **Remove Participants**: Option to remove participants from events if needed

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/events` | GET | Fetch all boxing events |
| `/api/events/:id` | GET | Get details for a specific event |
| `/api/events/create` | POST | Create a new event (admin) |
| `/api/events/:id` | PUT | Update an event (admin) |
| `/api/events/:id/delete` | DELETE | Delete an event (admin) |
| `/api/events/:id/headCount/rsvp` | POST | Register for an event |
| `/api/events/:id/headCount/unrsvp` | POST | Cancel event registration |
| `/api/admin/login` | POST | Admin authentication |
| `/api/admin/logout` | POST | Admin logout |
| `/api/admin/check-auth` | GET | Verify admin authentication |

## Key Features in Detail

### Responsive Design
The application is fully responsive with optimized layouts for all device sizes. Components adjust their sizing, spacing, and behavior based on the screen size to ensure a seamless experience across desktop, tablet, and mobile devices.

### Animated Elements
- **Boxing Gloves**: Floating animation with slight rotation
- **Event Cards**: Smooth loading transitions with staggered appearance
- **Theme Toggle**: Rotate animation on hover
- **Modal transitions**: Slide-in animations for modals

### User Authentication
The application uses Cornell email validation to ensure only Cornell students can register for events. The admin panel features a secure login system with session management.

### Data Persistence
- Event registrations are stored in the database
- User email preferences are saved in localStorage
- Admin sessions are managed with cookies

## Customization Options

The application can be customized in several ways:

1. **Theme Colors**: Modify the theme.js file to change the color scheme
2. **Event Card Layout**: Adjust EventCard.jsx to change the card design
3. **Animation Timing**: Edit motion parameters in components using Framer Motion
4. **Backend URL**: Update API URLs in axios calls for different environments

## Troubleshooting

### Common Issues

- **API Connection Errors**: Ensure the server is running on the correct port
- **MongoDB Connection**: Verify your MongoDB connection string is correct
- **CORS Issues**: Check CORS settings in server.js if hosting frontend and backend separately
- **Authentication Problems**: Clear browser cookies if experiencing admin login issues

### Debugging

- The application includes a Debug page at /debug for development purposes
- Check browser console for frontend errors
- Server logs provide information about backend issues

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/EVENT-RSVP-APP-MERN-2.git
cd EVENT-RSVP-APP-MERN-2
```

2. Install dependencies for client and server
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Set up environment variables
```bash
# Create .env file in server directory with your MongoDB connection string
# Example:
MONGODB_URI=mongodb://localhost:27017/cornell-boxing-events
PORT=8080
SESSION_SECRET=your_session_secret
```

### Running the Application

1. Start the server
```bash
cd server
node server.mjs
```

2. In a new terminal, start the client
```bash
cd client
npm start
```

3. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- Admin Panel: http://localhost:3000/admin (Credentials: Coach/monkey)


## Credits

- Professor Kyle Harms for teaching me MERN, user auth, and best practices
- Created for Cornell Boxing Club
- UI components built with Chakra UI
- Animations powered by Framer Motion
- Icons from React Icons library

## Contact

For questions or support, please contact the me at [svv6@cornell.edu].
