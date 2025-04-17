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
  AlertDialogOverlay,
  Tooltip,
  Spacer,
  ButtonGroup,
  InputGroup,
  InputLeftElement,
  Center,
  Stack,
  Divider
} from '@chakra-ui/react';
import {
  EditIcon,
  ViewIcon,
  DeleteIcon,
  CheckIcon,
  CloseIcon,
  ExternalLinkIcon,
  AddIcon,
  SearchIcon,
  RepeatIcon
} from '@chakra-ui/icons';
import axios from 'axios';

const AdminDashboard = ({ user, onLogout }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    location: ''
  });

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isDeleteEventOpen, onOpen: onDeleteEventOpen, onClose: onDeleteEventClose } = useDisclosure();

  const cancelRef = React.useRef();
  const toast = useToast();

  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('red.600', 'red.400');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const tableHeaderBg = useColorModeValue('gray.50', 'gray.700');
  const emptyStateColor = useColorModeValue('gray.500', 'gray.400');

  // Setup axios instance with credentials
  const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true
  });

  // Apply search filter
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEvents(events);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    const filtered = events.filter(event =>
      event.name.toLowerCase().includes(lowerSearchTerm) ||
      event.description.toLowerCase().includes(lowerSearchTerm) ||
      event.location.toLowerCase().includes(lowerSearchTerm) ||
      new Date(event.date).toLocaleDateString().includes(lowerSearchTerm)
    );

    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  // Function to refresh events
  const refreshEvents = async () => {
    setRefreshing(true);
    try {
      await fetchEvents();
      toast({
        title: 'Refreshed',
        description: 'Event list has been updated',
        status: 'info',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error refreshing events:', error);
      toast({
        title: 'Error',
        description: 'Failed to refresh events',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Helper function to normalize MongoDB IDs, hello
  const normalizeId = (id) => {
    // If the ID contains colons (like in console errors), extract just the actual ID portion
    if (typeof id === 'string' && id.includes(':')) {
      const parts = id.split('/');
      return parts[parts.length - 1];
    }
    return id;
  };

  // Check authentication status
  const checkAuth = async () => {
    try {
      const response = await api.get('/api/admin/check-auth');
      setIsAuthenticated(response.data.isAuthenticated);
      return true;
    } catch (error) {
      console.log("Not authenticated, using fallback endpoints");
      setIsAuthenticated(false);
      return false;
    }
  };

  // Fetch all events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      console.log('Trying to fetch events...');

      // First check authentication
      const isAuth = await checkAuth();

      if (isAuth) {
        // Try the admin endpoint first
        try {
          const response = await api.get('/api/admin/events');
          console.log('Admin events response:', response.data);
          setEvents(response.data);
        } catch (adminError) {
          console.error('Admin endpoint failed:', adminError);
          // Fall back to public endpoint
          const publicResponse = await axios.get('http://localhost:8080/api/events');
          setEvents(publicResponse.data);
        }
      } else {
        // If not authenticated, use the public endpoint
        const response = await axios.get('http://localhost:8080/api/events');
        console.log('Public events response:', response.data);
        setEvents(response.data);

        toast({
          title: 'Notice',
          description: 'Using public event data. Log in for full admin access.',
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      console.log('Error details:', error.response?.data || error.message);

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

      // Use the public endpoint for now, since we can't rely on auth working
      const event = await axios.get(`http://localhost:8080/api/events/${normalizedId}`);

      if (!event.data) {
        throw new Error('Event not found');
      }

      // For each event, the participants are stored directly in the event data
      setSelectedEvent(event.data);
      setParticipants(event.data.participants || []);
      onViewOpen();
    } catch (error) {
      console.error('Error fetching RSVPs:', error);

      // If the specific event endpoint fails, try showing data we already have
      try {
        const existingEvent = events.find(e => normalizeId(e._id) === normalizeId(eventId));
        if (existingEvent) {
          setSelectedEvent(existingEvent);
          setParticipants(existingEvent.participants || []);
          onViewOpen();

          toast({
            title: 'Notice',
            description: 'Showing limited RSVP data from cached event information.',
            status: 'info',
            duration: 3000,
            isClosable: true,
          });
        } else {
          throw new Error('Event not found in cache');
        }
      } catch (fallbackError) {
        toast({
          title: 'Error',
          description: 'Could not load RSVPs for this event',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
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

      // Verify that the ID is a valid 24-character hex string
      if (!normalizedId || !/^[0-9a-f]{24}$/i.test(normalizedId)) {
        throw new Error(`Invalid MongoDB ObjectId format: ${normalizedId}`);
      }

      // Prepare the update data - only include the fields the API expects
      const updateData = {
        name: editedEvent.name,
        description: editedEvent.description,
        date: editedEvent.date,
        location: editedEvent.location
      };

      console.log('Update data being sent:', updateData);

      // Always use the public endpoint since we've confirmed it works
      console.log(`Sending to public endpoint: /api/events/${normalizedId}`);
      const response = await axios.put(
        `http://localhost:8080/api/events/${normalizedId}`,
        updateData
      );

      console.log('Update response:', response.data);

      // Update the events list with the edited event
      setEvents(events.map(event =>
        normalizeId(event._id) === normalizedId ? response.data : event
      ));

      toast({
        title: 'Success',
        description: 'Event updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onEditClose();
    } catch (error) {
      console.error('Error updating event:', error);

      // More detailed error logging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Request URL:', error.config?.url);
        console.error('Request method:', error.config?.method);
        console.error('Request data:', error.config?.data);
      }

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

      console.log(`Removing RSVP using: /api/events/${normalizedId}/headCount/unrsvp with email ${selectedEmail}`);

      // Use the unrsvp endpoint
      const response = await axios.post(
        `http://localhost:8080/api/events/${normalizedId}/headCount/unrsvp`,
        { email: selectedEmail }
      );

      console.log('Unrsvp response:', response.data);

      // Remove the email from participants list in the modal
      setParticipants(participants.filter(email => email !== selectedEmail));

      // Update the events list with the updated headCount and participants
      setEvents(events.map(event => {
        if (normalizeId(event._id) === normalizedId) {
          return response.data; // Use the updated event data from the response
        }
        return event;
      }));

      toast({
        title: 'Success',
        description: `${selectedEmail} has been removed from this event`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onDeleteClose();
    } catch (error) {
      console.error('Error removing participant:', error);

      // More detailed error logging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Request URL:', error.config?.url);
      }

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
      await api.post('/api/admin/logout');
      setIsAuthenticated(false);
      onLogout();

      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Add a function to handle adding a new event
  const handleAddEvent = async () => {
    setLoading(true);
    try {
      // Validate inputs
      if (!newEvent.name || !newEvent.description || !newEvent.date || !newEvent.location) {
        toast({
          title: 'Error',
          description: 'All fields are required',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      console.log('Creating new event:', newEvent);

      // Send the data to the API
      const response = await axios.post(
        'http://localhost:8080/api/events/create',
        newEvent
      );

      console.log('Create response:', response.data);

      // Add the new event to the events list
      setEvents([...events, response.data]);

      toast({
        title: 'Success',
        description: 'Event created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Reset the form and close the modal
      setNewEvent({
        name: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        location: ''
      });
      onAddClose();
    } catch (error) {
      console.error('Error creating event:', error);

      // Error logging
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }

      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to create event',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a function to handle deleting an event
  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    setLoading(true);
    try {
      const normalizedId = normalizeId(selectedEvent._id);
      console.log('Deleting event:', normalizedId);

      // Send delete request to API
      await axios.delete(`http://localhost:8080/api/events/${normalizedId}/delete`);

      // Remove the event from the events list
      setEvents(events.filter(event => normalizeId(event._id) !== normalizedId));

      toast({
        title: 'Success',
        description: 'Event deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onDeleteEventClose();
    } catch (error) {
      console.error('Error deleting event:', error);

      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }

      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message || 'Failed to delete event',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load events on component mount
  useEffect(() => {
    // Check auth status first, then fetch events
    checkAuth().then(() => {
      fetchEvents();
    });
  }, []);

  if (loading && !events.length) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" color="red.500" />
      </Flex>
    );
  }

  return (
    <Container maxW="container.xl" py={4} px={{ base: 2, md: 4 }} pt={{ base: 8, md: 4 }}>
      <Box p={{ base: 3, md: 5 }} shadow="md" borderWidth="1px" borderRadius="lg" bg={bgColor} borderColor={borderColor}>
        <Flex
          justify="space-between"
          align={{ base: "start", md: "center" }}
          mb={6}
          wrap="wrap"
          direction={{ base: "column", md: "row" }}
          gap={3}
        >
          <Heading color={headingColor} size="lg">Admin Dashboard</Heading>
          <HStack spacing={{ base: 2, md: 4 }}>
            <Text color={textColor} fontSize={{ base: "sm", md: "md" }}>
              Logged in as: <strong>{user?.username || 'Guest'}</strong>
              {!isAuthenticated && ' (Limited Access)'}
            </Text>
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
            <TabPanel px={{ base: 0, md: 4 }}>
              <Flex
                mb={4}
                justify="space-between"
                align="center"
                wrap="wrap"
                gap={3}
                direction={{ base: "column", md: "row" }}
                width="100%"
              >
                <InputGroup maxW={{ base: "100%", md: "300px" }}>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
                <HStack spacing={2} width={{ base: "100%", md: "auto" }} justify={{ base: "flex-end", md: "flex-start" }}>
                  <Tooltip label="Refresh Events">
                    <IconButton
                      icon={<RepeatIcon />}
                      aria-label="Refresh events"
                      onClick={refreshEvents}
                      isLoading={refreshing}
                      size="md"
                      colorScheme="blue"
                      variant="ghost"
                    />
                  </Tooltip>
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="green"
                    onClick={onAddOpen}
                    width={{ base: "full", md: "auto" }}
                  >
                    Add Event
                  </Button>
                </HStack>
              </Flex>

              {loading ? (
                <Center py={10}>
                  <VStack spacing={3}>
                    <Spinner size="xl" color="red.500" thickness="4px" />
                    <Text>Loading events...</Text>
                  </VStack>
                </Center>
              ) : filteredEvents.length === 0 ? (
                <Center py={10}>
                  <VStack spacing={3}>
                    <Text fontSize="xl" color={emptyStateColor}>
                      {searchTerm ? 'No events found matching your search' : 'No events found'}
                    </Text>
                    {searchTerm && (
                      <Button
                        onClick={() => setSearchTerm('')}
                        size="sm"
                        variant="outline"
                      >
                        Clear Search
                      </Button>
                    )}
                    {!searchTerm && (
                      <Button
                        leftIcon={<AddIcon />}
                        onClick={onAddOpen}
                        size="sm"
                        colorScheme="green"
                      >
                        Add Your First Event
                      </Button>
                    )}
                  </VStack>
                </Center>
              ) : (
                <Box overflowX="auto" width="100%" maxWidth="100%">
                  <Table variant="simple" size={{ base: "sm", md: "md" }}>
                    <Thead bg={tableHeaderBg}>
                      <Tr>
                        <Th>Name</Th>
                        <Th display={{ base: "none", md: "table-cell" }}>Date</Th>
                        <Th display={{ base: "none", md: "table-cell" }}>Location</Th>
                        <Th>RSVPs</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredEvents.map((event) => (
                        <Tr key={event._id}>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Text fontWeight="semibold" noOfLines={1}>
                                {event.name}
                              </Text>
                              <Box display={{ base: "block", md: "none" }}>
                                <Text fontSize="xs" color="gray.500">
                                  {new Date(event.date).toLocaleDateString()}
                                </Text>
                                <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                  {event.location}
                                </Text>
                              </Box>
                            </VStack>
                          </Td>
                          <Td display={{ base: "none", md: "table-cell" }}>{new Date(event.date).toLocaleDateString()}</Td>
                          <Td display={{ base: "none", md: "table-cell" }}>{event.location}</Td>
                          <Td>
                            <Badge colorScheme="blue" fontSize="0.8em" px={2} py={1} borderRadius="full">
                              {event.headCount || 0}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={{ base: 1, md: 2 }}>
                              <Tooltip label="Edit Event">
                                <IconButton
                                  icon={<EditIcon />}
                                  size="sm"
                                  colorScheme="blue"
                                  onClick={() => handleEditClick(event)}
                                  aria-label="Edit event"
                                />
                              </Tooltip>
                              <Tooltip label="View RSVPs">
                                <IconButton
                                  icon={<ViewIcon />}
                                  size="sm"
                                  colorScheme="green"
                                  onClick={() => fetchRSVPs(event._id)}
                                  aria-label="View RSVPs"
                                />
                              </Tooltip>
                              <Tooltip label="Delete Event">
                                <IconButton
                                  icon={<DeleteIcon />}
                                  size="sm"
                                  colorScheme="red"
                                  onClick={() => {
                                    setSelectedEvent(event);
                                    onDeleteEventOpen();
                                  }}
                                  aria-label="Delete event"
                                />
                              </Tooltip>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* Edit Event Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size={{ base: "full", md: "lg" }}>
        <ModalOverlay />
        <ModalContent mx={{ base: 2, md: "auto" }}>
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
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSaveEdit} isLoading={loading}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View RSVPs Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size={{ base: "full", md: "lg" }}>
        <ModalOverlay />
        <ModalContent mx={{ base: 2, md: "auto" }}>
          <ModalHeader>Event RSVPs</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEvent && (
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Heading size="md" mb={2}>{selectedEvent.name}</Heading>
                  <Text fontSize="sm">{new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.location}</Text>
                </Box>

                <Divider />

                <Box>
                  <Text fontWeight="bold" mb={2}>RSVPs ({participants.length})</Text>
                  {participants.length === 0 ? (
                    <Text fontSize="sm" color="gray.500">No RSVPs yet</Text>
                  ) : (
                    <Box maxH="300px" overflowY="auto" p={2} borderWidth="1px" borderRadius="md">
                      {participants.map((email, index) => (
                        <Flex key={index} justify="space-between" align="center" p={2} borderBottomWidth={index < participants.length - 1 ? "1px" : "0"}>
                          <Text fontSize={{ base: "sm", md: "md" }}>{email}</Text>
                          <IconButton
                            icon={<DeleteIcon />}
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => {
                              setSelectedEmail(email);
                              onDeleteOpen();
                            }}
                            aria-label="Remove participant"
                          />
                        </Flex>
                      ))}
                    </Box>
                  )}
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onViewClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Event Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} size={{ base: "full", md: "lg" }}>
        <ModalOverlay />
        <ModalContent mx={{ base: 2, md: "auto" }}>
          <ModalHeader>Add New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <FormControl id="name" isRequired>
                <FormLabel>Event Name</FormLabel>
                <Input
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                  placeholder="Enter event name"
                />
              </FormControl>

              <FormControl id="description" isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  placeholder="Enter event description"
                />
              </FormControl>

              <FormControl id="date" isRequired>
                <FormLabel>Date</FormLabel>
                <Input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
              </FormControl>

              <FormControl id="location" isRequired>
                <FormLabel>Location</FormLabel>
                <Input
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  placeholder="Enter event location"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAddClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleAddEvent} isLoading={loading}>
              Create Event
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog - Participant */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent mx={{ base: 4, md: "auto" }}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Remove Participant
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to remove <strong>{selectedEmail}</strong> from this event?
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

      {/* Delete Confirmation Dialog - Event */}
      <AlertDialog
        isOpen={isDeleteEventOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteEventClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent mx={{ base: 4, md: "auto" }}>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Event
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this event? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteEventClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteEvent} ml={3} isLoading={loading}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Container>
  );
};

export default AdminDashboard;
