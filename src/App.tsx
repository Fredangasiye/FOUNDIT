import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { HomePage } from './components/HomePage';
import { NewPostPage } from './components/NewPostPage';
import { ProfilePage } from './components/ProfilePage';
import { LostPage } from './components/LostPage';
import { FoundPage } from './components/FoundPage';
import { ForSalePage } from './components/ForSalePage';
import { User, Post } from './types';
import { useGoogleAuth } from './hooks/useGoogleAuth';

function App() {
  const [currentPage, setCurrentPage] = useState<'Login' | 'Register' | 'Home' | 'NewPost' | 'Profile' | 'Lost' | 'Found' | 'ForSale'>('Login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState<'Lost' | 'Found' | 'For Sale/Services'>('Lost');
  const { signInWithGoogle, googleUser } = useGoogleAuth();

  // Load data from localStorage on app start
  useEffect(() => {
    const savedUsers = localStorage.getItem('complexConnect_users');
    const savedPosts = localStorage.getItem('complexConnect_posts');
    const savedCurrentUser = localStorage.getItem('complexConnect_currentUser');

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
    if (savedCurrentUser) {
      setCurrentUser(JSON.parse(savedCurrentUser));
      setCurrentPage('Home');
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('complexConnect_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('complexConnect_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('complexConnect_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('complexConnect_currentUser');
    }
  }, [currentUser]);

  // Handle Google authentication result
  useEffect(() => {
    if (googleUser) {
      // Check if user exists in our system
      let existingUser = users.find(u => u.id === googleUser.id);
      
      if (!existingUser) {
        // Create new user from Google data
        const newUser: User = {
          ...googleUser,
          authProvider: 'google'
        };
        setUsers([...users, newUser]);
        existingUser = newUser;
      }
      
      setCurrentUser(existingUser);
      
      // If user hasn't set unit number, go to profile first
      if (!existingUser.unitNumber) {
        setCurrentPage('Profile');
      } else {
        setCurrentPage('Home');
      }
    }
  }, [googleUser, users]);

  const loginUser = (phone: string, password: string): boolean => {
    const user = users.find(u => u.phone === phone && u.password === password);
    if (user) {
      setCurrentUser(user);
      setCurrentPage('Home');
      return true;
    }
    return false;
  };

  const loginWithGoogle = async (): Promise<void> => {
    await signInWithGoogle();
  };

  const registerUser = (userData: Omit<User, 'id' | 'profilePhoto'>): boolean => {
    const existingUser = users.find(u => u.phone === userData.phone);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      profilePhoto: '',
      authProvider: 'local'
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    setCurrentPage('Home');
    return true;
  };

  const createPost = (postData: Omit<Post, 'id' | 'datePosted' | 'userPhone' | 'userName' | 'unitNumber'>): void => {
    if (!currentUser) return;

    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      datePosted: new Date(),
      userPhone: currentUser.phone,
      userName: currentUser.name,
      unitNumber: currentUser.unitNumber
    };

    setPosts([newPost, ...posts]);
    setCurrentPage('Home');
  };

  const updateProfile = (userData: Partial<User>): void => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...userData };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    setCurrentPage('Home');
  };

  const navigate = (page: 'Login' | 'Register' | 'Home' | 'NewPost' | 'Profile' | 'Lost' | 'Found' | 'ForSale') => {
    setCurrentPage(page);
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentPage('Login');
  };

  const filteredPosts = posts.filter(post => post.category === activeCategory);

  switch (currentPage) {
    case 'Login':
      return <LoginPage onLogin={loginUser} onGoogleLogin={loginWithGoogle} onNavigate={navigate} />;
    case 'Register':
      return <RegisterPage onRegister={registerUser} onGoogleLogin={loginWithGoogle} onNavigate={navigate} />;
    case 'Home':
      return (
        <HomePage
          posts={filteredPosts}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onNavigate={navigate}
          currentUser={currentUser}
          onLogout={logout}
        />
      );
    case 'Lost':
      return (
        <LostPage
          posts={posts.filter(post => post.category === 'Lost')}
          onNavigate={navigate}
          currentUser={currentUser}
          onLogout={logout}
        />
      );
    case 'Found':
      return (
        <FoundPage
          posts={posts.filter(post => post.category === 'Found')}
          onNavigate={navigate}
          currentUser={currentUser}
          onLogout={logout}
        />
      );
    case 'ForSale':
      return (
        <ForSalePage
          posts={posts.filter(post => post.category === 'For Sale/Services')}
          onNavigate={navigate}
          currentUser={currentUser}
          onLogout={logout}
        />
      );
    case 'NewPost':
      return <NewPostPage onCreatePost={createPost} onNavigate={navigate} />;
    case 'Profile':
      return (
        <ProfilePage
          user={currentUser}
          onUpdateProfile={updateProfile}
          onNavigate={navigate}
        />
      );
    default:
      return <LoginPage onLogin={loginUser} onNavigate={navigate} />;
  }
}

export default App;