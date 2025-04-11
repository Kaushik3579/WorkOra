import { useState, useEffect, useRef } from 'react';
import { 
  Box, Button, Flex, Input, Text, Avatar, 
  VStack, HStack, useDisclosure, IconButton,
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, 
  DrawerContent, DrawerCloseButton, useToast,
  Badge, Spinner
} from '@chakra-ui/react';
import { FiMessageSquare, FiX, FiPaperclip, FiSend } from 'react-icons/fi';
import { auth, db, storage } from '../config/firebase';
import { 
  collection, addDoc, serverTimestamp, 
  onSnapshot, query, orderBy, updateDoc,
  doc, arrayUnion
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ChatWindow({ recipientId, recipientName }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [file, setFile] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const messagesEndRef = useRef(null);
  const toast = useToast();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (recipientId && auth.currentUser?.uid) {
      const chatId = [auth.currentUser.uid, recipientId].sort().join('_');
      const q = query(
        collection(db, 'chats', chatId, 'messages'),
        orderBy('timestamp')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMessages(msgs);
        scrollToBottom();
        
        // Mark messages as read
        const unread = msgs.filter(
          msg => msg.senderId === recipientId && !msg.read
        );
        
        if (unread.length > 0) {
          updateDoc(doc(db, 'chats', chatId), {
            lastRead: serverTimestamp()
          });
        }
      });
      
      return () => unsubscribe();
    }
  }, [recipientId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!message.trim() && !file) || !recipientId || !auth.currentUser) return;
    
    setIsSending(true);
    const chatId = [auth.currentUser.uid, recipientId].sort().join('_');
    
    try {
      let fileUrl = '';
      if (file) {
        const storageRef = ref(storage, `chats/${chatId}/${file.name}`);
        await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(storageRef);
      }
      
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: message,
        senderId: auth.currentUser.uid,
        recipientId,
        timestamp: serverTimestamp(),
        read: false,
        ...(fileUrl && { fileUrl, fileName: file.name })
      });
      
      setMessage('');
      setFile(null);
    } catch (error) {
      toast({
        title: 'Error sending message',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <>
      <Box position="fixed" bottom="6" left="6">
        <IconButton
          icon={isOpen ? <FiX /> : <FiMessageSquare />}
          onClick={isOpen ? onClose : onOpen}
          colorScheme="blue"
          size="lg"
          isRound
          aria-label="Open chat"
        />
        {messages.some(msg => msg.senderId === recipientId && !msg.read) && (
          <Badge 
            colorScheme="red" 
            borderRadius="full" 
            position="absolute" 
            top="-5px" 
            right="-5px"
          >
            New
          </Badge>
        )}
      </Box>
      
      <Drawer placement="right" onClose={onClose} isOpen={isOpen} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Chat with {recipientName || 'User'}
            {isTyping && (
              <Text fontSize="sm" color="gray.500">
                {recipientName || 'User'} is typing...
              </Text>
            )}
          </DrawerHeader>
          <DrawerBody>
            <VStack h="70vh" overflowY="auto" spacing={4} align="stretch" pb={4}>
              {messages.map((msg) => (
                <Flex 
                  key={msg.id} 
                  justify={msg.senderId === auth.currentUser?.uid ? 'flex-end' : 'flex-start'}
                >
                  <Box 
                    bg={msg.senderId === auth.currentUser?.uid ? 'blue.100' : 'gray.100'}
                    p={3} 
                    borderRadius="lg"
                    maxW="80%"
                  >
                    {msg.text && <Text>{msg.text}</Text>}
                    {msg.fileUrl && (
                      <Box mt={2}>
                        <a href={msg.fileUrl} target="_blank" rel="noreferrer">
                          <Button size="sm" leftIcon={<FiPaperclip />} variant="outline">
                            {msg.fileName}
                          </Button>
                        </a>
                      </Box>
                    )}
                    <Text fontSize="xs" color="gray.500" mt={1} textAlign="right">
                      {new Date(msg.timestamp?.toDate()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </Text>
                  </Box>
                </Flex>
              ))}
              <div ref={messagesEndRef} />
            </VStack>
            
            <form onSubmit={sendMessage}>
              <VStack mt={4}>
                <HStack w="full">
                  <Input 
                    as="input"
                    type="file"
                    onChange={handleFileChange}
                    display="none"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <IconButton
                      icon={<FiPaperclip />}
                      aria-label="Attach file"
                      variant="outline"
                      as="span"
                    />
                  </label>
                  <Input 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    flex={1}
                  />
                  <Button 
                    type="submit" 
                    colorScheme="blue"
                    isLoading={isSending}
                    rightIcon={<FiSend />}
                  >
                    Send
                  </Button>
                </HStack>
                {file && (
                  <HStack w="full" justify="space-between">
                    <Text fontSize="sm" isTruncated>{file.name}</Text>
                    <Button size="sm" onClick={() => setFile(null)}>Remove</Button>
                  </HStack>
                )}
              </VStack>
            </form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
