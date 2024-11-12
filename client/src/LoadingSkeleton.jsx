import React from 'react';
import { Skeleton, SimpleGrid, VStack, Box } from '@chakra-ui/react';

function LoadingSkeleton({ count }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Box
          key={i}
          borderWidth="1px"
          borderRadius="lg"
          p={6}
          bg="white"
        >
          <VStack align="stretch" spacing={4}>
            <Skeleton height="24px" width="80%" />
            <Skeleton height="60px" />
            <Skeleton height="20px" width="40%" />
            <Skeleton height="20px" width="60%" />
            <Skeleton height="20px" width="30%" />
            <Skeleton height="40px" />
          </VStack>
        </Box>
      ))}
    </>
  );
}

export default LoadingSkeleton;