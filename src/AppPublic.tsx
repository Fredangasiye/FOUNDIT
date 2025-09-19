import React, { useState } from 'react';
import { HomePage } from './components/HomePage';
import { NewPostPage } from './components/NewPostPage';
import { LostPage } from './components/LostPage';
import { FoundPage } from './components/FoundPage';
import { ForSalePage } from './components/ForSalePage';
import { usePosts } from './hooks/usePostsPublic';

function App() {
  const [currentPage, setCurrentPage] = useState<'Home' | 'NewPost' | 'Lost' | 'Found' | 'ForSale'>('Home');
  const [activeCategory, setActiveCategory] = useState<'Lost' | 'Found' | 'For Sale/Services'>('Lost');
  
  const {
    posts,
    loading: postsLoading,
    error: postsError,
    isAdmin,
    addPost,
    deletePost,
    editPost,
    loadPostsByCategory,
    getFilteredPosts,
    loginAsAdmin,
    logoutAdmin
  } = usePosts();

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

  const handleAdminLogin = (email: string, phone: string): boolean => {
    return loginAsAdmin(email, phone);
  };

  const handleAdminLogout = (): void => {
    logoutAdmin();
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
          onAdminLogin={handleAdminLogin}
          onAdminLogout={handleAdminLogout}
          onDeletePost={deletePost}
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
          posts={getFilteredPosts('For Sale/Services')}
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
}

export default App;