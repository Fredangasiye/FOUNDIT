import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Calendar, MapPin, Globe, Share2, Phone, Mail, User, Building } from 'lucide-react';
import { Post } from '../types';
// import { trackContactClick } from '../utils/analytics';
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
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl border border-gray-100 hover:border-gray-200 transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
    >
      {/* Image Section with Lazy Loading */}
      {post.image && isVisible && (
        <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center group w-full">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          <img
            src={imageError ? '/placeholder-image.jpg' : optimizedImageUrl || post.image}
            alt={post.title}
            className={`max-w-full max-h-full object-contain transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
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

        {/* Price (for For Sale/Give away) */}
        {post.category === 'For Sale/Give away' && post.price && post.price > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-semibold text-green-600">
              R{post.price.toLocaleString()}
            </span>
            {post.isNegotiable && (
              <span className="text-sm text-blue-600 font-medium">neg</span>
            )}
          </div>
        )}
        {post.category === 'For Sale/Give away' && post.price === -1 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg font-semibold text-gray-600 italic">
              Price on Request
            </span>
          </div>
        )}

        {/* Website Link (for For Sale/Give away) */}
        {post.category === 'For Sale/Give away' && post.website && (
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

        {/* Facebook Marketplace Link (for For Sale/Give away) */}
        {post.category === 'For Sale/Give away' && post.socialMedia && (
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
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <Phone className="w-4 h-4" />
                Call
              </button>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsAppClick}
                className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-200 text-sm shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </button>

              {/* Email */}
              <button
                onClick={handleEmailClick}
                className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all duration-200 text-sm shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <Mail className="w-4 h-4" />
                Email
              </button>

              {/* Share */}
              <button
                onClick={handleShareClick}
                className="flex items-center gap-2 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all duration-200 text-sm shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};