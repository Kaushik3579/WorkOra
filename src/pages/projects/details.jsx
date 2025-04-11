import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  Divider,
  useToast,
  Card,
  CardBody,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import { db, auth } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Chat from '../../components/Chat';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const toast = useToast();
  const currentUser = auth.currentUser;

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const projectDoc = await getDoc(doc(db, 'projects', id));
      if (projectDoc.exists()) {
        const projectData = projectDoc.data();
        setProject(projectData);

        // Fetch other user's details (client or freelancer)
        const otherUserId = currentUser.uid === projectData.clientId 
          ? projectData.freelancerId 
          : projectData.clientId;
        
        const userDoc = await getDoc(doc(db, 'users', otherUserId));
        if (userDoc.exists()) {
          setOtherUser({ id: userDoc.id, ...userDoc.data() });
        }
      } else {
        toast({
          title: 'Error',
          description: 'Project not found',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch project details',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (!project) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading...</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
        <GridItem>
          <VStack align="stretch" spacing={6}>
            <Box>
              <Heading size="lg">{project.title}</Heading>
              <HStack mt={2}>
                <Badge colorScheme="green">${project.budget}</Badge>
                <Badge colorScheme={
                  project.status === 'active' ? 'blue' :
                  project.status === 'completed' ? 'green' :
                  'orange'
                }>
                  {project.status}
                </Badge>
              </HStack>
            </Box>

            <Card>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Heading size="sm">Description</Heading>
                    <Text mt={2}>{project.description}</Text>
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="sm">Required Skills</Heading>
                    <HStack mt={2} flexWrap="wrap">
                      {project.skills?.map((skill) => (
                        <Badge key={skill} colorScheme="blue">
                          {skill}
                        </Badge>
                      ))}
                    </HStack>
                  </Box>

                  <Divider />

                  <Box>
                    <Heading size="sm">Timeline</Heading>
                    <Text mt={2}>Duration: {project.duration} days</Text>
                    <Text>Posted: {new Date(project.createdAt).toLocaleDateString()}</Text>
                    {project.startDate && (
                      <Text>Started: {new Date(project.startDate).toLocaleDateString()}</Text>
                    )}
                  </Box>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </GridItem>

        <GridItem>
          <VStack align="stretch" spacing={6}>
            <Card>
              <CardBody>
                <VStack align="stretch" spacing={4}>
                  <Heading size="md">Project Communication</Heading>
                  <Text>
                    You are chatting with{' '}
                    <Text as="span" fontWeight="bold">
                      {otherUser?.name}
                    </Text>
                  </Text>
                  <Chat
                    projectId={id}
                    currentUser={currentUser}
                    otherUser={otherUser}
                  />
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  );
}
