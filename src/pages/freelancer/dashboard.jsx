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
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
} from '@chakra-ui/react';
import { Activity, Briefcase, DollarSign } from 'lucide-react';

export default function FreelancerDashboard() {
  // Mock data - replace with real data from backend
  const stats = {
    earnings: 2500,
    activeProjects: 3,
    completedProjects: 12,
  };

  const activeProjects = [
    {
      id: 1,
      title: 'Website Development',
      client: 'Tech Corp',
      dueDate: '2025-05-01',
      status: 'in-progress',
    },
    {
      id: 2,
      title: 'Mobile App UI Design',
      client: 'StartupX',
      dueDate: '2025-04-20',
      status: 'review',
    },
  ];

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">Welcome back, John!</Heading>
          <Text color="gray.500">{new Date().toLocaleDateString()}</Text>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Earnings</StatLabel>
                <HStack>
                  <DollarSign size={20} />
                  <StatNumber>${stats.earnings}</StatNumber>
                </HStack>
                <StatHelpText>This month</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Active Projects</StatLabel>
                <HStack>
                  <Activity size={20} />
                  <StatNumber>{stats.activeProjects}</StatNumber>
                </HStack>
                <StatHelpText>In progress</StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Completed Projects</StatLabel>
                <HStack>
                  <Briefcase size={20} />
                  <StatNumber>{stats.completedProjects}</StatNumber>
                </HStack>
                <StatHelpText>All time</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Box>
          <Heading size="md" mb={4}>Active Projects</Heading>
          <Grid gap={4}>
            {activeProjects.map(project => (
              <Card key={project.id}>
                <CardBody>
                  <HStack justify="space-between">
                    <VStack align="start" spacing={2}>
                      <Heading size="sm">{project.title}</Heading>
                      <Text color="gray.600">Client: {project.client}</Text>
                      <Text fontSize="sm">Due: {project.dueDate}</Text>
                    </VStack>
                    <Badge
                      colorScheme={project.status === 'in-progress' ? 'blue' : 'orange'}
                    >
                      {project.status}
                    </Badge>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </Grid>
        </Box>
      </VStack>
    </Container>
  );
}
