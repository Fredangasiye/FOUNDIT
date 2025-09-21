import React from 'react';
import { MessageCircle, Calendar, MapPin, Globe, Share2 } from 'lucide-react';
import { Post } from '../types';
// import { trackContactClick } from '../utils/analytics';

interface PostCardProps {
  post: Post;
  isSelected?: boolean;
  onToggleSelection?: (postId: string) => void;
  showCheckbox?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ post, isSelected = false, onToggleSelection, showCheckbox = false }) => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hi! I saw your post on FOUNDIT about "${post.title}".`);
    
    // Get the WhatsApp number, preferring contactWhatsApp over contactPhone
    let whatsappNumber = post.contactWhatsApp || post.contactPhone;
    
    // Clean and format the phone number for WhatsApp
    // Remove all non-digit characters
    whatsappNumber = whatsappNumber.replace(/\D/g, '');
    
    // Add country code if not present (assuming South Africa +27)
    if (whatsappNumber.startsWith('0')) {
      whatsappNumber = '27' + whatsappNumber.substring(1);
    } else if (!whatsappNumber.startsWith('27')) {
      whatsappNumber = '27' + whatsappNumber;
    }
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // Track contact click
    // trackContactClick('whatsapp', post.id, post.category);
    
    window.open(whatsappUrl, '_blank');
  };

  const handlePhoneClick = () => {
    // Clean the phone number for tel: links
    let phoneNumber = post.contactPhone.replace(/\D/g, '');
    
    // Add country code if not present (assuming South Africa +27)
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '+27' + phoneNumber.substring(1);
    } else if (!phoneNumber.startsWith('27')) {
      phoneNumber = '+27' + phoneNumber;
    } else {
      phoneNumber = '+' + phoneNumber;
    }
    
    // Track contact click
    // trackContactClick('phone', post.id, post.category);
    
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleEmailClick = () => {
    // Track contact click
    // trackContactClick('email', post.id, post.category);
    
    window.open(`mailto:${post.contactEmail}`, '_self');
  };

  const handleShareClick = async () => {
    const shareData = {
      title: post.title,
      text: post.description,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        const shareText = `${post.title}\n\n${post.description}\n\nView on FOUNDIT: ${window.location.href}`;
        await navigator.clipboard.writeText(shareText);
        alert('Post details copied to clipboard!');
      }
    } catch (error) {
      console.log('Share cancelled or failed:', error);
    }
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
      case 'For Sale/Give away':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 overflow-hidden transform hover:-translate-y-1 ${isSelected ? 'ring-2 ring-blue-500 shadow-blue-100' : ''}`}>
      {showCheckbox && onToggleSelection && (
        <div className="p-3 border-b border-gray-100">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelection(post.id)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="ml-2 text-sm text-gray-600">Select this post</span>
          </label>
        </div>
      )}
      {/* Image */}
      {post.image && (
        <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden relative flex items-center justify-center group">
          <img
            src={post.image}
            alt={post.title}
            className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {post.isAdminPost && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg border border-yellow-300">
              EXAMPLE
            </div>
          )}
          {/* Share Button Overlay */}
          <button
            onClick={handleShareClick}
            className="absolute top-3 left-3 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
            title="Share this post"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{post.title}</h3>
            {post.price && post.price > 0 && (
              <div className="flex items-center gap-1 mb-3">
                <span className="text-xl font-bold text-green-600">R{post.price.toFixed(2)}</span>
              </div>
            )}
            {post.price === -1 && (
              <div className="flex items-center gap-1 mb-3">
                <span className="text-xl font-bold text-gray-600 italic">Price on Request</span>
              </div>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Unit {post.unitNumber}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-medium">{formatDate(post.datePosted)}</span>
              </div>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getCategoryColor(post.category)} shadow-sm`}>
            {post.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 leading-relaxed">{post.description}</p>

        {/* Website and Social Media Links (only for For Sale/Give away) */}
        {post.category === 'For Sale/Give away' && (post.website || post.socialMedia) && (
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
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleWhatsAppClick}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
            <button
              onClick={handleShareClick}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-gray-200"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};