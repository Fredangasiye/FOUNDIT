import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { HomePage } from './components/HomePage';
import { NewPostPage } from './components/NewPostPage';
import { ProfilePage } from './components/ProfilePage';
import { LostPage } from './components/LostPage';
import { FoundPage } from './components/FoundPage';
import { ForSalePage } from './components/ForSalePage';
import { useAuth } from './hooks/useAuthDemo';
import { usePosts } from './hooks/usePostsDemo';

function App() {
  const [currentPage, setCurrentPage] = useState<'Login' | 'Register' | 'Home' | 'NewPost' | 'Profile' | 'Lost' | 'Found' | 'ForSale'>('Login');
  const [activeCategory, setActiveCategory] = useState<'Lost' | 'Found' | 'For Sale/Services'>('Lost');
  
  const { 
    currentUser, 
    loading: authLoading, 
    error: authError,
    signInWithGoogle,
    signInWithEmail,
    registerUser,
    updateUserProfile,
    signOut,
    clearSession
  } = useAuth();

  const {
    posts,
    loading: postsLoading,
    error: postsError,
    addPost,
    loadPostsByCategory,
    getFilteredPosts
  } = usePosts();

  // Auto-navigate to home if user is logged in
  React.useEffect(() => {
    if (currentUser && currentPage === 'Login') {
      setCurrentPage('Home');
    }
  }, [currentUser, currentPage]);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    return await signInWithEmail(email, password);
  };

  const handleGoogleLogin = async (): Promise<void> => {
    await signInWithGoogle();
  };

  const handleRegister = async (userData: any): Promise<boolean> => {
    return await registerUser(userData);
  };

  const handleCreatePost = async (postData: any): Promise<boolean> => {
    const success = await addPost(postData, currentUser);
    if (success) {
      setCurrentPage('Home');
    }
    return success;
  };

  const handleUpdateProfile = async (userData: any): Promise<boolean> => {
    const success = await updateUserProfile(userData);
    if (success) {
      setCurrentPage('Home');
    }
    return success;
  };

  const handleLogout = async (): Promise<void> => {
    await signOut();
    setCurrentPage('Login');
  };

  const handleClearSession = (): void => {
    clearSession();
    setCurrentPage('Login');
  };

  const navigate = (page: 'Login' | 'Register' | 'Home' | 'NewPost' | 'Profile' | 'Lost' | 'Found' | 'ForSale') => {
    setCurrentPage(page);
  };

  // Show loading state while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an authentication error
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-4">Authentication Error</div>
          <p className="text-gray-600 mb-4">{authError}</p>
          <button 
            onClick={handleClearSession}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If no user is logged in, show login/register pages
  if (!currentUser) {
    return (
      <div className="App">
        {currentPage === 'Login' && (
          <LoginPage
            onLogin={handleLogin}
            onGoogleLogin={handleGoogleLogin}
            onNavigate={navigate}
            onLogout={handleClearSession}
            currentUser={currentUser}
          />
        )}
        {currentPage === 'Register' && (
          <RegisterPage
            onRegister={handleRegister}
            onGoogleLogin={handleGoogleLogin}
            onNavigate={navigate}
          />
        )}
      </div>
    );
  }

  // User is logged in, show main app pages
  const filteredPosts = getFilteredPosts(activeCategory);

  switch (currentPage) {
    case 'Home':
      return (
        <HomePage
          posts={filteredPosts}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onNavigate={navigate}
          currentUser={currentUser}
          onLogout={handleLogout}
          loading={postsLoading}
        />
      );
    case 'Lost':
      return (
        <LostPage
          posts={getFilteredPosts('Lost')}
          onNavigate={navigate}
          currentUser={currentUser}
          onLogout={handleLogout}
          loading={postsLoading}
        />
      );
    case 'Found':
      return (
        <FoundPage
          posts={getFilteredPosts('Found')}
          onNavigate={navigate}
          currentUser={currentUser}
          onLogout={handleLogout}
          loading={postsLoading}
        />
      );
    case 'ForSale':
      return (
        <ForSalePage
          posts={getFilteredPosts('For Sale/Services')}
          onNavigate={navigate}
          currentUser={currentUser}
          onLogout={handleLogout}
          loading={postsLoading}
        />
      );
    case 'NewPost':
      return <NewPostPage onCreatePost={handleCreatePost} onNavigate={navigate} />;
    case 'Profile':
      return (
        <ProfilePage
          user={currentUser}
          onUpdateProfile={handleUpdateProfile}
          onNavigate={navigate}
        />
      );
    default:
      return (
        <HomePage
          posts={filteredPosts}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          onNavigate={navigate}
          currentUser={currentUser}
          onLogout={handleLogout}
          loading={postsLoading}
        />
      );
  }
}

export default App;