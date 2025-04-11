import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Card,
  CardBody,
  Badge,
  Button,
  Input,
  Select,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProjectList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  // Mock data - replace with API call
  const projects = [
    {
      id: 1,
      title: 'E-commerce Website Development',
      description: 'Need a full-stack developer to build an e-commerce platform with React and Node.js',
      budget: '3000-5000',
      category: 'Web Development',
      skills: ['React', 'Node.js', 'MongoDB'],
      postedDate: '2025-04-10',
    },
    {
      id: 2,
      title: 'Mobile App UI/UX Design',
      description: 'Looking for a UI/UX designer to create modern and intuitive mobile app interfaces',
      budget: '1500-2500',
      category: 'Design',
      skills: ['Figma', 'UI/UX', 'Mobile Design'],
      postedDate: '2025-04-09',
    },
    {
      id: 3,
      title: 'Content Writing for Tech Blog',
      description: 'Need experienced tech writers for creating engaging blog content',
      budget: '500-1000',
      category: 'Writing',
      skills: ['Technical Writing', 'SEO', 'Content Strategy'],
      postedDate: '2025-04-08',
    },
  ];

  const cardBg = useColorModeValue('white', 'gray.700');

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Available Projects</Heading>
          <Button colorScheme="blue" onClick={() => navigate('/projects/create')}>
            Post a Project
          </Button>
        </HStack>

        <HStack spacing={4}>
          <Box flex={1} position="relative">
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              pl={10}
            />
            <Box position="absolute" left={3} top={3}>
              <Search size={20} />
            </Box>
          </Box>
          <Box width="200px">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              icon={<Filter />}
            >
              <option value="all">All Categories</option>
              <option value="web">Web Development</option>
              <option value="mobile">Mobile Development</option>
              <option value="design">Design</option>
              <option value="writing">Writing</option>
            </Select>
          </Box>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {projects.map((project) => (
            <Card
              key={project.id}
              bg={cardBg}
              onClick={() => navigate(`/projects/${project.id}`)}
              cursor="pointer"
              _hover={{ transform: 'translateY(-2px)', transition: 'all 0.2s' }}
            >
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Heading size="md">{project.title}</Heading>
                    <Badge colorScheme="green">${project.budget}</Badge>
                  </HStack>
                  <Text noOfLines={2}>{project.description}</Text>
                  <HStack>
                    {project.skills.map((skill) => (
                      <Badge key={skill} colorScheme="blue">
                        {skill}
                      </Badge>
                    ))}
                  </HStack>
                  <HStack justify="space-between">
                    <Text color="gray.500">
                      Posted: {new Date(project.postedDate).toLocaleDateString()}
                    </Text>
                    <Badge colorScheme="purple">{project.category}</Badge>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
