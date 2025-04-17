import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Badge,
  useToast,
  IconButton,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react';
import {
  EditIcon,
  ViewIcon,
  DeleteIcon,
  CheckIcon,
  CloseIcon,
  ExternalLinkIcon
} from '@chakra-ui/icons';
import axios from 'axios';

const AdminDashboard = ({ user, onLogout }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editedEvent, setEditedEvent] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();

  const cancelRef = React.useRef();
  const toast = useToast();

  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('red.600', 'red.400');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const tableHeaderBg = useColorModeValue('gray.50', 'gray.700');

  // Helper function to normalize MongoDB IDs
  const normalizeId = (id) => {
    // If the ID contains colons (like in console errors), extract just the actual ID portion
    if (typeof id === 'string' && id.includes(':')) {
      const parts = id.split('/');
      return parts[parts.length - 1];
    }
    return id;
  };

  // Fetch all events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      console.log('Trying to fetch events...');

      // First try the debug endpoint to verify data is accessible
      const debugResponse = await axios.get('http://localhost:8080/api/debug/events');
      console.log('Debug events response:', debugResponse.data);

      if (debugResponse.data.count > 0) {
        // If debug endpoint works, try the actual admin endpoint
        try {
          const response = await axios.get('http://localhost:8080/api/admin/events', {
            withCredentials: true,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            params: {
              _t: new Date().getTime() // Add cache-busting parameter
            }
          });
          console.log('Admin events response:', response.data);
          setEvents(response.data);
        } catch (adminError) {
          console.error('Admin endpoint failed, using debug data:', adminError);
          // Fall back to debug data if admin endpoint fails
          setEvents(debugResponse.data.events);

          toast({
            title: 'Warning',
            description: 'Using non-admin event data. Some features may be limited.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        throw new Error('No events found in debug endpoint');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      console.log('Error details:', error.response?.data || error.message);

      // Try the health endpoint to verify server connectivity
      try {
        const healthCheck = await axios.get('http://localhost:8080/api/health');
        console.log('Health check response:', healthCheck.data);
      } catch (healthError) {
        console.error('Health check failed:', healthError.message);
      }

      // Display a more detailed error message
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to load events',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch RSVPs for a specific event
  const fetchRSVPs = async (eventId) => {
    setLoading(true);
    try {
      console.log('Fetching RSVPs for event:', eventId);

      // Normalize the ID
      const normalizedId = normalizeId(eventId);
      console.log('Normalized ID:', normalizedId);

      // First try the admin endpoint
      try {
        const response = await axios.get(`http://localhost:8080/api/admin/events/${normalizedId}/rsvps`, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        console.log('Admin RSVPs response:', response.data);
        setSelectedEvent(response.data.event);
        setParticipants(response.data.participants || []);
        onViewOpen();
      } catch (adminError) {
        console.error('Admin RSVPs endpoint failed, trying debug endpoint:', adminError);

        // Fall back to debug endpoint
        const debugResponse = await axios.get(`http://localhost:8080/api/debug/events/${normalizedId}/rsvps`);
        console.log('Debug RSVPs response:', debugResponse.data);
        setSelectedEvent(debugResponse.data.event);
        setParticipants(debugResponse.data.participants || []);
        onViewOpen();

        toast({
          title: 'Warning',
          description: 'Using non-admin RSVP data. Some features may be limited.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching RSVPs:', error);
      console.log('Error details:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to load RSVPs',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle opening the edit modal
  const handleEditClick = (event) => {
    console.log('Original event for editing:', event);
    setEditedEvent({
      ...event,
      _id: normalizeId(event._id), // Normalize the ID
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : ''
    });
    onEditOpen();
  };

  // Handle saving edited event
  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      console.log('Saving edited event:', editedEvent);

      // Make sure we have a normalized ID
      const normalizedId = normalizeId(editedEvent._id);
      console.log('Normalized ID for update:', normalizedId);

      const updatedEvent = {
        ...editedEvent,
        _id: normalizedId
      };

      // First try the admin endpoint
      try {
        const response = await axios.put(
          `http://localhost:8080/api/admin/events/${normalizedId}`,
          updatedEvent,
          { withCredentials: true }
        );

        console.log('Admin update response:', response.data);

        // Update the events list with the edited event
        setEvents(events.map(event =>
          event._id === editedEvent._id || event._id === normalizedId ? response.data : event
        ));

        toast({
          title: 'Success',
          description: 'Event updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        onEditClose();
      } catch (adminError) {
        console.error('Admin update endpoint failed, trying debug endpoint:', adminError);

        // Fall back to debug endpoint
        const debugResponse = await axios.put(
          `http://localhost:8080/api/debug/events/${normalizedId}`,
          updatedEvent
        );

        console.log('Debug update response:', debugResponse.data);

        // Update the events list with the edited event
        setEvents(events.map(event =>
          event._id === editedEvent._id || event._id === normalizedId ? debugResponse.data : event
        ));

        toast({
          title: 'Warning',
          description: 'Event updated using non-admin access. Some features may be limited.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });

        onEditClose();
      }
    } catch (error) {
      console.error('Error updating event:', error);
      console.log('Error details:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to update event',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle deletion of participant
  const handleDeleteParticipant = async () => {
    if (!selectedEvent || !selectedEmail) return;

    setLoading(true);
    try {
      console.log('Deleting participant:', selectedEmail, 'from event:', selectedEvent._id);

      // Normalize the ID
      const normalizedId = normalizeId(selectedEvent._id);
      console.log('Normalized ID for delete:', normalizedId);

      // First try the admin endpoint
      try {
        const response = await axios.delete(
          `http://localhost:8080/api/admin/events/${normalizedId}/rsvps/${selectedEmail}`,
          { withCredentials: true }
        );

        console.log('Admin delete response:', response.data);

        // Remove the email from participants list
        setParticipants(participants.filter(email => email !== selectedEmail));

        // Update the events list with the updated headCount
        setEvents(events.map(event => {
          if (event._id === selectedEvent._id || event._id === normalizedId) {
            return { ...event, headCount: event.headCount - 1 };
          }
          return event;
        }));

        toast({
          title: 'Success',
          description: 'Participant removed successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        onDeleteClose();
      } catch (adminError) {
        console.error('Admin delete endpoint failed, trying debug endpoint:', adminError);

        // Fall back to debug endpoint
        const debugResponse = await axios.delete(
          `http://localhost:8080/api/debug/events/${normalizedId}/rsvps/${selectedEmail}`
        );

        console.log('Debug delete response:', debugResponse.data);

        // Remove the email from participants list
        setParticipants(participants.filter(email => email !== selectedEmail));

        // Update the events list with the updated headCount
        setEvents(events.map(event => {
          if (event._id === selectedEvent._id || event._id === normalizedId) {
            return { ...event, headCount: event.headCount - 1 };
          }
          return event;
        }));

        toast({
          title: 'Warning',
          description: 'Participant removed using non-admin access. Some features may be limited.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });

        onDeleteClose();
      }
    } catch (error) {
      console.error('Error removing participant:', error);
      console.log('Error details:', error.response?.data || error.message);
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to remove participant',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      setSelectedEmail(null);
    }
  };

  // Confirm logout
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/admin/logout', {}, {
        withCredentials: true
      });
      onLogout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading && !events.length) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" color="red.500" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" bg={bgColor} borderColor={borderColor}>
        <Flex justify="space-between" align="center" mb={6} wrap="wrap">
          <Heading color={headingColor} size="lg">Admin Dashboard</Heading>
          <HStack>
            <Text color={textColor}>Logged in as: <strong>{user?.username}</strong></Text>
            <Button colorScheme="red" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </HStack>
        </Flex>

        <Tabs colorScheme="red" variant="enclosed">
          <TabList>
            <Tab>Events Management</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead bg={tableHeaderBg}>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Date</Th>
                      <Th>Location</Th>
                      <Th>RSVPs</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {events.map((event) => (
                      <Tr key={event._id}>
                        <Td>{event.name}</Td>
                        <Td>{new Date(event.date).toLocaleDateString()}</Td>
                        <Td>{event.location}</Td>
                        <Td>
                          <Badge colorScheme="blue" fontSize="0.8em" px={2} py={1} borderRadius="full">
                            {event.headCount || 0}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <IconButton
                              icon={<EditIcon />}
                              size="sm"
                              colorScheme="blue"
                              onClick={() => handleEditClick(event)}
                              aria-label="Edit event"
                            />
                            <IconButton
                              icon={<ViewIcon />}
                              size="sm"
                              colorScheme="green"
                              onClick={() => fetchRSVPs(event._id)}
                              aria-label="View RSVPs"
                            />
                          </HStack>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Edit Event Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {editedEvent && (
              <VStack spacing={4} align="stretch">
                <FormControl id="name" isRequired>
                  <FormLabel>Event Name</FormLabel>
                  <Input
                    value={editedEvent.name}
                    onChange={(e) => setEditedEvent({...editedEvent, name: e.target.value})}
                  />
                </FormControl>

                <FormControl id="description" isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={editedEvent.description}
                    onChange={(e) => setEditedEvent({...editedEvent, description: e.target.value})}
                    minH="120px"
                  />
                </FormControl>

                <FormControl id="date" isRequired>
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    value={editedEvent.date}
                    onChange={(e) => setEditedEvent({...editedEvent, date: e.target.value})}
                  />
                </FormControl>

                <FormControl id="location" isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input
                    value={editedEvent.location}
                    onChange={(e) => setEditedEvent({...editedEvent, location: e.target.value})}
                  />
                </FormControl>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSaveEdit} isLoading={loading}>
              Save
            </Button>
            <Button variant="ghost" onClick={onEditClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View RSVPs Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            RSVPs for {selectedEvent?.name}
            <Text fontSize="sm" fontWeight="normal" mt={1}>
              {selectedEvent?.date && new Date(selectedEvent.date).toLocaleDateString()}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {participants.length === 0 ? (
              <Text color={textColor}>No RSVPs yet for this event.</Text>
            ) : (
              <Table variant="simple" size="sm">
                <Thead bg={tableHeaderBg}>
                  <Tr>
                    <Th>Email</Th>
                    <Th width="100px">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {participants.map((email) => (
                    <Tr key={email}>
                      <Td>{email}</Td>
                      <Td>
                        <IconButton
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => {
                            setSelectedEmail(email);
                            onDeleteOpen();
                          }}
                          aria-label="Remove participant"
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onViewClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remove Participant
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to remove {selectedEmail} from this event?
              This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteParticipant} ml={3} isLoading={loading}>
                Remove
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default AdminDashboard;
