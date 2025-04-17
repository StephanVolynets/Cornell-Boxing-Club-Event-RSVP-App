import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Container,
  useColorModeValue,
  FormErrorMessage,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  IconButton,
  Center,
  Flex,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

const AdminLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Auto-fill the credentials for easier testing
  useEffect(() => {
    setUsername('coach');
    setPassword('monkey');
  }, []);

  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const headingColor = useColorModeValue('red.600', 'red.400');
  const buttonColorScheme = 'blue';

  const toast = useToast();

  const testServer = async () => {
    try {
      const healthCheck = await axios.get('http://localhost:8080/api/health');
      console.log('Server health:', healthCheck.data);
      toast({
        title: 'Server is online',
        description: `Server responded at ${new Date().toLocaleTimeString()}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Server health check failed:', error);
      toast({
        title: 'Server error',
        description: 'Could not connect to the server',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting login with credentials:', { username });

      // First check if server is reachable
      await testServer();

      // Configure axios to send credentials (cookies)
      const response = await axios.post(
        'http://localhost:8080/api/admin/login',
        { username, password },
        {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Login response:', response.data);

      if (response.data && response.status === 200) {
        // Handle successful login
        if (onLoginSuccess) {
          onLoginSuccess(response.data.user);
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      console.log('Error details:', err.response?.data || err.message);

      setError(
        err.response?.data?.message ||
        'Login failed. Please check your credentials and try again.'
      );

      // Try the auth test endpoint
      try {
        const authTest = await axios.get('http://localhost:8080/api/debug/auth-test', {
          withCredentials: true
        });
        console.log('Auth test response:', authTest.data);
      } catch (authError) {
        console.error('Auth test failed:', authError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="md" py={12}>
      <Box
        bg={bgColor}
        p={8}
        borderWidth="1px"
        borderRadius="lg"
        borderColor={borderColor}
        boxShadow="lg"
      >
        <VStack spacing={6} align="stretch">
          <Flex direction="column" align="center">
            <Heading
              as="h2"
              size="xl"
              color={headingColor}
              fontWeight="bold"
              mb={2}
            >
              Admin Login
            </Heading>

            <Text textAlign="center" fontSize="sm" color="gray.500" maxW="300px">
              Please enter your credentials to access the admin panel
            </Text>
          </Flex>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  size="lg"
                  focusBorderColor="blue.400"
                />
              </FormControl>

              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    focusBorderColor="blue.400"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      size="sm"
                      tabIndex="-1"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme={buttonColorScheme}
                size="lg"
                width="full"
                mt={4}
                isLoading={loading}
                loadingText="Logging in..."
                py={6}
                fontSize="md"
                fontWeight="bold"
              >
                Login
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={testServer}
                mt={2}
              >
                Test Server Connection
              </Button>
            </VStack>
          </form>
        </VStack>
      </Box>
    </Container>
  );
};

export default AdminLogin;
