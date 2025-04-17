import React, { useState, useEffect } from "react";
import { ChakraProvider, Container, VStack, useToast, Box } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import EventList from "./EventList";
import Header from "./Header";
import Footer from "./components/Footer";
import ThemeToggle from "./components/ThemeToggle";
import AdminPanel from "./AdminPanel";
import DebugPage from "./DebugPage";
import axios from "axios";
import theme from "./theme";

// Main app component
const MainApp = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRSVPs, setUserRSVPs] = useState({});
  const [userEmail, setUserEmail] = useState("");
  const [emailsByEvent, setEmailsByEvent] = useState({});
  const toast = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/events");
        setEvents(response.data);

        // Initialize RSVP status if user email is stored
        const storedEmail = localStorage.getItem("userEmail");
        const storedEmailsByEvent = JSON.parse(localStorage.getItem("emailsByEvent") || "{}");

        if (storedEmail) {
          setUserEmail(storedEmail);
        }

        if (Object.keys(storedEmailsByEvent).length > 0) {
          setEmailsByEvent(storedEmailsByEvent);
        }

        // Create an object to track which events the user has RSVP'd to
        const rsvpStatus = {};
        response.data.forEach(event => {
          const participants = event.participants || [];
          const eventEmails = storedEmailsByEvent[event._id] || storedEmail;

          if (Array.isArray(eventEmails)) {
            // Check if any of the user's emails are in participants
            const isRegistered = eventEmails.some(email => participants.includes(email));
            if (isRegistered) {
              rsvpStatus[event._id] = true;
            }
          } else if (eventEmails && participants.includes(eventEmails)) {
            rsvpStatus[event._id] = true;
          }
        });

        setUserRSVPs(rsvpStatus);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load events",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [toast]);

  const toggleRSVP = async (eventId, email, forceNewEmail = false) => {
    if (loading) return;

    const isRSVPed = userRSVPs[eventId];
    const action = isRSVPed ? "unrsvp" : "rsvp";

    // Determine which email to use
    let emailToUse = email;

    // For RSVPing (not unRSVPing)
    if (!isRSVPed) {
      // If forceNewEmail is true, we always want to show the modal
      if (forceNewEmail) {
        // This will be handled by the modal
        return;
      }

      // If no email provided, check if we have a stored email for this event
      if (!email) {
        const eventEmail = emailsByEvent[eventId];
        if (eventEmail) {
          emailToUse = eventEmail;
        } else if (userEmail) {
          emailToUse = userEmail;
        } else {
          // No email available, show modal
          toast({
            title: "Email Required",
            description: "Please provide your Cornell email",
            status: "info",
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      }
    } else {
      // For unRSVPing, use the email that was used to RSVP
      emailToUse = emailsByEvent[eventId] || userEmail;
    }

    if (!emailToUse) {
      toast({
        title: "Error",
        description: "Email is required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/events/${eventId}/headCount/${action}`,
        { email: emailToUse }
      );
      const updatedEvent = response.data;

      if (updatedEvent) {
        setEvents(events.map((event) =>
          event._id === eventId ? updatedEvent : event
        ));

        // Update RSVP status
        const newRSVPs = { ...userRSVPs, [eventId]: !isRSVPed };
        setUserRSVPs(newRSVPs);

        // If RSVPing, store the email used
        if (!isRSVPed) {
          // Save the email used for this specific event
          const newEmailsByEvent = { ...emailsByEvent, [eventId]: emailToUse };
          setEmailsByEvent(newEmailsByEvent);
          localStorage.setItem("emailsByEvent", JSON.stringify(newEmailsByEvent));

          // Also update the default email if not set
          if (!userEmail) {
            setUserEmail(emailToUse);
            localStorage.setItem("userEmail", emailToUse);
          }
        } else {
          // If unRSVPing, remove the email for this event
          const newEmailsByEvent = { ...emailsByEvent };
          delete newEmailsByEvent[eventId];
          setEmailsByEvent(newEmailsByEvent);
          localStorage.setItem("emailsByEvent", JSON.stringify(newEmailsByEvent));
        }

        toast({
          title: isRSVPed ? "Registration Cancelled" : "Registration Confirmed",
          description: isRSVPed
            ? "You've removed yourself from this event"
            : "You're now registered for this boxing event",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update registration",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Header />
        <EventList
          events={events}
          onRSVPToggle={toggleRSVP}
          loading={loading}
          userRSVPs={userRSVPs}
          userEmail={userEmail}
          emailsByEvent={emailsByEvent}
        />
      </VStack>
      <Footer /> {/* Moved Footer outside of VStack */}
    </Container>
  );
};

// Root App with Router
export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <ThemeToggle />
      <Router>
        <Routes>
          <Route path="/" element={<MainApp />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/debug" element={<DebugPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}
