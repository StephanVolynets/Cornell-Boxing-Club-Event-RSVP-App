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
  Flex
} from '@chakra-ui/react';
import { GiBatteredAxe, GiBoxingGlove, GiPunchingBag } from 'react-icons/gi';
import { FaTrophy } from 'react-icons/fa';
import ReservationModal from './components/ReservationModal';

function EventCard({ event, onRSVPToggle, isRSVPed, isLoading }) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('red.200', 'red.700');
  const textColor = useColorModeValue('gray.800', 'gray.100');
  const descriptionColor = useColorModeValue('gray.700', 'gray.300');
  const [isModalOpen, setModalOpen] = useState(false);

  // New darker red color scheme for the button
  const buttonScheme = "maroon"; // Using a custom color that will default to a darker shade of red

  const handleRSVPClick = () => {
    if (!isRSVPed) {
      setModalOpen(true);
    } else {
      onRSVPToggle(event._id);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleReservationSubmit = (email) => {
    onRSVPToggle(event._id, email);
    setModalOpen(false);
  };

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
            borderColor: 'red.400',
          }}
          transition="all 0.3s ease"
        >
          <Flex direction="column" justify="space-between" height="100%">
            {/* Top section: Title and Description */}
            <Box>
              <Tooltip label={event.name} placement="top" hasArrow>
                <Heading
                  size="md"
                  height="60px" // Fixed height for title
                  display="flex"
                  alignItems="center"
                  bgGradient="linear(to-r, red.500, black)"
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
                <Icon as={GiBoxingGlove} boxSize={6} color="red.500" flexShrink={0} />
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
                <Icon as={GiPunchingBag} boxSize={6} color="red.500" flexShrink={0} />
                <Text
                  fontSize="md"
                  fontWeight="semibold"
                  color={textColor}
                >
                  {event.location}
                </Text>
              </HStack>

              <HStack spacing={4} width="100%">
                <Icon as={FaTrophy} boxSize={5} color="red.500" flexShrink={0} />
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
            </VStack>

            {/* Bottom section: Button with updated color */}
            <Box mt={4}>
              <Button
                onClick={handleRSVPClick}
                colorScheme={isRSVPed ? "gray" : "blue"}
                bg={isRSVPed ? "gray.500" : "#1A365D"} // Darker blue shade
                isLoading={isLoading}
                leftIcon={!isRSVPed ? <GiBatteredAxe size={20} /> : undefined}
                w="full"
                size="lg"
                borderRadius="full"
                fontWeight="bold"
                fontSize="md"
                py={6}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                  bg: isRSVPed ? 'gray.600' : '#2A4365', // Slightly lighter blue on hover
                }}
                _active={{
                  transform: 'translateY(0)',
                }}
                transition="all 0.2s"
                aria-label={isRSVPed ? 'Cancel Registration' : 'Register Now'}
              >
                {isRSVPed ? 'Cancel Registration' : 'REGISTER NOW'}
              </Button>
            </Box>
          </Flex>
        </Box>
      </ScaleFade>
      <ReservationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleReservationSubmit}
      />
    </>
  );
}

export default EventCard;
