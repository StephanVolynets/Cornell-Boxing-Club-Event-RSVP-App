import React from 'react';
import { SimpleGrid, Box, Container } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import EventCard from './EventCard';
import LoadingSkeleton from './LoadingSkeleton';

const MotionBox = motion(Box);

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

function EventList({ events, onRSVPToggle, loading, userRSVPs }) {
  // Calculate items needed to complete the last row
  const columns = { base: 1, md: 2, lg: 3, xl: 4 };
  const maxColumns = 4; // Maximum number of columns in xl view
  const itemsNeeded = maxColumns - (events.length % maxColumns);
  const fillerItems = itemsNeeded === maxColumns ? [] : Array(itemsNeeded).fill(null);

  return (
    <Container maxW="container.xl" px={0}>
      <MotionBox
        variants={container}
        initial="hidden"
        animate="show"
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
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <EventCard
                    event={event}
                    onRSVPToggle={onRSVPToggle}
                    isRSVPed={userRSVPs[event._id]}
                    isLoading={loading}
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