import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Avatar,
  useToast,
  Card,
  CardBody,
  Divider,
  Badge,
  SimpleGrid,
  IconButton,
} from '@chakra-ui/react';
import { auth, db } from '../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import DomainSelectionModal from '../components/DomainSelectionModal';

// Domain name mapping for display
const DOMAIN_NAMES = {
  web_dev: 'Web Development',
  ui_ux: 'UI/UX Design',
  mobile_dev: 'Mobile Development',
  data_science: 'Data Science',
  devops: 'DevOps',
  cybersecurity: 'Cybersecurity',
  blockchain: 'Blockchain',
  game_dev: 'Game Development'
};

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    skills: '',
    hourlyRate: '',
    phone: '',
    location: '',
    portfolio: '',
  });
  const toast = useToast();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setFormData({
          name: data.name || '',
          bio: data.bio || '',
          skills: data.skills?.join(', ') || '',
          hourlyRate: data.hourlyRate || '',
          phone: data.phone || '',
          location: data.location || '',
          portfolio: data.portfolio || '',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()),
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, 'users', auth.currentUser.uid), updatedData);
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      setIsEditing(false);
      fetchUserProfile();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDomainUpdate = async (selectedDomains) => {
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        domains: selectedDomains,
        updatedAt: new Date().toISOString(),
      });
      
      toast({
        title: 'Success',
        description: 'Domains updated successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      fetchUserProfile();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update domains',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setShowDomainModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!userData) {
    return (
      <Container maxW="container.md" py={8}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <Card mb={6}>
        <CardBody>
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between" align="center">
              <Avatar
                size="xl"
                name={userData.displayName}
                src={userData.photoURL}
              />
              <VStack align="flex-end">
                <Heading size="lg">{userData.displayName}</Heading>
                <Text color="gray.600">{userData.email}</Text>
                <Badge colorScheme="blue">
                  {userData.userType.charAt(0).toUpperCase() + userData.userType.slice(1)}
                </Badge>
              </VStack>
            </HStack>

            {userData.userType === 'freelancer' && (
              <Box>
                <HStack justify="space-between" align="center" mb={3}>
                  <Heading size="md">Expertise Domains</Heading>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => setShowDomainModal(true)}
                  >
                    Edit Domains
                  </Button>
                </HStack>
                <SimpleGrid columns={[2, 3, 4]} spacing={3}>
                  {userData.domains?.map(domain => (
                    <Badge
                      key={domain}
                      colorScheme="green"
                      p={2}
                      borderRadius="md"
                      textAlign="center"
                    >
                      {DOMAIN_NAMES[domain]}
                    </Badge>
                  ))}
                </SimpleGrid>
              </Box>
            )}

            <Divider />

            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <SimpleGrid columns={[1, 2]} spacing={4}>
                  <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Hourly Rate ($)</FormLabel>
                    <Input
                      name="hourlyRate"
                      type="number"
                      value={formData.hourlyRate}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Phone</FormLabel>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Location</FormLabel>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <FormLabel>Portfolio URL</FormLabel>
                  <Input
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Bio</FormLabel>
                  <Textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={4}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Skills (comma-separated)</FormLabel>
                  <Input
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </FormControl>

                <HStack justify="flex-end" spacing={4}>
                  {isEditing ? (
                    <>
                      <Button variant="ghost" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" colorScheme="blue">
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button colorScheme="blue" onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </HStack>
              </VStack>
            </form>
          </VStack>
        </CardBody>
      </Card>

      <DomainSelectionModal
        isOpen={showDomainModal}
        onClose={() => setShowDomainModal(false)}
        onSubmit={handleDomainUpdate}
      />
    </Container>
  );
}
