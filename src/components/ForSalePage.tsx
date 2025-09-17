import React from 'react';
import { ArrowLeft, MessageCircle, LogOut } from 'lucide-react';
import { User as UserType, Post } from '../types';
import { PostCard } from './PostCard';

interface ForSalePageProps {
  posts: Post[];
  onNavigate: (page: 'Home' | 'NewPost' | 'Profile') => void;
  currentUser: UserType | null;
  onLogout: () => void;
  loading?: boolean;
}

export const ForSalePage: React.FC<ForSalePageProps> = ({ posts, onNavigate, currentUser, onLogout, loading = false }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('Home')}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </button>
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-blue-600">For Sale & Services</span>
              <button
                onClick={onLogout}
                className="flex items-center text-red-600 hover:text-red-700 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* New Post Button */}
        <div className="mb-6">
          <button
            onClick={() => onNavigate('NewPost')}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
          >
            List Item or Service
          </button>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading items and services...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No items or services listed</h3>
            <p className="text-gray-600 mb-4">Be the first to list an item or service!</p>
            <button
              onClick={() => onNavigate('NewPost')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              List Item or Service
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