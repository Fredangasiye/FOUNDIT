import React, { useState } from 'react';
import { Plus, User, Share2, MessageCircle, Shield, LogOut, LogIn, Upload, X } from 'lucide-react';
import { Post } from '../types';
import { PostCard } from './PostCard';
import { trackCategorySwitch, trackPageView, trackContactClick, trackAdminAction, trackPostCreated } from '../utils/analytics';
import { uploadImage } from '../services/firestoreService';

interface HomePageProps {
  posts: Post[];
  activeCategory: 'Lost' | 'Found' | 'Give away';
  onCategoryChange: (category: 'Lost' | 'Found' | 'Give away') => void;
  onNavigate: (page: 'NewPost' | 'Lost' | 'Found' | 'ForSale') => void;
  loading?: boolean;
  isAdmin?: boolean;
  onAdminLogin?: (email: string, phone: string) => boolean;
  onAdminLogout?: () => void;
  onDeletePost?: (postId: string) => Promise<boolean>;
  onEditPost?: (postId: string, updatedData: Partial<Post>) => Promise<boolean>;
  selectedPosts?: Set<string>;
  onTogglePostSelection?: (postId: string) => void;
  onSelectAllPosts?: () => void;
  onClearSelection?: () => void;
  onBulkDeletePosts?: () => Promise<boolean>;
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
  onEditPost,
  selectedPosts = new Set(),
  onTogglePostSelection,
  onSelectAllPosts,
  onClearSelection,
  onBulkDeletePosts
}) => {
  // Track page view on mount
  React.useEffect(() => {
    try {
      trackPageView('home', activeCategory);
      console.log('Analytics: Page view tracked for home page');
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
  }, [activeCategory]);


  // Wrapper function for category changes with tracking
  const handleCategoryChange = (category: 'Lost' | 'Found' | 'Give away') => {
    try {
      trackCategorySwitch(activeCategory, category);
    } catch (error) {
      console.warn('Analytics tracking failed:', error);
    }
    onCategoryChange(category);
  };
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactWhatsApp: '',
    unitNumber: '',
    website: '',
    socialMedia: '',
    image: ''
  });
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const categories = [
    { name: 'Lost', color: 'bg-red-100 text-red-800 border-red-200', activeColor: 'bg-red-500 text-white' },
    { name: 'Found', color: 'bg-green-100 text-green-800 border-green-200', activeColor: 'bg-green-500 text-white' },
    { name: 'Give away', color: 'bg-blue-100 text-blue-800 border-blue-200', activeColor: 'bg-blue-500 text-white' }
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
        if (!success) {
          alert('Failed to delete post');
        }
      }
    }
  };

  const handleEditPost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    if (post) {
      setEditingPost(post);
      setEditFormData({
        title: post.title,
        description: post.description,
        category: post.category,
        price: post.price ? post.price.toString() : '',
        contactName: post.contactName,
        contactPhone: post.contactPhone,
        contactEmail: post.contactEmail,
        contactWhatsApp: post.contactWhatsApp || '',
        unitNumber: post.unitNumber,
        website: post.website || '',
        socialMedia: post.socialMedia || '',
        image: post.image || ''
      });
      setSelectedFile(null);
      setImagePreview(null);
      setShowEditModal(true);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // Clear URL input when file is selected
      setEditFormData({...editFormData, image: ''});
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleEditSubmit = async () => {
    if (!editingPost || !onEditPost) return;

    setIsUploading(true);
    
    try {
      let imageUrl = editFormData.image;
      
      // Upload file if selected
      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile, editingPost.id);
      }

      // Prepare update data, filtering out undefined values
      const updatedData: any = {
        title: editFormData.title,
        description: editFormData.description,
        category: editFormData.category as 'Lost' | 'Found' | 'Give away',
        contactName: editFormData.contactName,
        contactPhone: editFormData.contactPhone,
        unitNumber: editFormData.unitNumber,
        image: imageUrl
      };

      // Only include optional fields if they have values
      if (editFormData.price && editFormData.price.trim() !== '') {
        const priceValue = parseFloat(editFormData.price);
        if (!isNaN(priceValue) && priceValue > 0) {
          updatedData.price = priceValue;
        }
      }
      if (editFormData.contactEmail && editFormData.contactEmail.trim() !== '') {
        updatedData.contactEmail = editFormData.contactEmail;
      }
      if (editFormData.contactWhatsApp && editFormData.contactWhatsApp.trim() !== '') {
        updatedData.contactWhatsApp = editFormData.contactWhatsApp;
      }
      if (editFormData.website && editFormData.website.trim() !== '') {
        updatedData.website = editFormData.website;
      }
      if (editFormData.socialMedia && editFormData.socialMedia.trim() !== '') {
        updatedData.socialMedia = editFormData.socialMedia;
      }

      const success = await onEditPost(editingPost.id, updatedData);
      if (success) {
        setShowEditModal(false);
        setEditingPost(null);
        setSelectedFile(null);
        setImagePreview(null);
      } else {
        alert('Failed to update post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to upload image or update post');
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setEditingPost(null);
    setSelectedFile(null);
    setImagePreview(null);
    setIsUploading(false);
    setEditFormData({
      title: '',
      description: '',
      category: '',
      price: '',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      contactWhatsApp: '',
      unitNumber: '',
      website: '',
      socialMedia: '',
      image: ''
    });
  };

  const getCategoryCount = (category: 'Lost' | 'Found' | 'Give away') => {
    return posts.filter(post => post.category === category).length;
  };

  const handleBulkDelete = async () => {
    if (selectedPosts.size === 0) return;
    
    if (window.confirm(`Are you sure you want to delete ${selectedPosts.size} selected post(s)?`)) {
      if (onBulkDeletePosts) {
        const success = await onBulkDeletePosts();
        if (success) {
          setBulkMode(false);
        }
      }
    }
  };

  const toggleBulkMode = () => {
    setBulkMode(!bulkMode);
    if (bulkMode && onClearSelection) {
      onClearSelection();
    }
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
    <div className="min-h-screen bg-gray-900">
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

      {/* Header - Mobile First */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="w-full px-2 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm sm:text-base font-medium">Community Posts</p>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {isAdmin ? (
                <>
                  <span className="text-xs sm:text-sm text-green-400 font-medium flex items-center gap-1">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </span>
                  <button
                    onClick={toggleBulkMode}
                    className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
                      bulkMode 
                        ? 'text-blue-400 bg-blue-900' 
                        : 'text-gray-400 hover:text-blue-400 hover:bg-gray-700'
                    }`}
                    title={bulkMode ? "Exit Bulk Mode" : "Bulk Delete Mode"}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={onAdminLogout}
                    className="p-1.5 sm:p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-full transition-all duration-200"
                    title="Logout Admin"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAdminLogin(true)}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-full transition-all duration-200"
                  title="Admin Login"
                >
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
              <button
                onClick={handleShare}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-full transition-all duration-200"
                title="Share"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs - Mobile First, Full Width */}
      <div className="sticky top-0 z-20 bg-gray-800 border-b border-gray-700">
        <div className="w-full px-2 py-2">
          <div className="grid grid-cols-3 gap-2">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryChange(category.name as 'Lost' | 'Found' | 'Give away')}
                className={`px-2 py-3 rounded-lg border-2 transition-all duration-200 ${
                  activeCategory === category.name
                    ? `${category.activeColor} border-transparent shadow-lg ring-2 ring-blue-500 ring-opacity-50`
                    : `${category.color} hover:shadow-md`
                }`}
              >
                <div className="text-center">
                  <div className={`font-semibold text-xs sm:text-sm ${
                    activeCategory === category.name ? 'text-white' : ''
                  }`}>
                    {category.name}
                  </div>
                  <div className={`text-xs ${
                    activeCategory === category.name ? 'text-white opacity-90' : 'opacity-75'
                  }`}>
                    {getCategoryCount(category.name as 'Lost' | 'Found' | 'Give away')} posts
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
            <p className="text-gray-300">Loading posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-100 mb-2">No posts yet</h3>
            <p className="text-gray-300 mb-4">Be the first to create a post in the {activeCategory} category!</p>
            <button
              onClick={() => onNavigate('NewPost')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Create Post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bulkMode && isAdmin && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-blue-800">
                      {selectedPosts.size} post(s) selected
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={onSelectAllPosts}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Select All
                      </button>
                      <button
                        onClick={onClearSelection}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleBulkDelete}
                      disabled={selectedPosts.size === 0}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        selectedPosts.size === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      Delete Selected ({selectedPosts.size})
                    </button>
                  </div>
                </div>
              </div>
            )}
            {filteredPosts.map((post) => (
              <div key={post.id} className="relative">
                <PostCard 
                  post={post} 
                  isSelected={selectedPosts.has(post.id)}
                  onToggleSelection={onTogglePostSelection}
                  showCheckbox={bulkMode && isAdmin}
                />
                {isAdmin && !bulkMode && (
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

      {/* Edit Post Modal */}
      {showEditModal && editingPost && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleEditCancel();
            }
          }}
        >
          <div 
            className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl my-4 max-h-[95vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Post</h3>
              <button
                onClick={handleEditCancel}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors duration-200"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter post title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter description"
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                
                {/* File Upload */}
                <div className="mb-4">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> an image
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                  
                  {selectedFile && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-sm text-gray-600 truncate flex-1">
                        {selectedFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Image URL Input (Alternative) */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Or paste image URL:
                  </label>
                  <input
                    type="url"
                    value={editFormData.image}
                    onChange={(e) => {
                      setEditFormData({...editFormData, image: e.target.value});
                      if (e.target.value) {
                        setSelectedFile(null);
                        setImagePreview(null);
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="https://example.com/image.jpg"
                    disabled={!!selectedFile}
                  />
                </div>

                {/* Image Preview */}
                {(imagePreview || editFormData.image) && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview || editFormData.image} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({...editFormData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option value="Lost">Lost</option>
                  <option value="Found">Found</option>
                  <option value="Give away">Give away</option>
                </select>
              </div>

              {/* Price (only for Give away) */}
              {editFormData.category === 'Give away' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (R)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              )}

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    value={editFormData.contactName}
                    onChange={(e) => setEditFormData({...editFormData, contactName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit Number *
                  </label>
                  <input
                    type="text"
                    value={editFormData.unitNumber}
                    onChange={(e) => setEditFormData({...editFormData, unitNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Unit number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={editFormData.contactPhone}
                    onChange={(e) => setEditFormData({...editFormData, contactPhone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editFormData.contactEmail}
                    onChange={(e) => setEditFormData({...editFormData, contactEmail: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Email address (optional)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={editFormData.contactWhatsApp}
                    onChange={(e) => setEditFormData({...editFormData, contactWhatsApp: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="WhatsApp number"
                  />
                </div>
              </div>

              {/* Website and Social Media (only for Give away) */}
              {editFormData.category === 'Give away' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={editFormData.website}
                      onChange={(e) => setEditFormData({...editFormData, website: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Social Media
                    </label>
                    <input
                      type="url"
                      value={editFormData.socialMedia}
                      onChange={(e) => setEditFormData({...editFormData, socialMedia: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                </>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleEditCancel}
                className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={isUploading}
                className={`flex-1 px-4 py-3 rounded-lg transition-colors duration-200 text-sm sm:text-base font-medium flex items-center justify-center gap-2 ${
                  isUploading 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  'Update Post'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};