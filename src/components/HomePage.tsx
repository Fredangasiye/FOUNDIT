import React, { useState } from 'react';
import { Plus, User, Share2, MessageCircle, Shield, LogOut, LogIn } from 'lucide-react';
import { Post } from '../types';
import { PostCard } from './PostCard';

interface HomePageProps {
  posts: Post[];
  activeCategory: 'Lost' | 'Found' | 'For Sale/Services';
  onCategoryChange: (category: 'Lost' | 'Found' | 'For Sale/Services') => void;
  onNavigate: (page: 'NewPost' | 'Lost' | 'Found' | 'ForSale') => void;
  loading?: boolean;
  isAdmin?: boolean;
  onAdminLogin?: (email: string, phone: string) => boolean;
  onAdminLogout?: () => void;
  onDeletePost?: (postId: string) => Promise<boolean>;
  onEditPost?: (postId: string, updatedData: Partial<Post>) => Promise<boolean>;
}

export const HomePage: React.FC<HomePageProps> = ({
  posts,
  activeCategory,
  onCategoryChange,
  onNavigate,
  loading = false,
  isAdmin = false,
  onAdminLogin,
  onAdminLogout,
  onDeletePost,
  onEditPost
}) => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const categories = [
    { name: 'Lost', color: 'bg-red-100 text-red-800 border-red-200', activeColor: 'bg-red-500 text-white' },
    { name: 'Found', color: 'bg-green-100 text-green-800 border-green-200', activeColor: 'bg-green-500 text-white' },
    { name: 'For Sale/Services', color: 'bg-blue-100 text-blue-800 border-blue-200', activeColor: 'bg-blue-500 text-white' }
  ];

  const handleAdminLogin = () => {
    if (onAdminLogin && adminEmail && adminPhone) {
      const success = onAdminLogin(adminEmail, adminPhone);
      if (success) {
        setShowAdminLogin(false);
        setAdminEmail('');
        setAdminPhone('');
      } else {
        alert('Invalid admin credentials');
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      if (onDeletePost) {
        const success = await onDeletePost(postId);
        if (success) {
          alert('Post deleted successfully');
        } else {
          alert('Failed to delete post');
        }
      }
    }
  };

  const handleEditPost = (postId: string) => {
    // For now, just show an alert. In a real app, you'd open an edit modal
    alert('Edit functionality coming soon! Post ID: ' + postId);
  };

  const getCategoryCount = (category: 'Lost' | 'Found' | 'For Sale/Services') => {
    return posts.filter(post => post.category === category).length;
  };

  // Filter posts for display based on active category
  const filteredPosts = posts.filter(post => post.category === activeCategory);

  const handleShare = async () => {
    const shareData = {
      title: 'FOUNDIT',
      text: 'Join our community platform to connect with neighbors!',
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.origin);
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.origin);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative h-48 overflow-hidden">
        {/* Background Image */}
        <img 
          src="/header-image-01.jpg" 
          alt="Community Header" 
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">FOUNDIT</h1>
            <p className="text-xl opacity-90 drop-shadow">Your Community, Connected</p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-4 left-4 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-8 right-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/3 w-8 h-8 bg-white/20 rounded-full blur-sm"></div>
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Community Posts</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Debug: Show admin state */}
              <span className="text-xs text-gray-500">Admin: {isAdmin ? 'Yes' : 'No'}</span>
              {isAdmin ? (
                <>
                  <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Admin
                  </span>
                  <button
                    onClick={onAdminLogout}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                    title="Logout Admin"
                  >
                    <LogOut className="w-6 h-6" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                  title="Admin Login"
                >
                  <LogIn className="w-6 h-6" />
                </button>
              )}
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                title="Share"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => onCategoryChange(category.name as 'Lost' | 'Found' | 'For Sale/Services')}
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 transform ${
                  activeCategory === category.name
                    ? `${category.activeColor} border-transparent shadow-lg scale-105 ring-2 ring-blue-500 ring-opacity-50`
                    : `${category.color} hover:shadow-md hover:scale-102`
                }`}
              >
                <div className="text-center">
                  <div className={`font-semibold text-lg ${
                    activeCategory === category.name ? 'text-white' : ''
                  }`}>
                    {category.name}
                  </div>
                  <div className={`text-sm ${
                    activeCategory === category.name ? 'text-white opacity-90' : 'opacity-75'
                  }`}>
                    {getCategoryCount(category.name as 'Lost' | 'Found' | 'For Sale/Services')} posts
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* New Post Button */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate('NewPost')}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-6 h-6" />
            Create New Post
          </button>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600 mb-4">Be the first to create a post in the {activeCategory} category!</p>
            <button
              onClick={() => onNavigate('NewPost')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Create Post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <div key={post.id} className="relative">
                <PostCard post={post} />
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={() => handleEditPost(post.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
                      title="Edit Post"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors duration-200"
                      title="Delete Post"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Login</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="fred@foundit.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={adminPhone}
                  onChange={(e) => setAdminPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+27795778455"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAdminLogin(false)}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAdminLogin}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};