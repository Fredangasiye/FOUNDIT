import React from 'react';
import { MessageCircle, Calendar, MapPin, DollarSign, Globe, Share2 } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hi! I saw your post on FOUNDIT about "${post.title}".`);
    const whatsappUrl = `https://wa.me/${post.contactWhatsApp || post.contactPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePhoneClick = () => {
    window.open(`tel:${post.contactPhone}`, '_self');
  };

  const handleEmailClick = () => {
    window.open(`mailto:${post.contactEmail}`, '_self');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Lost':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Found':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'For Sale/Services':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Image */}
      {post.image && (
        <div className="h-48 bg-gray-200 overflow-hidden relative">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          {post.isAdminPost && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold shadow-lg">
              EXAMPLE
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
            {post.price && (
              <div className="flex items-center gap-1 mb-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-lg font-bold text-green-600">R{post.price.toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Unit {post.unitNumber}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.datePosted)}</span>
              </div>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 leading-relaxed">{post.description}</p>

        {/* Website and Social Media Links (only for For Sale/Services) */}
        {post.category === 'For Sale/Services' && (post.website || post.socialMedia) && (
          <div className="flex flex-wrap gap-3 mb-4">
            {post.website && (
              <a
                href={post.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
              >
                <Globe className="w-4 h-4" />
                Visit Website
              </a>
            )}
            {post.socialMedia && (
              <a
                href={post.socialMedia}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors duration-200 text-sm font-medium"
              >
                <Share2 className="w-4 h-4" />
                Social Media
              </a>
            )}
          </div>
        )}

        {/* Contact Information */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-gray-900 mb-3">Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div className="text-sm">
              <span className="text-gray-600">Name:</span>
              <span className="ml-2 font-medium">{post.contactName}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Unit:</span>
              <span className="ml-2 font-medium">{post.unitNumber}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Phone:</span>
              <button
                onClick={handlePhoneClick}
                className="ml-2 font-medium text-blue-600 hover:text-blue-800 underline"
              >
                {post.contactPhone}
              </button>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Email:</span>
              <button
                onClick={handleEmailClick}
                className="ml-2 font-medium text-blue-600 hover:text-blue-800 underline"
              >
                {post.contactEmail}
              </button>
            </div>
          </div>
          
          {/* Contact Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleWhatsAppClick}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};