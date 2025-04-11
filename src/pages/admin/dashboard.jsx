import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  useToast,
  Card,
  CardBody,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Users, UserCheck, Clock } from 'lucide-react';

export default function AdminDashboard() {
  const [pendingFreelancers, setPendingFreelancers] = useState([]);
  const [stats, setStats] = useState({
    totalFreelancers: 0,
    pendingApprovals: 0,
    activeProjects: 0,
  });
  const toast = useToast();

  useEffect(() => {
    fetchPendingFreelancers();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const freelancersQuery = query(collection(db, 'users'), where('userType', '==', 'freelancer'));
      const freelancersSnapshot = await getDocs(freelancersQuery);
      
      const pendingQuery = query(
        collection(db, 'users'),
        where('userType', '==', 'freelancer'),
        where('isApproved', '==', false)
      );
      const pendingSnapshot = await getDocs(pendingQuery);

      const projectsQuery = query(
        collection(db, 'projects'),
        where('status', '==', 'active')
      );
      const projectsSnapshot = await getDocs(projectsQuery);

      setStats({
        totalFreelancers: freelancersSnapshot.size,
        pendingApprovals: pendingSnapshot.size,
        activeProjects: projectsSnapshot.size,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchPendingFreelancers = async () => {
    try {
      const q = query(
        collection(db, 'users'),
        where('userType', '==', 'freelancer'),
        where('isApproved', '==', false)
      );
      
      const querySnapshot = await getDocs(q);
      const freelancers = [];
      querySnapshot.forEach((doc) => {
        freelancers.push({ id: doc.id, ...doc.data() });
      });
      
      setPendingFreelancers(freelancers);
    } catch (error) {
      console.error('Error fetching pending freelancers:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch pending freelancers',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleApproval = async (freelancerId, approve) => {
    try {
      await updateDoc(doc(db, 'users', freelancerId), {
        isApproved: approve,
        status: approve ? 'approved' : 'rejected',
        approvalDate: new Date().toISOString(),
      });

      toast({
        title: approve ? 'Freelancer Approved' : 'Freelancer Rejected',
        status: approve ? 'success' : 'info',
        duration: 5000,
        isClosable: true,
      });

      // Refresh the list and stats
      fetchPendingFreelancers();
      fetchStats();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update freelancer status',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="lg">Admin Dashboard</Heading>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Total Freelancers</StatLabel>
                <HStack>
                  <Users size={20} />
                  <StatNumber>{stats.totalFreelancers}</StatNumber>
                </HStack>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Pending Approvals</StatLabel>
                <HStack>
                  <Clock size={20} />
                  <StatNumber>{stats.pendingApprovals}</StatNumber>
                </HStack>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Stat>
                <StatLabel>Active Projects</StatLabel>
                <HStack>
                  <UserCheck size={20} />
                  <StatNumber>{stats.activeProjects}</StatNumber>
                </HStack>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Box>
          <Heading size="md" mb={4}>Pending Freelancer Approvals</Heading>
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Skills</Th>
                  <Th>Registration Date</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {pendingFreelancers.map((freelancer) => (
                  <Tr key={freelancer.id}>
                    <Td>{freelancer.name}</Td>
                    <Td>{freelancer.email}</Td>
                    <Td>
                      <HStack>
                        {freelancer.skills?.map((skill) => (
                          <Badge key={skill} colorScheme="blue">
                            {skill}
                          </Badge>
                        ))}
                      </HStack>
                    </Td>
                    <Td>
                      {new Date(freelancer.registrationDate).toLocaleDateString()}
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => handleApproval(freelancer.id, true)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleApproval(freelancer.id, false)}
                        >
                          Reject
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
                {pendingFreelancers.length === 0 && (
                  <Tr>
                    <Td colSpan={5} textAlign="center">
                      No pending approvals
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </VStack>
    </Container>
  );
}
