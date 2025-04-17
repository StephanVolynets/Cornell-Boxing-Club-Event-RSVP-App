import React, { useState, useEffect } from 'react';
import { Box, Spinner, Center, useToast } from '@chakra-ui/react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import axios from 'axios';

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication status...');
        const response = await axios.get('http://localhost:8080/api/admin/check-auth', {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        console.log('Auth response:', response.data);
        if (response.data.isAuthenticated) {
          setUser(response.data.user);
        }
      } catch (error) {
        // If not authenticated, just don't set the user
        console.log('Auth error:', error.message);
        if (error.response) {
          console.log('Error response status:', error.response.status);
          console.log('Error response data:', error.response.data);
        }

        // Try the health endpoint to verify server connectivity
        try {
          const healthCheck = await axios.get('http://localhost:8080/api/health');
          console.log('Health check response:', healthCheck.data);
        } catch (healthError) {
          console.error('Health check failed:', healthError.message);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    toast({
      title: 'Login successful',
      description: `Welcome, ${userData.username}!`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleLogout = () => {
    setUser(null);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="red.500" thickness="4px" />
      </Center>
    );
  }

  return (
    <Box minH="100vh" px={{ base: 0, md: 4 }} py={{ base: 0, md: 4 }} pt={{ base: 10, md: 0 }}>
      {user ? (
        <AdminDashboard user={user} onLogout={handleLogout} />
      ) : (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </Box>
  );
};

export default AdminPanel;
