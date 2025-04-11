import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack, 
  SimpleGrid, 
  Card, 
  CardBody, 
  Stat, 
  StatLabel, 
  StatNumber, 
  StatHelpText, 
  Button, 
  Badge, 
  Progress, 
  IconButton, 
  Divider, 
  useToast
} from '@chakra-ui/react';
import { CheckCircle, DollarSign, Calendar, BarChart2, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { auth, db } from '../../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function FreelancerDashboard() {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeProjects: 0,
    completedProjects: 0,
    pendingPayments: 0
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (auth.currentUser) {
          // Fetch projects
          const projectsQuery = query(
            collection(db, 'projects'),
            where('freelancerId', '==', auth.currentUser.uid)
          );
          const projectsSnapshot = await getDocs(projectsQuery);
          
          let active = 0;
          let completed = 0;
          const projectList = projectsSnapshot.docs.map(doc => {
            const data = doc.data();
            if (data.status === 'active' || data.status === 'in-progress') {
              active++;
            } else if (data.status === 'completed') {
              completed++;
            }
            return { id: doc.id, ...data };
          });
          
          setProjects(projectList);
          
          // Fetch payments
          const paymentsQuery = query(
            collection(db, 'payments'),
            where('freelancerId', '==', auth.currentUser.uid)
          );
          const paymentsSnapshot = await getDocs(paymentsQuery);
          
          let totalEarnings = 0;
          let pending = 0;
          paymentsSnapshot.forEach(doc => {
            const payment = doc.data();
            if (payment.status === 'completed') {
              totalEarnings += payment.amount;
            } else if (payment.status === 'pending') {
              pending += payment.amount;
            }
          });
          
          setStats({
            totalEarnings,
            activeProjects: active,
            completedProjects: completed,
            pendingPayments: pending
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);

  const handleViewProject = (projectId) => {
    // Navigate to project details page - implementation depends on routing
    console.log(`View project ${projectId}`);
  };

  const handleRequestPayment = (projectId) => {
    // Trigger payment request workflow
    toast({
      title: 'Payment Requested',
      description: 'Payment request sent for project',
      status: 'success',
      duration: 3000,
      isClosable: true
    });
  };

  return (
    <Box p={6} maxW="container.xl" mx="auto">
      <VStack spacing={8} align="stretch">
        <HStack justify="space-between">
          <Heading>Freelancer Dashboard</Heading>
          <Text color="gray.500">{new Date().toLocaleDateString()}</Text>
        </HStack>

        {/* Stats Overview */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Earnings</StatLabel>
                <StatNumber>${stats.totalEarnings.toFixed(2)}</StatNumber>
                <StatHelpText>All time</StatHelpText>
              </Stat>
              <DollarSign size={24} color="green" />
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Active Projects</StatLabel>
                <StatNumber>{stats.activeProjects}</StatNumber>
                <StatHelpText>In progress</StatHelpText>
              </Stat>
              <BarChart2 size={24} color="blue" />
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Completed Projects</StatLabel>
                <StatNumber>{stats.completedProjects}</StatNumber>
                <StatHelpText>All time</StatHelpText>
              </Stat>
              <CheckCircle size={24} color="green" />
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Pending Payments</StatLabel>
                <StatNumber>${stats.pendingPayments.toFixed(2)}</StatNumber>
                <StatHelpText>Awaiting</StatHelpText>
              </Stat>
              <Calendar size={24} color="orange" />
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Active Projects */}
        <Box>
          <Heading size="md" mb={4}>Active Projects</Heading>
          <VStack spacing={4} align="stretch">
            {projects.length > 0 ? (
              projects
                .filter(p => p.status === 'active' || p.status === 'in-progress')
                .map(project => (
                  <Card key={project.id} variant="outline">
                    <CardBody>
                      <HStack justify="space-between" align="flex-start">
                        <Box>
                          <Heading size="sm">{project.title || 'Untitled Project'}</Heading>
                          <Text color="gray.500">Client: {project.clientName || 'N/A'}</Text>
                          <Text fontSize="sm">Due: {project.dueDate || 'Not set'}</Text>
                          {project.progress && (
                            <Box mt={2}>
                              <Text fontSize="xs">Progress: {project.progress}%</Text>
                              <Progress value={project.progress} size="sm" />
                            </Box>
                          )}
                        </Box>
                        <HStack>
                          <Badge 
                            colorScheme={project.status === 'active' ? 'blue' : 'yellow'}
                          >
                            {project.status}
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleViewProject(project.id)}
                          >
                            View Details
                          </Button>
                          {project.status === 'in-progress' && (
                            <Button 
                              size="sm" 
                              colorScheme="green"
                              onClick={() => handleRequestPayment(project.id)}
                            >
                              Request Payment
                            </Button>
                          )}
                        </HStack>
                      </HStack>
                    </CardBody>
                  </Card>
                ))
            ) : (
              <Box textAlign="center" p={6} border="1px dashed" borderColor="gray.300" borderRadius="md">
                <Text color="gray.500">No active projects. Find new opportunities!</Text>
                <Button mt={4} colorScheme="blue">Browse Projects</Button>
              </Box>
            )}
          </VStack>
        </Box>

        {/* Quick Actions */}
        <Box>
          <Heading size="md" mb={4}>Quick Actions</Heading>
          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={4}>
            <Button leftIcon={<FileText size={18} />} variant="outline">
              Create Proposal
            </Button>
            <Button leftIcon={<DollarSign size={18} />} variant="outline">
              View Payments
            </Button>
            <Button leftIcon={<Calendar size={18} />} variant="outline">
              Schedule Meeting
            </Button>
          </SimpleGrid>
        </Box>

        {/* Recent Activity */}
        <Box>
          <Heading size="md" mb={4}>Recent Activity</Heading>
          <Card>
            <CardBody>
              <VStack spacing={4} align="stretch" divider={<Divider />}>
                <HStack justify="space-between">
                  <Box>
                    <Text fontWeight="bold">Project Completed: Website Redesign</Text>
                    <Text fontSize="sm" color="gray.500">Completed on {new Date().toLocaleDateString()}</Text>
                  </Box>
                  <Text color="green.500">+$1,200</Text>
                </HStack>
                <HStack justify="space-between">
                  <Box>
                    <Text fontWeight="bold">Payment Received: App Development</Text>
                    <Text fontSize="sm" color="gray.500">Received on {new Date(Date.now() - 86400000 * 3).toLocaleDateString()}</Text>
                  </Box>
                  <Text color="green.500">+$800</Text>
                </HStack>
                <HStack justify="space-between">
                  <Box>
                    <Text fontWeight="bold">New Project Started: E-commerce Site</Text>
                    <Text fontSize="sm" color="gray.500">Started on {new Date(Date.now() - 86400000 * 5).toLocaleDateString()}</Text>
                  </Box>
                  <Text color="blue.500">In Progress</Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </VStack>
    </Box>
  );
}
