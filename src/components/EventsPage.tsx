import React from 'react';
import { Calendar, Clock, MapPin, ArrowLeft, Globe, ExternalLink } from 'lucide-react';
import { Post } from '../types';
import { PostCard } from './PostCard';

interface EventsPageProps {
  posts: Post[];
  onNavigate: (page: 'Home') => void;
  loading?: boolean;
  isAdmin?: boolean;
  onDeletePost?: (postId: string) => Promise<boolean>;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  posts,
  onNavigate,
  loading = false,
  isAdmin = false,
  onDeletePost
}) => {
  const eventsPosts = posts.filter(post => post.category === 'EVENTS');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onNavigate('Home')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900">Events & Meetings</h1>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {eventsPosts.length} event{eventsPosts.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {eventsPosts.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Yet</h3>
            <p className="text-gray-500 mb-6">
              Be the first to post a community event or meeting!
            </p>
            <button
              onClick={() => onNavigate('Home')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Post an Event
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {eventsPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-6">
                  {/* Event Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                    {isAdmin && onDeletePost && (
                      <button
                        onClick={() => onDeletePost(post.id)}
                        className="ml-4 text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {post.eventDate && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-purple-600" />
                        <span>{post.eventDate}</span>
                      </div>
                    )}
                    {post.eventTime && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <span>{post.eventTime}</span>
                      </div>
                    )}
                    {post.eventLocation && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-purple-600" />
                        <span>{post.eventLocation}</span>
                      </div>
                    )}
                  </div>

                  {/* Event Link */}
                  {post.eventLink && (
                    <div className="mb-4">
                      <a
                        href={post.eventLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
                      >
                        <Globe className="h-4 w-4" />
                        <span>Join Event</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Contact:</span> {post.contactName}
                      </div>
                      <div className="flex space-x-3">
                        <a
                          href={`tel:${post.contactPhone}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Call
                        </a>
                        <a
                          href={`https://wa.me/${post.contactWhatsApp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};