import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  VStack,
  Text,
  Divider,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  HStack
} from '@chakra-ui/react';
import { auth, db, googleProvider } from '../config/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import DomainSelectionModal from '../components/DomainSelectionModal';
import UserDetailsForm from '../components/UserDetailsForm';

export default function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showDomainModal, setShowDomainModal] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [tempUserData, setTempUserData] = useState(null);
  const [userType, setUserType] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigateToUserDashboard = (type) => {
    switch (type) {
      case 'admin':
        navigate('/admin/dashboard');
        break;
      case 'client':
        navigate('/client/dashboard');
        break;
      case 'freelancer':
        navigate('/freelancer/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const createNewUser = async (userData, userDetails, domains = []) => {
    await setDoc(doc(db, 'users', userData.uid), {
      email: userData.email,
      userType: userType,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      displayName: userDetails.fullName,
      photoURL: userData.photoURL || '',
      description: userDetails.description,
      skills: userDetails.skills.split(',').map(skill => skill.trim()),
      hourlyRate: userDetails.hourlyRate || '',
      phone: userDetails.phone || '',
      location: userDetails.location || '',
      experience: userDetails.experience || '',
      domain: userDetails.domain || '',
      ...(userType === 'freelancer' && { domains }),
    });
    
    toast({
      title: 'Account created',
      description: 'Welcome to Workora!',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    
    navigateToUserDashboard(userType);
  };

  const handleUserDetails = async (userDetails) => {
    if (tempUserData) {
      if (userType === 'freelancer') {
        setShowDetailsForm(false);
        setShowDomainModal(true);
        setTempUserData({
          ...tempUserData,
          userDetails
        });
      } else {
        await createNewUser(tempUserData, userDetails);
        setTempUserData(null);
        setShowDetailsForm(false);
      }
    }
  };

  const handleDomainSelection = async (selectedDomains) => {
    if (tempUserData && tempUserData.userDetails) {
      await createNewUser(tempUserData, tempUserData.userDetails, selectedDomains);
      setTempUserData(null);
    }
    setShowDomainModal(false);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));

      if (!userDoc.exists()) {
        // New user - create profile with selected type
        if (!userType) {
          navigate('/');
          return;
        }

        setTempUserData(result.user);
        setShowDetailsForm(true);
        setIsLoading(false);
        return;
      } else {
        // Existing user - update last login and redirect
        const userData = userDoc.data();
        await setDoc(doc(db, 'users', result.user.uid), {
          lastLogin: serverTimestamp()
        }, { merge: true });
        
        navigateToUserDashboard(userData.userType);
      }
    } catch (error) {
      let errorMessage = error.message;
      if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Please allow popups for Google sign-in';
      }
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      if (!showDetailsForm && !showDomainModal) {
        setIsLoading(false);
      }
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('Account not found');
      }

      const userData = userDoc.data();
      
      // Update last login
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        lastLogin: serverTimestamp()
      }, { merge: true });

      navigateToUserDashboard(userData.userType);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={8} maxWidth="400px" mx="auto">
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          {userType ? `Sign in as ${userType}` : 'Sign In'}
        </Text>

        <Button
          onClick={handleGoogleLogin}
          isLoading={isLoading}
          loadingText="Signing in..."
          size="lg"
          colorScheme="blue"
        >
          Continue with Google
        </Button>

        <HStack>
          <Divider />
          <Text fontSize="sm" whiteSpace="nowrap" color="gray.500">
            or use email
          </Text>
          <Divider />
        </HStack>

        <form onSubmit={handleEmailLogin}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="100%"
              isLoading={isLoading}
            >
              Sign In with Email
            </Button>
          </VStack>
        </form>
      </VStack>

      <Modal isOpen={showDetailsForm} onClose={() => {}} size="xl">
        <ModalOverlay />
        <ModalContent p={6}>
          <ModalBody>
            <UserDetailsForm
              userType={userType}
              onSubmit={handleUserDetails}
              initialData={{
                fullName: tempUserData?.displayName || '',
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <DomainSelectionModal
        isOpen={showDomainModal}
        onClose={() => setShowDomainModal(false)}
        onSubmit={handleDomainSelection}
      />
    </Box>
  );
}
