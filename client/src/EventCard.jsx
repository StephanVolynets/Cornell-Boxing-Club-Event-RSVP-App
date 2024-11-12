import React from 'react';
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
  ScaleFade
} from '@chakra-ui/react';
import { CalendarIcon, TimeIcon, InfoIcon, CheckIcon } from '@chakra-ui/icons';

function EventCard({ event, onRSVPToggle, isRSVPed, isLoading }) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  return (
    <ScaleFade in={true} initialScale={0.9}>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        borderColor={borderColor}
        bg={bgColor}
        p={6}
        shadow="md"
        role="article"
        aria-label={`Event: ${event.name}`}
        height="100%"
        display="flex"
        flexDirection="column"
      >
        <VStack align="stretch" spacing={4} height="100%">
          <Tooltip label={event.name} placement="top" hasArrow>
            <Heading 
              size="md" 
              noOfLines={2}
              _hover={{ color: 'blue.500' }}
              transition="color 0.2s"
            >
              {event.name}
            </Heading>
          </Tooltip>
          
          <Text color={textColor} noOfLines={3}>
            {event.description}
          </Text>

          <VStack spacing={3} mt="auto">
            <HStack spacing={4} width="100%">
              <Icon as={CalendarIcon} color="blue.500" />
              <Text fontSize="sm">
                {new Date(event.date).toLocaleDateString(undefined, {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </HStack>

            <HStack spacing={4} width="100%">
              <Icon as={TimeIcon} color="green.500" />
              <Text fontSize="sm">{event.location}</Text>
            </HStack>

            <HStack spacing={4} width="100%">
              <Icon as={InfoIcon} color="purple.500" />
              <Badge 
                colorScheme="purple" 
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="full"
              >
                {event.headCount} {event.headCount === 1 ? 'person' : 'people'} attending
              </Badge>
            </HStack>
          </VStack>

          <Button
            onClick={() => onRSVPToggle(event._id)}
            colorScheme={isRSVPed ? "red" : "green"}
            isLoading={isLoading}
            leftIcon={isRSVPed ? undefined : <CheckIcon />}
            w="full"
            size="lg"
            borderRadius="full"
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
            _active={{
              transform: 'translateY(0)',
            }}
            transition="all 0.2s"
            aria-label={isRSVPed ? 'Cancel RSVP' : 'RSVP for this event'}
          >
            {isRSVPed ? 'Cancel RSVP' : 'RSVP Now'}
          </Button>
        </VStack>
      </Box>
    </ScaleFade>
  );
}

export default EventCard;