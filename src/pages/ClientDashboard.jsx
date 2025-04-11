import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Badge,
  Avatar,
  Card,
  CardBody,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

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

export default function ClientDashboard() {
  const [freelancers, setFreelancers] = useState([]);
  const [filteredFreelancers, setFilteredFreelancers] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFreelancers();
  }, []);

  useEffect(() => {
    filterFreelancers();
  }, [selectedDomain, searchQuery, freelancers]);

  const fetchFreelancers = async () => {
    try {
      const q = query(
        collection(db, 'users'),
        where('userType', '==', 'freelancer')
      );
      const querySnapshot = await getDocs(q);
      const freelancerData = [];
      querySnapshot.forEach((doc) => {
        freelancerData.push({ id: doc.id, ...doc.data() });
      });
      setFreelancers(freelancerData);
    } catch (error) {
      console.error('Error fetching freelancers:', error);
    }
  };

  const filterFreelancers = () => {
    let filtered = [...freelancers];

    // Filter by domain
    if (selectedDomain) {
      filtered = filtered.filter(freelancer => 
        freelancer.domain === selectedDomain || 
        freelancer.domains?.includes(selectedDomain)
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(freelancer =>
        freelancer.displayName?.toLowerCase().includes(query) ||
        freelancer.description?.toLowerCase().includes(query) ||
        freelancer.skills?.some(skill => skill.toLowerCase().includes(query))
      );
    }

    setFilteredFreelancers(filtered);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading mb={2}>Find Freelancers</Heading>
          <Text color="gray.600">
            Browse our talented pool of freelancers
          </Text>
        </Box>

        {/* Filters */}
        <HStack spacing={4}>
          <InputGroup maxW="400px">
            <InputLeftElement pointerEvents="none">
              <svg width="20" height="20" fill="gray" viewBox="0 0 20 20">
                <path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
              </svg>
            </InputLeftElement>
            <Input
              placeholder="Search by name, skills, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <Select
            placeholder="Filter by domain"
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            maxW="300px"
          >
            {Object.entries(DOMAIN_NAMES).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </Select>
        </HStack>

        {/* Freelancer Grid */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredFreelancers.map((freelancer) => (
            <Card key={freelancer.id}>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack spacing={4}>
                    <Avatar
                      size="xl"
                      name={freelancer.displayName}
                      src={freelancer.photoURL}
                    />
                    <VStack align="start" spacing={1} flex={1}>
                      <Heading size="md">{freelancer.displayName}</Heading>
                      <Badge colorScheme="blue">
                        {DOMAIN_NAMES[freelancer.domain]}
                      </Badge>
                      {freelancer.hourlyRate && (
                        <Text color="green.500" fontWeight="bold">
                          ${freelancer.hourlyRate}/hr
                        </Text>
                      )}
                    </VStack>
                  </HStack>

                  <Divider />

                  <StatGroup>
                    <Stat>
                      <StatLabel>Experience</StatLabel>
                      <StatNumber>{freelancer.experience}+ years</StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Location</StatLabel>
                      <StatNumber fontSize="md">
                        {freelancer.location || 'Not specified'}
                      </StatNumber>
                    </Stat>
                  </StatGroup>

                  <Box>
                    <Text fontWeight="bold" mb={1}>About</Text>
                    <Text noOfLines={3} color="gray.600">
                      {freelancer.description}
                    </Text>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" mb={2}>Skills</Text>
                    <SimpleGrid columns={2} spacing={2}>
                      {freelancer.skills?.slice(0, 6).map(skill => (
                        <Badge
                          key={skill}
                          colorScheme="purple"
                          p={1}
                          textAlign="center"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {freelancer.skills?.length > 6 && (
                        <Badge colorScheme="gray" p={1} textAlign="center">
                          +{freelancer.skills.length - 6} more
                        </Badge>
                      )}
                    </SimpleGrid>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" mb={2}>Expertise Domains</Text>
                    <SimpleGrid columns={2} spacing={2}>
                      {freelancer.domains?.map(domain => (
                        <Badge
                          key={domain}
                          colorScheme="green"
                          p={1}
                          textAlign="center"
                        >
                          {DOMAIN_NAMES[domain]}
                        </Badge>
                      ))}
                    </SimpleGrid>
                  </Box>

                  <Button colorScheme="blue" size="sm">
                    View Full Profile
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>

        {filteredFreelancers.length === 0 && (
          <Box textAlign="center" py={8}>
            <Text color="gray.600">No freelancers found matching your criteria</Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
}
