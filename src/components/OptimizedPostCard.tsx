import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Calendar, MapPin, DollarSign, Globe, Share2, Phone, Mail, User, Building } from 'lucide-react';
import { Post } from '../types';
import { getOptimizedImageUrl } from '../services/imageService';

interface PostCardProps {
  post: Post;
}

export const OptimizedPostCard: React.FC<PostCardProps> = ({ post }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  // Get optimized image URL
  const optimizedImageUrl = post.image ? getOptimizedImageUrl(post.image, 400, 300) : null;

  return (
    <div 
      ref={cardRef}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Image Section with Lazy Loading */}
      {post.image && isVisible && (
        <div className="relative h-48 bg-gray-100">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          <img
            src={imageError ? '/placeholder-image.jpg' : optimizedImageUrl || post.image}
            alt={post.title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {post.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                {post.category}
              </span>
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.datePosted)}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 line-clamp-3">
          {post.description}
        </p>

        {/* Price (for For Sale/Services) */}
        {post.category === 'For Sale/Services' && post.price && (
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-lg font-semibold text-green-600">
              R{post.price.toLocaleString()}
            </span>
          </div>
        )}

        {/* Website Link (for For Sale/Services) */}
        {post.category === 'For Sale/Services' && post.website && (
          <div className="mb-4">
            <a
              href={post.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="text-sm">View Website</span>
            </a>
          </div>
        )}

        {/* Facebook Marketplace Link (for For Sale/Services) */}
        {post.category === 'For Sale/Services' && post.socialMedia && (
          <div className="mb-4">
            <a
              href={post.socialMedia}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm">Facebook Marketplace</span>
            </a>
          </div>
        )}

        {/* Contact Information */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h4>
          
          <div className="space-y-2">
            {/* Contact Name */}
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">{post.contactName}</span>
            </div>

            {/* Unit Number */}
            {post.unitNumber && (
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">Unit {post.unitNumber}</span>
              </div>
            )}

            {/* Contact Actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {/* Phone */}
              <button
                onClick={handlePhoneClick}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                Call
              </button>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>

              {/* Email */}
              <button
                onClick={handleEmailClick}
                className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};