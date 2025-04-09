import React, { useState, useEffect } from "react";
import { ChakraProvider, Container, VStack, useToast, Box } from "@chakra-ui/react";
import EventList from "./EventList";
import Header from "./Header";
import Footer from "./components/Footer";
import ThemeToggle from "./components/ThemeToggle";
import axios from "axios";
import theme from "./theme";

export default function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRSVPs, setUserRSVPs] = useState({});
  const toast = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/events");
        setEvents(response.data);
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

  const toggleRSVP = async (eventId, email) => {
    if (loading) return;

    const isRSVPed = userRSVPs[eventId];
    const action = isRSVPed ? "unrsvp" : "rsvp";

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/api/events/${eventId}/headCount/${action}`,
        email ? { email } : {}
      );
      const updatedEvent = response.data;

      if (updatedEvent) {
        setEvents(events.map((event) =>
          event._id === eventId ? updatedEvent : event
        ));
        setUserRSVPs({ ...userRSVPs, [eventId]: !isRSVPed });

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
    <ChakraProvider theme={theme}>
      <ThemeToggle />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Header />
          <EventList
            events={events}
            onRSVPToggle={toggleRSVP}
            loading={loading}
            userRSVPs={userRSVPs}
          />
        </VStack>
        <Footer /> {/* Moved Footer outside of VStack */}
      </Container>
    </ChakraProvider>
  );
}
