import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Card,
  CardBody,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Select,
  Avatar,
  Wrap,
  WrapItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tag,
} from '@chakra-ui/react';
import { Users, FileText, CheckCircle, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function ClientDashboard() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedField, setSelectedField] = useState('all');
  const [freelancers, setFreelancers] = useState([]);
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);

  // Mock data - replace with real data from backend
  const stats = {
    activeProjects: 2,
    totalFreelancers: 5,
    completedProjects: 8,
  };

  const projects = [
    {
      id: 1,
      title: 'E-commerce Website',
      freelancer: 'John Doe',
      status: 'in-progress',
      deadline: '2025-05-15',
      budget: 3500,
    },
    {
      id: 2,
      title: 'Mobile App Design',
      freelancer: 'Jane Smith',
      status: 'review',
      deadline: '2025-04-30',
      budget: 2000,
    },
  ];

  const fields = [
    'All Fields',
    'Web Development',
    'Mobile Development',
    'UI/UX Design',
    'Graphic Design',
    'Content Writing',
    'Digital Marketing',
  ];

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const freelancersRef = collection(db, 'users');
        let q = query(freelancersRef, where('userType', '==', 'freelancer'));
        
        if (selectedField !== 'all') {
          q = query(q, where('fields', 'array-contains', selectedField));
        }

        const querySnapshot = await getDocs(q);
        const freelancerData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFreelancers(freelancerData);
      } catch (error) {
        console.error('Error fetching freelancers:', error);
      }
    };

    fetchFreelancers();
  }, [selectedField]);

  const handleFreelancerClick = (freelancer) => {
    setSelectedFreelancer(freelancer);
    onOpen();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Client Dashboard</Heading>
          <Button colorScheme="blue" onClick={() => navigate('/projects/create')}>
            Post New Project
          </Button>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Active Projects</StatLabel>
                <HStack>
                  <FileText size={20} />
                  <StatNumber>{stats.activeProjects}</StatNumber>
                </HStack>
                <StatHelpText>Currently in progress</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Hired Freelancers</StatLabel>
                <HStack>
                  <Users size={20} />
                  <StatNumber>{stats.totalFreelancers}</StatNumber>
                </HStack>
                <StatHelpText>Working with you</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Completed Projects</StatLabel>
                <HStack>
                  <CheckCircle size={20} />
                  <StatNumber>{stats.completedProjects}</StatNumber>
                </HStack>
                <StatHelpText>Successfully delivered</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Freelancer Browser Section */}
        <Box>
          <Heading size="md" mb={4}>Browse Freelancers</Heading>
          <Select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            mb={4}
          >
            <option value="all">All Fields</option>
            {fields.map(field => (
              <option key={field} value={field.toLowerCase()}>
                {field}
              </option>
            ))}
          </Select>

          <Wrap spacing={4}>
            {freelancers.map(freelancer => (
              <WrapItem key={freelancer.id}>
                <Card
                  w="300px"
                  cursor="pointer"
                  onClick={() => handleFreelancerClick(freelancer)}
                  _hover={{ shadow: 'lg' }}
                >
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <HStack>
                        <Avatar
                          size="md"
                          name={freelancer.name}
                          src={freelancer.avatar}
                        />
                        <VStack align="start" spacing={0}>
                          <Heading size="sm">{freelancer.name}</Heading>
                          <Text color="gray.600" fontSize="sm">
                            {freelancer.title || 'Freelancer'}
                          </Text>
                        </VStack>
                      </HStack>
                      <Wrap>
                        {freelancer.skills?.slice(0, 3).map(skill => (
                          <Tag key={skill} size="sm" colorScheme="blue">
                            {skill}
                          </Tag>
                        ))}
                      </Wrap>
                      <HStack>
                        <Star size={16} fill="gold" stroke="gold" />
                        <Text>{freelancer.rating || '4.5'}</Text>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </WrapItem>
            ))}
          </Wrap>
        </Box>

        {/* Projects Section */}
        <Box>
          <Heading size="md" mb={4}>Your Projects</Heading>
          <Grid gap={4}>
            {projects.map(project => (
              <Card key={project.id}>
                <CardBody>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={2}>
                      <Heading size="sm">{project.title}</Heading>
                      <Text color="gray.600">Freelancer: {project.freelancer}</Text>
                      <Text fontSize="sm">Due: {project.deadline}</Text>
                      <Text fontWeight="bold">Budget: ${project.budget}</Text>
                    </VStack>
                    <VStack align="end" spacing={2}>
                      <Badge
                        colorScheme={project.status === 'in-progress' ? 'blue' : 'orange'}
                      >
                        {project.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        View Details
                      </Button>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        </Box>

        {/* Freelancer Details Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Freelancer Profile</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedFreelancer && (
                <VStack align="start" spacing={4}>
                  <HStack spacing={4}>
                    <Avatar
                      size="xl"
                      name={selectedFreelancer.name}
                      src={selectedFreelancer.avatar}
                    />
                    <VStack align="start" spacing={1}>
                      <Heading size="md">{selectedFreelancer.name}</Heading>
                      <Text color="gray.600">{selectedFreelancer.title}</Text>
                      <HStack>
                        <Star size={16} fill="gold" stroke="gold" />
                        <Text>{selectedFreelancer.rating || '4.5'} ({selectedFreelancer.reviewCount || '25'} reviews)</Text>
                      </HStack>
                    </VStack>
                  </HStack>

                  <Box>
                    <Text fontWeight="bold" mb={2}>Skills</Text>
                    <Wrap>
                      {selectedFreelancer.skills?.map(skill => (
                        <Tag key={skill} colorScheme="blue">
                          {skill}
                        </Tag>
                      ))}
                    </Wrap>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" mb={2}>About</Text>
                    <Text>{selectedFreelancer.bio || 'Professional freelancer with expertise in various technologies and a passion for delivering high-quality work.'}</Text>
                  </Box>

                  <Button
                    colorScheme="blue"
                    width="100%"
                    onClick={() => {
                      onClose();
                      navigate('/projects/create', {
                        state: { selectedFreelancer: selectedFreelancer.id }
                      });
                    }}
                  >
                    Hire {selectedFreelancer.name.split(' ')[0]}
                  </Button>
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Container>
  );
}
