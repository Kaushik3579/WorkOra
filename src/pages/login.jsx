import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  VStack,
  Text,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { auth, db, googleProvider } from '../config/firebase';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Get user type from multiple sources with priority
  const userType = location.state?.userType || 
                  sessionStorage.getItem('selectedUserType') || 
                  localStorage.getItem('selectedUserType');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          // Existing user - go to dashboard
          const userData = userDoc.data();
          redirectToDashboard(userData.userType);
        } else if (userType) {
          // New user - create account with selected type
          await createNewUser(user);
          redirectToDashboard(userType);
        } else {
          // No type selected - go back to selection
          navigate('/');
        }
      }
    });

    return () => unsubscribe();
  }, [userType]);

  const redirectToDashboard = (type) => {
    // Clear storage after successful redirect
    sessionStorage.removeItem('selectedUserType');
    localStorage.removeItem('selectedUserType');

    switch(type) {
      case 'admin': 
        navigate('/admin/dashboard', { replace: true }); 
        break;
      case 'client': 
        navigate('/client/dashboard', { replace: true }); 
        break;
      case 'freelancer': 
        navigate('/freelancer/dashboard', { replace: true }); 
        break;
      default: 
        navigate('/', { replace: true });
    }
  };

  const createNewUser = async (user) => {
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      userType: userType,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      displayName: user.displayName || '',
      photoURL: user.photoURL || ''
    });
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      toast({
        title: 'Login Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
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
        
        {!userType && (
          <Button 
            onClick={() => navigate('/')} 
            variant="outline"
            size="lg"
          >
            Back to Selection
          </Button>
        )}
      </VStack>
    </Box>
  );
}
