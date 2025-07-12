import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  // These would normally come from environment variables
  // For demo purposes, using placeholder values
  apiKey: "demo-api-key",
  authDomain: "complex-connect-demo.firebaseapp.com",
  projectId: "complex-connect-demo",
  storageBucket: "complex-connect-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Configure Google provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});