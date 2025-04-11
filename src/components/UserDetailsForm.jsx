import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Select,
  Text,
  Box,
  SimpleGrid,
  Heading,
} from '@chakra-ui/react';
import { useState } from 'react';

const DOMAINS = [
  { id: 'web_dev', label: 'Web Development' },
  { id: 'ui_ux', label: 'UI/UX Design' },
  { id: 'mobile_dev', label: 'Mobile Development' },
  { id: 'data_science', label: 'Data Science' },
  { id: 'devops', label: 'DevOps' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'blockchain', label: 'Blockchain' },
  { id: 'game_dev', label: 'Game Development' }
];

export default function UserDetailsForm({ userType, onSubmit, initialData = {} }) {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    description: initialData.description || '',
    skills: initialData.skills || '',
    domain: initialData.domain || '',
    experience: initialData.experience || '',
    hourlyRate: initialData.hourlyRate || '',
    phone: initialData.phone || '',
    location: initialData.location || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        <Heading size="md" mb={4}>
          {userType === 'freelancer' ? 'Complete Your Freelancer Profile' : 'Complete Your Profile'}
        </Heading>

        <FormControl isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>About {userType === 'freelancer' ? 'Yourself' : 'Your Company'}</FormLabel>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder={userType === 'freelancer' 
              ? "Tell us about your experience, expertise, and what makes you unique..."
              : "Tell us about your company, projects, and what you're looking for..."}
            rows={5}
          />
        </FormControl>

        {userType === 'freelancer' && (
          <>
            <SimpleGrid columns={2} spacing={4}>
              <FormControl isRequired>
                <FormLabel>Primary Domain</FormLabel>
                <Select
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  placeholder="Select your main field"
                >
                  {DOMAINS.map(domain => (
                    <option key={domain.id} value={domain.id}>
                      {domain.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Years of Experience</FormLabel>
                <Input
                  name="experience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Years of experience"
                />
              </FormControl>
            </SimpleGrid>

            <FormControl isRequired>
              <FormLabel>Skills</FormLabel>
              <Input
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, Python (comma separated)"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Hourly Rate ($)</FormLabel>
              <Input
                name="hourlyRate"
                type="number"
                min="0"
                value={formData.hourlyRate}
                onChange={handleChange}
                placeholder="Your hourly rate in USD"
              />
            </FormControl>
          </>
        )}

        <SimpleGrid columns={2} spacing={4}>
          <FormControl>
            <FormLabel>Phone Number</FormLabel>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your contact number"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Location</FormLabel>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
            />
          </FormControl>
        </SimpleGrid>

        <Button type="submit" colorScheme="blue" size="lg">
          Complete Registration
        </Button>
      </VStack>
    </Box>
  );
}
