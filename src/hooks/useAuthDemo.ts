import { useState, useEffect } from 'react';
import { User } from '../types';

// Mock authentication for demo purposes
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
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
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Mock Google sign-in
      const mockUser: User = {
        id: 'google_' + Date.now(),
        name: 'Demo User',
        unitNumber: '4B',
        phone: '+1234567890',
        password: '',
        profilePhoto: 'https://via.placeholder.com/150?text=Demo',
        authProvider: 'google',
        email: 'demo@example.com'
      };
      
      setCurrentUser(mockUser);
      localStorage.setItem('foundit_currentUser', JSON.stringify(mockUser));
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
      // Mock email sign-in - accept any email/password for demo
      const mockUser: User = {
        id: 'email_' + Date.now(),
        name: email.split('@')[0],
        unitNumber: '4B',
        phone: '+1234567890',
        password: '',
        profilePhoto: '',
        authProvider: 'local',
        email: email
      };
      
      setCurrentUser(mockUser);
      localStorage.setItem('foundit_currentUser', JSON.stringify(mockUser));
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
      // Mock registration
      const mockUser: User = {
        id: 'user_' + Date.now(),
        name: userData.name,
        unitNumber: userData.unitNumber || '',
        phone: userData.phone || '',
        email: userData.email,
        password: '',
        profilePhoto: '',
        authProvider: 'local'
      };

      setCurrentUser(mockUser);
      localStorage.setItem('foundit_currentUser', JSON.stringify(mockUser));
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