import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  FormControl, 
  FormLabel, 
  Input, 
  Textarea, 
  Button, 
  VStack, 
  useToast,
  Heading
} from '@chakra-ui/react';
import { auth, db } from '../../config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function FreelancerDetails() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    description: ''
  });
  
  const navigate = useNavigate();
  const toast = useToast();
  
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, 'freelancers', user.uid), {
          ...formData,
          email: user.email,
          userId: user.uid,
          createdAt: serverTimestamp(),
          userType: 'freelancer'
        });
        
        await setDoc(doc(db, 'users', user.uid), {
          profileComplete: true
        }, { merge: true });
        
        toast({
          title: 'Profile saved',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        navigate('/freelancer/dashboard', { replace: true });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box p={8} maxW="600px" mx="auto">
      <Heading mb={6} textAlign="center">Complete Your Profile</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Full Name</FormLabel>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Age</FormLabel>
            <Input type="number" name="age" value={formData.age} onChange={handleChange} />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Phone Number</FormLabel>
            <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
          </FormControl>
          
          <FormControl isRequired>
            <FormLabel>Job Description</FormLabel>
            <Textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={5}
            />
          </FormControl>
          
          <Button type="submit" colorScheme="blue" w="full" mt={4}>
            Save Profile
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
