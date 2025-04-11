import { Box, Button, VStack, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function UserType() {
  const navigate = useNavigate();

  const handleSelectType = (type) => {
    // Store in both session and local storage for redundancy
    sessionStorage.setItem('selectedUserType', type);
    localStorage.setItem('selectedUserType', type);
    
    navigate('/login', { 
      state: { userType: type },
      replace: true 
    });
  };

  return (
    <Box p={8} maxWidth="400px" mx="auto">
      <VStack spacing={8} align="stretch">
        <Heading textAlign="center">Welcome to Workora</Heading>
        <Text textAlign="center">Are you looking to hire or get hired?</Text>
        
        <Button 
          colorScheme="blue" 
          size="lg"
          onClick={() => handleSelectType('client')}
        >
          I want to hire someone
        </Button>
        
        <Button 
          colorScheme="green" 
          size="lg"
          onClick={() => handleSelectType('freelancer')}
        >
          I want to get hired
        </Button>
      </VStack>
    </Box>
  );
}
