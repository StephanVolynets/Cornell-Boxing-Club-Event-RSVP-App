import React, { useState } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  Button,
  Badge,
  HStack,
  Icon,
  useColorModeValue,
  Tooltip,
  ScaleFade,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Divider,
  Link
} from '@chakra-ui/react';
import { GiBatteredAxe, GiBoxingGlove, GiPunchingBag } from 'react-icons/gi';
import { FaTrophy, FaEllipsisV, FaEnvelope, FaInfoCircle, FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import ReservationModal from './components/ReservationModal';
import { CheckIcon } from '@chakra-ui/icons';

function EventCard({ event, onRSVPToggle, isRSVPed, isLoading, userEmail, eventEmail, emailsByEvent }) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('red.200', 'red.600');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const descriptionColor = useColorModeValue('gray.700', 'gray.300');
  const buttonBg = useColorModeValue('#1A365D', '#4299E1');
  const buttonHoverBg = useColorModeValue('#2A4365', '#3182CE');
  const cancelBg = useColorModeValue('gray.500', 'gray.600');
  const cancelHoverBg = useColorModeValue('gray.600', 'gray.500');
  const emailTextColor = useColorModeValue('gray.500', 'gray.400');
  const iconColor = useColorModeValue('red.500', 'red.400');
  const menuBg = useColorModeValue('white', 'gray.700');
  const menuHoverBg = useColorModeValue('gray.100', 'gray.700');
  const menuItemHoverBg = useColorModeValue('gray.100', 'gray.600');
  const menuBorderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBorderColor = useColorModeValue('red.400', 'red.300');
  const emailIconColor = useColorModeValue('#3182CE', '#63B3ED');
  const detailsButtonBg = useColorModeValue('gray.200', 'gray.700');
  const detailsButtonColor = useColorModeValue('red.600', 'red.200');
  const titleGradient = useColorModeValue(
    "linear(to-r, red.500, black)",
    "linear(to-r, red.400, blue.800)"
  );

  // Additional background colors for participant list and status box
  const participantListBg = useColorModeValue("gray.50", "gray.700");
  const statusBoxBg = useColorModeValue("green.50", "green.900");
  const statusBoxTextColor = useColorModeValue("green.800", "green.200");

  // Modal specific styles
  const headerBg = useColorModeValue("gray.50", "gray.900");
  const footerBg = useColorModeValue("gray.50", "gray.900");
  const descriptionBoxBg = useColorModeValue("gray.50", "gray.800");
  const descriptionBorderColor = useColorModeValue("red.400", "red.500");

  const [isModalOpen, setModalOpen] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Function handlers for reservation/RSVP
  const handleRSVPClick = () => {
    if (!isRSVPed) {
      // If user already has an email stored for this event, use it directly without showing modal
      if (eventEmail && eventEmail.endsWith('@cornell.edu')) {
        onRSVPToggle(event._id, eventEmail);
      } else if (userEmail && userEmail.endsWith('@cornell.edu') && !isChangingEmail) {
        onRSVPToggle(event._id, userEmail);
      } else {
        setModalOpen(true);
      }
    } else {
      onRSVPToggle(event._id);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setIsChangingEmail(false);
  };

  const handleReservationSubmit = (email) => {
    onRSVPToggle(event._id, email);
    setModalOpen(false);
    setIsChangingEmail(false);
  };

  const handleChangeEmailClick = () => {
    setIsChangingEmail(true);
    setModalOpen(true);
  };

  // Open the details modal
  const openDetailsModal = () => {
    setIsDetailsOpen(true);
  };

  // Close the details modal
  const closeDetailsModal = () => {
    setIsDetailsOpen(false);
  };

  // Check if this email has already registered
  const isAlreadyRegistered = () => {
    if (!event.participants) return false;

    // Check if the current event email is in participants
    if (eventEmail && event.participants.includes(eventEmail)) {
      return true;
    }

    // If no event-specific email, check the default email
    if (!eventEmail && userEmail && event.participants.includes(userEmail)) {
      return true;
    }

    return false;
  };

  // Which email is being used for this event
  const currentEmail = eventEmail || userEmail;

  // Format date for display
  const formattedDate = new Date(event.date).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate days until event
  const daysUntilEvent = () => {
    const today = new Date();
    const eventDate = new Date(event.date);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Event has passed";
    if (diffDays === 0) return "Today!";
    if (diffDays === 1) return "Tomorrow!";
    return `${diffDays} days away`;
  };

  // Add this to handle button clicks without opening the modal
  const handleButtonClick = (e) => {
    e.stopPropagation(); // Prevent event from bubbling up to the card
  };

  return (
    <>
      <ScaleFade in={true} initialScale={0.9}>
        <Tooltip label="Click for details" placement="top" hasArrow openDelay={500}>
          <Box
            borderWidth="2px"
            borderRadius="xl"
            borderColor={borderColor}
            bg={bgColor}
            p={{ base: 4, md: 6 }}
            shadow="lg"
            role="article"
            aria-label={`Event: ${event.name}`}
            height={{ base: "420px", md: "450px" }} // Adjusted height for mobile
            display="flex"
            flexDirection="column"
            _hover={{
              transform: 'translateY(-4px)',
              shadow: '2xl',
              borderColor: hoverBorderColor,
              cursor: 'pointer'
            }}
            transition="all 0.3s ease-in-out"
            position="relative"
            zIndex="1" // Base z-index for the card
            overflow="hidden" // Prevent content overflow
            onClick={openDetailsModal} // Make the whole card clickable
            sx={{
              "&:active": {
                transform: "scale(0.98)",
                transition: "transform 0.1s"
              }
            }}
          >
            {/* Options Menu */}
            {currentEmail && !isRSVPed && (
              <Box
                position="absolute"
                top={2}
                right={2}
                zIndex="10"
                onClick={handleButtonClick} // Prevent card click when clicking the menu
              >
                <Menu placement="bottom-end" autoSelect={false} closeOnSelect={true} zIndex={1000}>
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<FaEllipsisV />}
                    variant="ghost"
                    size="sm"
                    color={textColor}
                    _hover={{ bg: menuHoverBg }}
                  />
                  <MenuList
                    bg={menuBg}
                    borderColor={menuBorderColor}
                    boxShadow="md"
                    zIndex="100"
                    minW="150px"
                  >
                    <MenuItem
                      icon={<FaEnvelope color={emailIconColor} />}
                      onClick={handleChangeEmailClick}
                      _hover={{ bg: menuItemHoverBg }}
                    >
                      Change Email
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
            )}

            <Flex direction="column" justify="space-between" height="100%" py={1}>
              {/* Top section: Title and Description */}
              <Box flex="0 0 auto">
                <Tooltip label={event.name} placement="top" hasArrow>
                  <Heading
                    size="md"
                    minHeight="40px" // Minimum height
                    maxHeight="60px" // Maximum height
                    display="-webkit-box"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    sx={{
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                    bgGradient={titleGradient}
                    bgClip="text"
                    fontWeight="extrabold"
                    letterSpacing="wide"
                    mb={2} // Reduced margin
                    transition="transform 0.2s"
                    lineHeight="1.4" // Adjusted line height to prevent cutting
                    pb={1} // Added bottom padding
                  >
                    {event.name}
                  </Heading>
                </Tooltip>

                <Text
                  color={descriptionColor}
                  minHeight="60px" // Minimum height
                  maxHeight="72px" // Maximum height
                  overflow="hidden"
                  textOverflow="ellipsis"
                  display="-webkit-box"
                  sx={{
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                  fontSize="md"
                  fontWeight="medium"
                  letterSpacing="0.2px"
                  lineHeight="1.5" // Adjusted line height for better readability
                  mb={2} // Reduced margin
                  pb={1} // Added bottom padding
                >
                  {event.description}
                </Text>

                {/* View Details Button */}
                <Button
                  size="xs"
                  leftIcon={<FaInfoCircle />}
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetailsModal();
                  }}
                  color={detailsButtonColor}
                  _hover={{ bg: detailsButtonBg }}
                  mb={1} // Reduced margin
                >
                  View Details
                </Button>
              </Box>

              {/* Middle section: Event details */}
              <VStack spacing={3} flex="1" justify="center" minHeight="100px" maxHeight="140px" mt={2}>
                <HStack spacing={4} width="100%">
                  <Icon as={GiBoxingGlove} boxSize={6} color={iconColor} flexShrink={0} />
                  <Text
                    fontSize="md"
                    fontWeight="bold"
                    color={textColor}
                    noOfLines={1} // Use noOfLines instead of isTruncated for cleaner truncation
                    width="100%"
                  >
                    {formattedDate}
                  </Text>
                </HStack>

                <HStack spacing={4} width="100%">
                  <Icon as={GiPunchingBag} boxSize={6} color={iconColor} flexShrink={0} />
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    color={textColor}
                    noOfLines={1} // Use noOfLines instead of isTruncated for cleaner truncation
                    width="100%"
                  >
                    {event.location}
                  </Text>
                </HStack>

                <HStack spacing={4} width="100%">
                  <Icon as={FaTrophy} boxSize={5} color={iconColor} flexShrink={0} />
                  <Badge
                    colorScheme="red"
                    fontSize="md"
                    fontWeight="bold"
                    px={3}
                    py={1}
                    borderRadius="full"
                    variant="solid"
                  >
                    {event.headCount} {event.headCount === 1 ? 'fighter' : 'fighters'} registered
                  </Badge>
                </HStack>

                {/* Show which email is being used for this event */}
                {currentEmail && !isRSVPed && (
                  <Box
                    width="100%"
                    textAlign="center"
                    px={2}
                    mt={1}
                    mb={1}
                    pb={1} // Add padding at the bottom to prevent cutting off
                  >
                    <Text
                      fontSize="xs"
                      color={emailTextColor}
                      noOfLines={1} // Use noOfLines for cleaner truncation
                      lineHeight="1.2" // Tighter line height
                    >
                      Using: {currentEmail}
                    </Text>
                  </Box>
                )}
              </VStack>

              {/* Bottom section: Button with fixed height */}
              <Box mt={3} flex="0 0 auto" height="50px" onClick={handleButtonClick}> {/* Stop event propagation */}
                <Button
                  onClick={handleRSVPClick}
                  colorScheme={isRSVPed ? "gray" : "blue"}
                  bg={isRSVPed ? cancelBg : buttonBg}
                  isLoading={isLoading}
                  leftIcon={!isRSVPed ? <GiBatteredAxe size={20} /> : undefined}
                  w="full"
                  size="lg"
                  borderRadius="full"
                  fontWeight="bold"
                  fontSize="md"
                  py={6}
                  color="white"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                    bg: isRSVPed ? cancelHoverBg : buttonHoverBg,
                  }}
                  _active={{
                    transform: 'translateY(0)',
                  }}
                  transition="all 0.2s"
                  aria-label={isRSVPed ? 'Cancel Registration' : 'Register Now'}
                  // Disable button if user has already registered with same email (additional check)
                  isDisabled={!isRSVPed && isAlreadyRegistered()}
                >
                  {isRSVPed ? 'Cancel Registration' :
                    isAlreadyRegistered() ? 'Already Registered' : 'REGISTER NOW'}
                </Button>
              </Box>
            </Flex>
          </Box>
        </Tooltip>
      </ScaleFade>

      {/* Reservation Modal */}
      <ReservationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleReservationSubmit}
        initialEmail={isChangingEmail ? "" : (eventEmail || userEmail)}
        isChangingEmail={isChangingEmail}
      />

      {/* Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={closeDetailsModal} size={{ base: "full", md: "lg" }} motionPreset="slideInBottom">
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(5px)"
        />
        <ModalContent
          borderRadius="xl"
          shadow="xl"
          bg={bgColor}
          borderWidth="1px"
          borderColor={borderColor}
          mx={{ base: 2, md: 4 }}
          overflow="hidden" // Ensure no content overflows
        >
          {/* Header with gradient background */}
          <Box
            position="relative"
            bg={headerBg}
            borderBottomWidth="1px"
            borderColor={borderColor}
            pb={2}
          >
            <ModalHeader
              pt={6}
              pb={2}
              px={6}
              fontWeight="black"
              letterSpacing="wide"
            >
              <Heading
                as="h2"
                size="lg"
                bgGradient={titleGradient}
                bgClip="text"
                lineHeight="1.2"
                mb={2}
              >
                {event.name}
              </Heading>

              <HStack mt={2} spacing={3}>
                <Badge
                  colorScheme={new Date(event.date) < new Date() ? "gray" : "green"}
                  fontSize="md"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {daysUntilEvent()}
                </Badge>

                <Badge
                  colorScheme="blue"
                  fontSize="md"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {event.headCount} {event.headCount === 1 ? 'fighter' : 'fighters'}
                </Badge>
              </HStack>
            </ModalHeader>
            <ModalCloseButton size="lg" top={4} right={4} color={textColor} />
          </Box>

          <ModalBody pb={6} pt={4} px={6}>
            {/* Main content area with description */}
            <Box
              mb={6}
              p={4}
              bg={descriptionBoxBg}
              borderRadius="md"
              borderLeftWidth="4px"
              borderLeftColor={descriptionBorderColor}
            >
              <Text
                color={descriptionColor}
                fontSize="md"
                fontWeight="medium"
                lineHeight="tall"
              >
                {event.description}
              </Text>
            </Box>

            <Divider mb={6} />

            {/* Event Details in a more structured format */}
            <VStack spacing={5} align="stretch">
              <HStack
                spacing={4}
                p={3}
                bg={participantListBg}
                borderRadius="md"
                borderLeftWidth="4px"
                borderLeftColor="blue.400"
              >
                <Icon as={FaCalendarAlt} color={iconColor} boxSize={6} />
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color={textColor}>
                    Date & Time
                  </Text>
                  <Text fontWeight="semibold" fontSize="md" color={textColor}>
                    {formattedDate}
                  </Text>
                </Box>
              </HStack>

              <HStack
                spacing={4}
                p={3}
                bg={participantListBg}
                borderRadius="md"
                borderLeftWidth="4px"
                borderLeftColor="purple.400"
              >
                <Icon as={FaMapMarkerAlt} color={iconColor} boxSize={6} />
                <Box>
                  <Text fontWeight="bold" fontSize="sm" color={textColor}>
                    Location
                  </Text>
                  <Text fontWeight="semibold" fontSize="md" color={textColor}>
                    {event.location}
                  </Text>
                </Box>
              </HStack>

              {/* Participants section */}
              <Box
                p={4}
                bg={participantListBg}
                borderRadius="md"
                borderLeftWidth="4px"
                borderLeftColor="yellow.400"
              >
                <HStack spacing={3} mb={2}>
                  <Icon as={FaUsers} color={iconColor} boxSize={5} />
                  <Text fontWeight="bold" fontSize="sm" color={textColor}>
                    Registered Participants
                  </Text>
                </HStack>

                {event.participants && event.participants.length > 0 ? (
                  <Box
                    maxH="120px"
                    overflowY="auto"
                    mt={2}
                    pl={10}
                  >
                    {event.participants.map((email, index) => (
                      <Text key={index} fontSize="sm" color={textColor} mb={1}>
                        • {email}
                      </Text>
                    ))}
                  </Box>
                ) : (
                  <Box pl={10} mt={1}>
                    <Text fontSize="sm" color={emailTextColor} fontStyle="italic">
                      No registrations yet. Be the first to sign up!
                    </Text>
                  </Box>
                )}
              </Box>
            </VStack>

            {/* Event Registration Status */}
            {isRSVPed ? (
              <Box
                mt={6}
                p={4}
                bg={statusBoxBg}
                borderRadius="md"
                borderLeftWidth="4px"
                borderLeftColor="green.400"
              >
                <HStack spacing={2}>
                  <Icon as={CheckIcon} color="green.500" boxSize={5} />
                  <Text color={statusBoxTextColor} fontWeight="semibold">
                    You're registered for this event
                  </Text>
                </HStack>
              </Box>
            ) : (
              currentEmail && (
                <Box mt={6} p={3} bg={participantListBg} borderRadius="md">
                  <Text fontSize="sm" color={textColor}>
                    You'll register with: <Text as="span" fontWeight="bold">{currentEmail}</Text>
                  </Text>
                </Box>
              )
            )}
          </ModalBody>

          <ModalFooter
            borderTopWidth="1px"
            borderColor={borderColor}
            p={4}
            bg={footerBg}
          >
            <Button
              variant="outline"
              mr={3}
              onClick={closeDetailsModal}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                closeDetailsModal();
                if (!isRSVPed) {
                  handleRSVPClick();
                } else {
                  onRSVPToggle(event._id);
                }
              }}
              colorScheme={isRSVPed ? "red" : "blue"}
              leftIcon={!isRSVPed ? <GiBatteredAxe size={20} /> : undefined}
              isLoading={isLoading}
              isDisabled={!isRSVPed && isAlreadyRegistered()}
            >
              {isRSVPed ? 'Cancel Registration' :
                isAlreadyRegistered() ? 'Already Registered' : 'Register Now'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EventCard;
