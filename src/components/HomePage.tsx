import React from 'react';
import { Plus, User, Share2, MessageCircle } from 'lucide-react';
import { User as UserType, Post } from '../types';
import { PostCard } from './PostCard';

interface HomePageProps {
  posts: Post[];
  activeCategory: 'Lost' | 'Found' | 'For Sale/Services';
  onCategoryChange: (category: 'Lost' | 'Found' | 'For Sale/Services') => void;
  onNavigate: (page: 'NewPost' | 'Profile' | 'Lost' | 'Found' | 'ForSale') => void;
  currentUser: UserType | null;
  onLogout: () => void;
  loading?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  posts,
  activeCategory,
  onCategoryChange,
  onNavigate,
  currentUser,
  onLogout,
  loading = false
}) => {
  const categories = [
    { name: 'Lost', color: 'bg-red-100 text-red-800 border-red-200', activeColor: 'bg-red-500 text-white' },
    { name: 'Found', color: 'bg-green-100 text-green-800 border-green-200', activeColor: 'bg-green-500 text-white' },
    { name: 'For Sale/Services', color: 'bg-blue-100 text-blue-800 border-blue-200', activeColor: 'bg-blue-500 text-white' }
  ];

  const getCategoryCount = (category: 'Lost' | 'Found' | 'For Sale/Services') => {
    return posts.filter(post => post.category === category).length;
  };

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
      <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
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
              <p className="text-gray-600">Welcome back, {currentUser?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('Profile')}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
              >
                <User className="w-6 h-6" />
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
              >
                <Share2 className="w-6 h-6" />
              </button>
              <button
                onClick={onLogout}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-all duration-200"
              >
                Logout
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
                className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
                  activeCategory === category.name
                    ? `${category.activeColor} border-transparent`
                    : `${category.color} hover:shadow-md`
                }`}
              >
                <div className="text-center">
                  <div className="font-semibold text-lg">{category.name}</div>
                  <div className="text-sm opacity-75">{getCategoryCount(category.name as 'Lost' | 'Found' | 'For Sale/Services')} posts</div>
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
        ) : posts.length === 0 ? (
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
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};