import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { RoughNotation, RoughNotationGroup } from 'react-rough-notation';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

function Header() {
  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      textAlign="center"
      mb={8}
    >
      <RoughNotationGroup show={true}>
        <Box mb={4} position="relative">
          <RoughNotation
            type="underline"
            color="#e53e3e"
            strokeWidth={4}
            iterations={1}
            animationDuration={1500}
            multiline={true}
          >
            <Text
              as="span"
              display="inline-block"
              fontSize="5xl"
              fontWeight="bold"
              bgGradient="linear(to-r, red.500, black)"
              bgClip="text"
              letterSpacing="tight"
              position="relative"
              zIndex={1}
            >
              Cornell Boxing Club
            </Text>
          </RoughNotation>
        </Box>

        <Box position="relative">
          <Text
            as="span"
            display="inline-block"
            fontSize="2xl"
            color="gray.600"
            fontWeight="medium"
            position="relative"
            zIndex={1}
          >
            Knockout Events & Training Sessions
          </Text>
        </Box>
      </RoughNotationGroup>
    </MotionBox>
  );
}

export default Header;
