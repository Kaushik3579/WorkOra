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
  const userType = location.state?.userType || sessionStorage.getItem('selectedUserType');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (!userType) {
          navigate('/user-type');
          return;
        }
        
        // Existing user check
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          navigate(`/${userType}/dashboard`);
        } else {
          // New user flow
          if (userType === 'freelancer') {
            navigate('/freelancer/details');
          } else {
            navigate(`/${userType}/dashboard`);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [userType]);

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
      const result = await signInWithPopup(auth, googleProvider);
      
      const userType = location.state?.userType || 
                      sessionStorage.getItem('selectedUserType') ||
                      localStorage.getItem('selectedUserType');
      
      if (!userType) {
        navigate('/user-type');
        return;
      }
      
      // Check if user exists in either collection
      const [userDoc, freelancerDoc] = await Promise.all([
        getDoc(doc(db, 'users', result.user.uid)),
        getDoc(doc(db, 'freelancers', result.user.uid))
      ]);
      
      if (!userDoc.exists()) {
        // New user - create basic record
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          userType,
          createdAt: serverTimestamp()
        });
        
        if (userType === 'freelancer' && !freelancerDoc.exists()) {
          // New freelancer needs to complete profile
          navigate('/freelancer/details', { replace: true });
          return;
        }
      }
      
      // Existing user or completed profile
      navigate(`/${userType}/dashboard`, { replace: true });
      
    } catch (error) {
      toast({
        title: 'Login Error',
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
