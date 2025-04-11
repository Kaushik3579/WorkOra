import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBh9iyziMUvO7id6SED5K2H7HhcJKjaOmg",
  authDomain: "workora-831e0.firebaseapp.com",
  projectId: "workora-831e0",
  storageBucket: "workora-831e0.firebasestorage.app",
  messagingSenderId: "369584222346",
  appId: "1:369584222346:web:2401988653a0832f2cfd73",
  measurementId: "G-SX5Z2VMC6R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Configure Google provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configure Apple provider
export const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');
