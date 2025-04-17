import React from 'react';
import { Box, Text, Flex, useColorModeValue } from '@chakra-ui/react';
import { RoughNotation, RoughNotationGroup } from 'react-rough-notation';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

function Header() {
  const subTextColor = useColorModeValue("gray.600", "gray.300");

  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      textAlign="center"
      mb={4}
      pt={{ base: 2, md: 0 }}
      position="relative"
    >
      <RoughNotationGroup show={true}>
        <Flex justify="center" align="center" mb={2} position="relative">
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
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
              fontWeight="bold"
              bgGradient="linear(to-r, red.500, black)"
              bgClip="text"
              letterSpacing="tight"
              position="relative"
              zIndex={1}
              px={2}
            >
              Cornell Boxing Club
            </Text>
          </RoughNotation>
        </Flex>

        <Flex justify="center" align="center" position="relative">
          <Box position="relative">
            <Text
              as="span"
              display="inline-block"
              fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
              color={subTextColor}
              fontWeight="medium"
              position="relative"
              zIndex={1}
            >

            </Text>
          </Box>
        </Flex>
      </RoughNotationGroup>

      {/* Additional decorative punch line */}
      <MotionBox
        mt={2}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <Text
          fontSize={{ base: "sm", md: "md" }}
          fontStyle="italic"
          color={subTextColor}
          fontWeight="normal"
        >
          Train with the best, compete with the rest
        </Text>
      </MotionBox>
    </MotionBox>
  );
}

export default Header;
