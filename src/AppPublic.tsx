import React, { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { HomePage } from './components/HomePage';
import { NewPostPage } from './components/NewPostPage';
import { LostPage } from './components/LostPage';
import { FoundPage } from './components/FoundPage';
import { ForSalePage } from './components/ForSalePage';
import { usePosts } from './hooks/usePostsPublic';

function App() {
  console.log('App component initializing...');
  const [currentPage, setCurrentPage] = useState<'Home' | 'NewPost' | 'Lost' | 'Found' | 'ForSale'>('Home');
  const [activeCategory, setActiveCategory] = useState<'Lost' | 'Found' | 'Give away'>('Lost');
  
  // Test analytics on app load
  React.useEffect(() => {
    console.log('Testing analytics...');
    if (typeof window !== 'undefined' && window.va) {
      console.log('Vercel Analytics is available!');
      window.va('track', 'app_loaded', { 
        timestamp: new Date().toISOString(),
        test: true 
      });
    } else {
      console.log('Vercel Analytics not yet available');
    }
  }, []);
  
  console.log('About to call usePosts hook...');
  const {
    posts,
    loading: postsLoading,
    error: postsError,
    isAdmin,
    selectedPosts,
    addPost,
    deletePost,
    editPost,
    loadPostsByCategory,
    getFilteredPosts,
    handleAdminLogin,
    handleAdminLogout,
    togglePostSelection,
    selectAllPosts,
    clearSelection,
    bulkDeletePosts
  } = usePosts();
  console.log('usePosts hook completed', { posts: posts.length, loading: postsLoading, error: postsError });

  const handleCreatePost = async (postData: any): Promise<boolean> => {
    const success = await addPost(postData);
    if (success) {
      setCurrentPage('Home');
    }
    return success;
  };

  const navigate = (page: 'Home' | 'NewPost' | 'Lost' | 'Found' | 'ForSale') => {
    setCurrentPage(page);
  };

  const onAdminLogin = (email: string, phone: string): boolean => {
    return handleAdminLogin(email, phone);
  };

  const onAdminLogout = (): void => {
    handleAdminLogout();
  };

  // Show loading state while posts are being loaded
  if (postsLoading && posts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an error
  if (postsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-4">Error Loading Posts</div>
          <p className="text-gray-600 mb-4">{postsError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main app pages
  const filteredPosts = getFilteredPosts(activeCategory);

  const renderPage = () => {
    switch (currentPage) {
      case 'Home':
        return (
          <HomePage
            posts={posts}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onNavigate={navigate}
            loading={postsLoading}
            isAdmin={isAdmin}
            onAdminLogin={onAdminLogin}
            onAdminLogout={onAdminLogout}
            onDeletePost={deletePost}
            onEditPost={editPost}
            selectedPosts={selectedPosts}
            onTogglePostSelection={togglePostSelection}
            onSelectAllPosts={selectAllPosts}
            onClearSelection={clearSelection}
            onBulkDeletePosts={bulkDeletePosts}
          />
        );
      case 'Lost':
        return (
          <LostPage
            posts={getFilteredPosts('Lost')}
            onNavigate={navigate}
            loading={postsLoading}
            isAdmin={isAdmin}
            onDeletePost={deletePost}
          />
        );
      case 'Found':
        return (
          <FoundPage
            posts={getFilteredPosts('Found')}
            onNavigate={navigate}
            loading={postsLoading}
            isAdmin={isAdmin}
            onDeletePost={deletePost}
          />
        );
      case 'ForSale':
        return (
          <ForSalePage
            posts={getFilteredPosts('Give away')}
            onNavigate={navigate}
            loading={postsLoading}
            isAdmin={isAdmin}
            onDeletePost={deletePost}
          />
        );
      case 'NewPost':
        return <NewPostPage onCreatePost={handleCreatePost} onNavigate={navigate} />;
      default:
        return (
          <HomePage
            posts={filteredPosts}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            onNavigate={navigate}
            loading={postsLoading}
            isAdmin={isAdmin}
            onAdminLogin={handleAdminLogin}
            onAdminLogout={handleAdminLogout}
            onDeletePost={deletePost}
          />
        );
    }
  };

  return (
    <>
      {renderPage()}
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;