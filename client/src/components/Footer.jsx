import React from 'react';
import { Box, Text, Flex, Link, Icon, HStack, useColorModeValue } from '@chakra-ui/react';
import { FaGithub, FaLinkedin, FaLock, FaTools } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

const MotionBox = motion(Box);

function Footer() {
  const currentYear = new Date().getFullYear();
  const adminLinkColor = useColorModeValue('gray.400', 'gray.600');
  const adminHoverColor = useColorModeValue('gray.700', 'gray.400');

  return (
    <MotionBox
      as="footer"
      py={6}
      mt={10}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="center"
        align="center"
        borderTop="1px"
        borderColor="gray.200"
        pt={6}
      >
        <Text
          fontSize="sm"
          color="gray.600"
          textAlign="center"
          fontWeight="medium"
        >
          © {currentYear} Developed by{" "}
          <Text
            as="span"
            fontWeight="bold"
            bgGradient="linear(to-r, red.500, red.800)"
            bgClip="text"
          >
            Stephan Volynets
          </Text>
          {" - "}
          <Text as="span" fontWeight="semibold">
            Cornell CS 2025
          </Text>
        </Text>

        <Flex
          ml={{ base: 0, md: 6 }}
          mt={{ base: 3, md: 0 }}
          gap={4}
        >
          <Link
            href="https://github.com/StephanVolynets"
            isExternal
            color="gray.600"
            _hover={{ color: "red.500", transform: "translateY(-2px)" }}
            transition="all 0.2s"
          >
            <Icon as={FaGithub} boxSize={5} />
          </Link>
          <Link
            href="https://www.linkedin.com/in/stephan-volynets"
            isExternal
            color="gray.600"
            _hover={{ color: "red.500", transform: "translateY(-2px)" }}
            transition="all 0.2s"
          >
            <Icon as={FaLinkedin} boxSize={5} />
          </Link>
        </Flex>
      </Flex>

      {/* Admin Link */}
      <Flex justify="center" mt={4} gap={4}>
        <Link
          as={RouterLink}
          to="/admin"
          fontSize="xs"
          color={adminLinkColor}
          _hover={{ color: adminHoverColor, textDecoration: 'none' }}
          display="flex"
          alignItems="center"
        >
          <Icon as={FaLock} boxSize={3} mr={1} />
          Admin
        </Link>

        <Link
          as={RouterLink}
          to="/debug"
          fontSize="xs"
          color={adminLinkColor}
          _hover={{ color: adminHoverColor, textDecoration: 'none' }}
          display="flex"
          alignItems="center"
        >
          <Icon as={FaTools} boxSize={3} mr={1} />
          Debug
        </Link>
      </Flex>
    </MotionBox>
  );
}

export default Footer;
