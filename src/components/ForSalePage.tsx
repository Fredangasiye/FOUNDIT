import React from 'react';
import { ArrowLeft, Plus, User, Share2, ShoppingBag } from 'lucide-react';
import { User as UserType, Post } from '../types';
import { PostCard } from './PostCard';

interface ForSalePageProps {
  posts: Post[];
  onNavigate: (page: 'Home' | 'NewPost' | 'Profile') => void;
  currentUser: UserType | null;
  onLogout: () => void; // Keep for compatibility, but will use as share function
}

export const ForSalePage: React.FC<ForSalePageProps> = ({
  posts,
  onNavigate,
  currentUser,
  onLogout
}) => {
  const handleShare = async () => {
    const shareData = {
      title: 'Huntingdon Terrace Connect - For Sale & Services',
      text: 'Check out items for sale and services in our community!',
      url: window.location.origin
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        navigator.clipboard.writeText(window.location.origin);
        alert('Link copied to clipboard!');
      }
    } else {
      navigator.clipboard.writeText(window.location.origin);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('Home')}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-blue-700">For Sale & Services</h1>
                <p className="text-gray-600">Buy, sell, and offer services within the community</p>
              </div>
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
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Create Post Button */}
        <button
          onClick={() => onNavigate('NewPost')}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 mb-6 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Post Item or Service
        </button>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-blue-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No items or services listed</h3>
              <p className="text-gray-500">
                Be the first to list an item for sale or offer a service to the community!
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};