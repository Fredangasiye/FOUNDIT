import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  getRedirectResult, 
  User as FirebaseUser, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider, onAuthStateChange } from '../config/firebase';
import { createUser, getUser, getUserByEmail, updateUser } from '../services/firestoreService';
import { User } from '../types';

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check for existing session on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('foundit_currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('foundit_currentUser');
      }
    }
    setLoading(false);
  }, []);

  // Listen for Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Check if user exists in Firestore
          let user = await getUser(firebaseUser.uid);
          
          if (!user) {
            // Create new user from Firebase data
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
              unitNumber: '',
              phone: firebaseUser.phoneNumber || '', // Provide empty string if undefined
              password: '',
              profilePhoto: firebaseUser.photoURL || '',
              authProvider: firebaseUser.providerData[0]?.providerId === 'google.com' ? 'google' : 'local',
              email: firebaseUser.email || ''
            };
            
            await createUser(newUser);
            user = newUser;
          }
          
          setCurrentUser(user);
          localStorage.setItem('foundit_currentUser', JSON.stringify(user));
        } catch (error: any) {
          console.error('Error handling Firebase user:', error);
          setError(error.message);
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('foundit_currentUser');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Remove the redirect result check since we're using popup now
  // useEffect(() => {
  //   const checkRedirectResult = async () => {
  //     try {
  //       const result = await getRedirectResult(auth);
  //       if (result && result.user) {
  //         // The auth state change listener will handle the user
  //         console.log('Google sign-in successful');
  //       }
  //     } catch (error: any) {
  //       console.error('Google redirect result error:', error);
  //       setError(error.message || 'Failed to complete Google sign-in');
  //     }
  //   };

  //   checkRedirectResult();
  // }, []);

  const signInWithGoogle = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      
      // Check if user exists in Firestore
      let user = await getUser(firebaseUser.uid);
      
      if (!user) {
        // Create new user from Google data
        const newUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || '',
          unitNumber: '',
          phone: firebaseUser.phoneNumber || '', // Provide empty string if undefined
          password: '',
          profilePhoto: firebaseUser.photoURL || '',
          authProvider: 'google',
          email: firebaseUser.email || ''
        };
        
        await createUser(newUser);
        user = newUser;
      }
      
      setCurrentUser(user);
      localStorage.setItem('foundit_currentUser', JSON.stringify(user));
      setLoading(false);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setError(error.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Use Firebase's built-in email/password authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // The auth state change listener will handle the user automatically
      setLoading(false);
      return true;
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      setError(error.message || 'Failed to sign in');
      setLoading(false);
      return false;
    }
  };

  const registerUser = async (userData: Omit<User, 'id' | 'profilePhoto'>): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Use Firebase's built-in email/password registration
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const firebaseUser = userCredential.user;
      
      // Create a new user object for Firestore, EXCLUDING the password
      const newUser: User = {
        id: firebaseUser.uid,
        name: userData.name,
        unitNumber: userData.unitNumber || '',
        phone: userData.phone || '', // Provide empty string if undefined
        email: userData.email,
        password: '', // Empty string for type consistency, not stored in Firestore
        profilePhoto: '',
        authProvider: 'local'
      };

      await createUser(newUser);
      // The auth state change listener will handle setting the current user
      setLoading(false);
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register user');
      setLoading(false);
      return false;
    }
  };

  const updateUserProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!currentUser) return false;

    setLoading(true);
    setError(null);

    try {
      const updatedUser = { ...currentUser, ...userData };
      await updateUser(currentUser.id, userData);
      setCurrentUser(updatedUser);
      localStorage.setItem('foundit_currentUser', JSON.stringify(updatedUser));
      setLoading(false);
      return true;
    } catch (error: any) {
      console.error('Profile update error:', error);
      setError(error.message || 'Failed to update profile');
      setLoading(false);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      if (currentUser?.authProvider === 'google') {
        await firebaseSignOut(auth);
      }
      setCurrentUser(null);
      localStorage.removeItem('foundit_currentUser');
      setLoading(false);
    } catch (error: any) {
      console.error('Sign out error:', error);
      setError(error.message || 'Failed to sign out');
      setLoading(false);
    }
  };

  const clearSession = (): void => {
    setCurrentUser(null);
    localStorage.removeItem('foundit_currentUser');
    setError(null);
  };

  return {
    currentUser,
    loading,
    error,
    signInWithGoogle,
    signInWithEmail,
    registerUser,
    updateUserProfile,
    signOut,
    clearSession
  };
}; 