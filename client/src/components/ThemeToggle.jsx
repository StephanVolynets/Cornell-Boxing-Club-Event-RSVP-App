import React from 'react';
import { IconButton, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute',
        top: '30px',
        right: '45px',
        zIndex: 10
      }}
    >
      <IconButton
        aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        variant="ghost"
        colorScheme={isDark ? "yellow" : "purple"}
        icon={isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
        onClick={toggleColorMode}
        size="lg"
        borderRadius="full"
        _hover={{
          transform: "rotate(30deg)",
          bg: useColorModeValue("gray.100", "gray.700")
        }}
        transition="all 0.2s"
      />
    </motion.div>
  );
};

export default ThemeToggle;
