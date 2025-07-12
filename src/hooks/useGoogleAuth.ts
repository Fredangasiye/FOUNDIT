import { useState, useEffect } from 'react';
import { signInWithRedirect, getRedirectResult, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { User } from '../types';

export const useGoogleAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<User | null>(null);

  // Check for redirect result on component mount
  useEffect(() => {
    const checkRedirectResult = async () => {
      setLoading(true);
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          const firebaseUser = result.user;
          
          // Create user object from Google data
          const user: User = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || '',
            unitNumber: '', // Will need to be filled in profile
            phone: firebaseUser.phoneNumber || '',
            password: '', // Not needed for Google auth
            profilePhoto: firebaseUser.photoURL || '',
            authProvider: 'google',
            email: firebaseUser.email || ''
          };

          setGoogleUser(user);
        }
      } catch (error: any) {
        console.error('Google redirect result error:', error);
        setError(error.message || 'Failed to complete Google sign-in');
      } finally {
        setLoading(false);
      }
    };

    checkRedirectResult();
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await signInWithRedirect(auth, googleProvider);
      // The redirect will happen, and the result will be handled in useEffect
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setError(error.message || 'Failed to initiate Google sign-in');
      setLoading(false);
    }
  };

  return {
    signInWithGoogle,
    loading,
    error,
    googleUser
  };
};