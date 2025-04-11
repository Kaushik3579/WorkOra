import { useState, useEffect, useRef } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Avatar,
  Flex,
  useToast,
} from '@chakra-ui/react';
import { db } from '../config/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

export default function Chat({ projectId, currentUser, otherUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const toast = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Subscribe to messages for this project
    const q = query(
      collection(db, 'messages'),
      where('projectId', '==', projectId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messageList = [];
      querySnapshot.forEach((doc) => {
        messageList.push({ id: doc.id, ...doc.data() });
      });
      setMessages(messageList);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [projectId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        projectId,
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        message: newMessage,
        timestamp: serverTimestamp(),
      });

      setNewMessage('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      w="100%"
      h="600px"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
    >
      <VStack h="100%" spacing={0}>
        {/* Messages Area */}
        <Box
          flex="1"
          w="100%"
          overflowY="auto"
          p={4}
          bg="gray.50"
        >
          <VStack spacing={4} align="stretch">
            {messages.map((msg) => (
              <Flex
                key={msg.id}
                justify={msg.senderId === currentUser.uid ? 'flex-end' : 'flex-start'}
              >
                <Box
                  maxW="70%"
                  bg={msg.senderId === currentUser.uid ? 'blue.500' : 'gray.200'}
                  color={msg.senderId === currentUser.uid ? 'white' : 'black'}
                  borderRadius="lg"
                  px={4}
                  py={2}
                >
                  {msg.senderId !== currentUser.uid && (
                    <Text fontSize="xs" fontWeight="bold" mb={1}>
                      {msg.senderName}
                    </Text>
                  )}
                  <Text>{msg.message}</Text>
                  <Text fontSize="xs" opacity={0.8} textAlign="right">
                    {msg.timestamp?.toDate().toLocaleTimeString()}
                  </Text>
                </Box>
              </Flex>
            ))}
            <div ref={messagesEndRef} />
          </VStack>
        </Box>

        {/* Message Input */}
        <Box w="100%" p={4} bg="white" borderTopWidth="1px">
          <form onSubmit={sendMessage}>
            <HStack>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                size="md"
              />
              <Button type="submit" colorScheme="blue">
                Send
              </Button>
            </HStack>
          </form>
        </Box>
      </VStack>
    </Box>
  );
}
