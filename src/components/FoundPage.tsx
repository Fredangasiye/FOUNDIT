import React from 'react';
import { ArrowLeft, Plus, User, Share2, Heart } from 'lucide-react';
import { User as UserType, Post } from '../types';
import { PostCard } from './PostCard';

interface FoundPageProps {
  posts: Post[];
  onNavigate: (page: 'Home' | 'NewPost' | 'Profile') => void;
  currentUser: UserType | null;
  onLogout: () => void; // Keep for compatibility, but will use as share function
}

export const FoundPage: React.FC<FoundPageProps> = ({
  posts,
  onNavigate,
  currentUser,
  onLogout
}) => {
  const handleShare = async () => {
    const shareData = {
      title: 'Huntingdon Terrace Connect - Found Items',
      text: 'Help return found items to their owners in our community!',
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
                <h1 className="text-2xl font-bold text-green-700">Found Items</h1>
                <p className="text-gray-600">Help return lost items to their owners</p>
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
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center gap-2 mb-6 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Report Found Item
        </button>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-green-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No found items reported</h3>
              <p className="text-gray-500">
                Be the first to report a found item and help reunite it with its owner!
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