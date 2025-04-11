import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export default function CreateProject() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = async (data) => {
    try {
      // TODO: Implement project creation logic
      console.log('Project data:', data);
      
      toast({
        title: 'Project Created',
        description: 'Your project has been posted successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      navigate('/projects');
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

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading>Post a New Project</Heading>
        
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Project Title</FormLabel>
              <Input
                {...register('title', { required: true })}
                placeholder="Enter project title"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Project Description</FormLabel>
              <Textarea
                {...register('description', { required: true })}
                placeholder="Describe your project requirements"
                minH="200px"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Category</FormLabel>
              <Select {...register('category', { required: true })}>
                <option value="web-development">Web Development</option>
                <option value="mobile-development">Mobile Development</option>
                <option value="design">Design</option>
                <option value="writing">Writing & Translation</option>
                <option value="marketing">Digital Marketing</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Required Skills</FormLabel>
              <Input
                {...register('skills', { required: true })}
                placeholder="e.g., React, Node.js, UI/UX (comma separated)"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Budget Range</FormLabel>
              <VStack spacing={2}>
                <NumberInput min={0}>
                  <NumberInputField
                    {...register('minBudget', { required: true })}
                    placeholder="Minimum budget"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                
                <NumberInput min={0}>
                  <NumberInputField
                    {...register('maxBudget', { required: true })}
                    placeholder="Maximum budget"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </VStack>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Project Duration (in days)</FormLabel>
              <NumberInput min={1}>
                <NumberInputField
                  {...register('duration', { required: true })}
                  placeholder="Estimated project duration"
                />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <Button type="submit" colorScheme="blue" size="lg">
              Post Project
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
