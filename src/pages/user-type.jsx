import { Box, Button, Flex, Heading, VStack, Text, Divider } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

export default function UserType() {
  const navigate = useNavigate();

  const handleUserTypeSelect = (type) => {
    navigate('/login', { state: { userType: type } });
  };

  return (
    <Flex w="100vw" h="100vh" overflow="hidden">
      {/* Left Side - Logo */}
      <Flex
        flex="1"
        bg="white"
        alignItems="center"
        justifyContent="center"
      >
        <Logo width="60%" maxW="400px" />
      </Flex>

      {/* Right Side - User Type Selection */}
      <Box
        flex="1"
        bg="workora.navy"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          bg="white"
          p={8}
          borderRadius="lg"
          boxShadow="lg"
          w="90%"
          maxW="450px"
        >
          <VStack spacing={8}>
            <Heading size="lg" textAlign="center">I want to...</Heading>
            <Button
              size="lg"
              width="100%"
              colorScheme="blue"
              onClick={() => handleUserTypeSelect('client')}
            >
              Hire a Freelancer
            </Button>
            <Button
              size="lg"
              width="100%"
              colorScheme="blue"
              onClick={() => handleUserTypeSelect('freelancer')}
            >
              Work as a Freelancer
            </Button>
            
            <VStack w="100%" spacing={4}>
              <Divider />
              <Text fontSize="sm" color="gray.500">Admin Access</Text>
              <Button
                size="md"
                width="100%"
                variant="outline"
                colorScheme="gray"
                onClick={() => handleUserTypeSelect('admin')}
              >
                Admin Login
              </Button>
            </VStack>
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
}
