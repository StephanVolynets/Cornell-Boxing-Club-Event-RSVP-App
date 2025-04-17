import React from 'react';
import { IconButton, useColorMode, useColorModeValue, Box } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <Box
      position="fixed"
      top={{ base: "15px", md: "30px" }}
      right={{ base: "15px", md: "45px" }}
      zIndex={1000}
      transition="all 0.3s ease"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <IconButton
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          variant="solid"
          colorScheme={isDark ? "yellow" : "purple"}
          icon={isDark ? <FaSun size={16} /> : <FaMoon size={16} />}
          onClick={toggleColorMode}
          size={{ base: "sm", md: "md" }}
          borderRadius="full"
          opacity={{ base: 0.8, md: 0.9 }}
          boxShadow="md"
          _hover={{
            transform: "rotate(30deg)",
            opacity: 1
          }}
          transition="all 0.2s"
        />
      </motion.div>
    </Box>
  );
};

export default ThemeToggle;
