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
  IconButton
} from '@chakra-ui/react';
import { GiBatteredAxe, GiBoxingGlove, GiPunchingBag } from 'react-icons/gi';
import { FaTrophy, FaEllipsisV, FaEnvelope } from 'react-icons/fa';
import ReservationModal from './components/ReservationModal';

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
  const titleGradient = useColorModeValue(
    "linear(to-r, red.500, black)",
    "linear(to-r, red.400, blue.800)"
  );
  const [isModalOpen, setModalOpen] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  // New darker red color scheme for the button
  const buttonScheme = "maroon"; // Using a custom color that will default to a darker shade of red

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

  return (
    <>
      <ScaleFade in={true} initialScale={0.9}>
        <Box
          borderWidth="2px"
          borderRadius="xl"
          borderColor={borderColor}
          bg={bgColor}
          p={6}
          shadow="lg"
          role="article"
          aria-label={`Event: ${event.name}`}
          height="450px" // Fixed height for all cards
          display="flex"
          flexDirection="column"
          _hover={{
            transform: 'translateY(-4px)',
            shadow: '2xl',
            borderColor: hoverBorderColor,
          }}
          transition="all 0.3s ease"
          position="relative"
          zIndex="1" // Base z-index for the card
        >
          {/* Options Menu */}
          {currentEmail && !isRSVPed && (
            <Box
              position="absolute"
              top={2}
              right={2}
              zIndex="10" // Higher z-index to ensure it appears above card content
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
                  zIndex="100" // Ensure high z-index
                  minW="150px" // Minimum width for the menu
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

          <Flex direction="column" justify="space-between" height="100%">
            {/* Top section: Title and Description */}
            <Box>
              <Tooltip label={event.name} placement="top" hasArrow>
                <Heading
                  size="md"
                  height="60px" // Fixed height for title
                  display="flex"
                  alignItems="center"
                  bgGradient={titleGradient}
                  bgClip="text"
                  fontWeight="extrabold"
                  letterSpacing="wide"
                  mb={3}
                  _hover={{ transform: 'scale(1.01)' }}
                  transition="transform 0.2s"
                >
                  {event.name}
                </Heading>
              </Tooltip>

              <Text
                color={descriptionColor}
                noOfLines={3}
                height="72px" // Fixed height for description (3 lines)
                fontSize="md"
                fontWeight="medium"
                letterSpacing="0.2px"
                lineHeight="tall"
                mb={4}
              >
                {event.description}
              </Text>
            </Box>

            {/* Middle section: Event details */}
            <VStack spacing={4} flex="1" justify="center">
              <HStack spacing={4} width="100%">
                <Icon as={GiBoxingGlove} boxSize={6} color={iconColor} flexShrink={0} />
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  color={textColor}
                >
                  {new Date(event.date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </HStack>

              <HStack spacing={4} width="100%">
                <Icon as={GiPunchingBag} boxSize={6} color={iconColor} flexShrink={0} />
                <Text
                  fontSize="md"
                  fontWeight="semibold"
                  color={textColor}
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
                <Text fontSize="xs" color={emailTextColor} textAlign="center">
                  Using: {currentEmail}
                </Text>
              )}
            </VStack>

            {/* Bottom section: Button with updated color */}
            <Box mt={4}>
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
      </ScaleFade>
      <ReservationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleReservationSubmit}
        initialEmail={isChangingEmail ? "" : (eventEmail || userEmail)}
        isChangingEmail={isChangingEmail}
      />
    </>
  );
}

export default EventCard;
