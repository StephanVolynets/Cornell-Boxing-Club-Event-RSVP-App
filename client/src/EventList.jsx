import React from 'react';
import { SimpleGrid, Box, Container, Heading, Text, Flex, Icon, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import LoadingSkeleton from './LoadingSkeleton';
import { GiBoxingGlove } from 'react-icons/gi';

const MotionBox = motion(Box);
const MotionIcon = motion(Icon);

// Header section with boxing icons
const EventsHeader = () => {
  const bgColor = useColorModeValue("red.50", "rgba(229, 62, 62, 0.1)");
  const borderColor = useColorModeValue("red.100", "red.900");
  const textColor = useColorModeValue("gray.700", "white");

  // Animation variants for floating motion
  const floatAnimation = {
    animate: {
      y: [0, -5, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <Box
      p={4}
      mb={4}
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Flex
        align="center"
        justify="center"
        wrap="nowrap"
        width="100%"
      >
        <MotionIcon
          as={GiBoxingGlove}
          color="red.500"
          mr={{ base: 1, sm: 2, md: 3 }}
          transform="rotate(-15deg)"
          boxSize={{ base: "25px", sm: "30px", md: "35px" }}
          flexShrink={0}
          initial={{ rotate: -15 }}
          animate={{
            rotate: [-15, -5, -15],
            y: [0, -5, 0]
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <Heading
          size={{ base: "md", sm: "lg" }}
          fontWeight="extrabold"
          textAlign="center"
          color={textColor}
          px={{ base: 0, sm: 1 }}
          flexShrink={1}
          isTruncated
        >
          Upcoming Boxing Events
        </Heading>
        <MotionIcon
          as={GiBoxingGlove}
          color="red.500"
          ml={{ base: 1, sm: 2, md: 3 }}
          transform="scaleX(-1)"
          boxSize={{ base: "25px", sm: "30px", md: "35px" }}
          flexShrink={0}
          initial={{ rotate: -15, scaleX: -1 }}
          animate={{
            rotate: [-15, -5, -15],
            y: [0, -5, 0]
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
            delay: 0.5
          }}
        />
      </Flex>
      <Text
        textAlign="center"
        fontSize={{ base: "xs", sm: "sm", md: "md" }}
        mt={1}
        color={textColor}
        px={{ base: 2, md: 4 }}
      >
        Register now for Cornell Boxing Club's exclusive training sessions and workshops
      </Text>
    </Box>
  );
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

function EventList({ events, onRSVPToggle, loading, userRSVPs, userEmail, emailsByEvent }) {
  // Calculate items needed to complete the last row
  const columns = { base: 1, md: 2, lg: 3, xl: 4 };
  const maxColumns = 4; // Maximum number of columns in xl view
  const itemsNeeded = maxColumns - (events.length % maxColumns);
  const fillerItems = itemsNeeded === maxColumns ? [] : Array(itemsNeeded).fill(null);

  return (
    <Container maxW="container.xl" px={0} position="relative">
      {/* Header with simplified design */}
      <EventsHeader />

      <MotionBox
        variants={container}
        initial="hidden"
        animate="show"
        position="relative"
        zIndex={1}
      >
        <SimpleGrid
          columns={columns}
          spacing={6}
          px={{ base: 4, md: 0 }}
        >
          {loading && !events.length ? (
            <LoadingSkeleton count={8} />
          ) : (
            <>
              {events.map(event => (
                <MotionBox
                  key={event._id}
                  variants={item}
                  transition={{ duration: 0.2 }}
                >
                  <EventCard
                    event={event}
                    onRSVPToggle={onRSVPToggle}
                    isRSVPed={userRSVPs[event._id]}
                    isLoading={loading}
                    userEmail={userEmail}
                    eventEmail={emailsByEvent[event._id]}
                    emailsByEvent={emailsByEvent}
                  />
                </MotionBox>
              ))}
              {/* Add invisible filler cards to maintain grid symmetry */}
              {fillerItems.map((_, index) => (
                <Box key={`filler-${index}`} visibility="hidden">
                  <EventCard
                    event={{
                      name: '',
                      description: '',
                      date: '',
                      location: '',
                      headCount: 0,
                      _id: `filler-${index}`
                    }}
                    onRSVPToggle={() => {}}
                    isRSVPed={false}
                    isLoading={false}
                    userEmail={userEmail}
                    eventEmail={null}
                    emailsByEvent={{}}
                  />
                </Box>
              ))}
            </>
          )}
        </SimpleGrid>
      </MotionBox>
    </Container>
  );
}

export default EventList;
