import React, { useState } from 'react';
import { ArrowLeft, Upload, X, Send, Globe, Share2 } from 'lucide-react';
import { uploadImage } from '../services/storageServiceDemo';

interface NewPostPageProps {
  onCreatePost: (postData: {
    title: string;
    description: string;
    category: 'Lost' | 'Found' | 'For Sale/Services';
    image: string;
    imagePath?: string;
    price?: number;
    website?: string;
    socialMedia?: string;
    contactName: string;
    contactPhone: string;
    contactWhatsApp: string;
    contactEmail: string;
    unitNumber: string;
  }) => void;
  onNavigate: (page: 'Home') => void;
}

export const NewPostPage: React.FC<NewPostPageProps> = ({ onCreatePost, onNavigate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Lost' as 'Lost' | 'Found' | 'For Sale/Services',
    image: '',
    imagePath: '',
    price: undefined as number | undefined,
    website: '',
    socialMedia: '',
    contactName: '',
    contactPhone: '',
    contactWhatsApp: '',
    contactEmail: '',
    unitNumber: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.contactName || !formData.contactPhone || !formData.contactEmail || !formData.unitNumber) {
      alert('Please fill in all required fields including contact information');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onCreatePost(formData);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Generate a temporary user ID for upload (will be replaced with actual user ID in production)
      const tempUserId = 'temp_user_' + Date.now();
      const result = await uploadImage(file, tempUserId);
      
      setFormData(prev => ({ 
        ...prev, 
        image: result.url,
        imagePath: result.path
      }));
      
      // Show success feedback
      console.log('Image uploaded successfully:', result.url);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '', imagePath: '' }));
  };

  const categories = [
    { value: 'Lost', label: 'Lost', color: 'bg-red-100 text-red-800 border-red-200' },
    { value: 'Found', label: 'Found', color: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'For Sale/Services', label: 'For Sale/Services', color: 'bg-blue-100 text-blue-800 border-blue-200' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('Home')}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter a descriptive title"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: category.value as 'Lost' | 'Found' | 'For Sale/Services' }))}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    formData.category === category.value
                      ? `${category.color} border-transparent`
                      : `${category.color} hover:shadow-md`
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Provide detailed information about your post"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image (Optional)
            </label>
            {formData.image ? (
              <div className="relative">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">Upload an image to your post</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={loading}
                />
                <label
                  htmlFor="image-upload"
                  className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                    loading 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {loading ? 'Uploading...' : 'Choose Image'}
                </label>
              </div>
            )}
          </div>

          {/* Price (for For Sale/Services) */}
          {formData.category === 'For Sale/Services' && (
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (R)
              </label>
              <input
                id="price"
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value ? Number(e.target.value) : undefined }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter price in Rands"
                min="0"
              />
            </div>
          )}

          {/* Website (for For Sale/Services) */}
          {formData.category === 'For Sale/Services' && (
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://your-website.com"
                />
              </div>
            </div>
          )}

          {/* Social Media (for For Sale/Services) */}
          {formData.category === 'For Sale/Services' && (
            <div>
              <label htmlFor="socialMedia" className="block text-sm font-medium text-gray-700 mb-2">
                Social Media Link
              </label>
              <div className="relative">
                <Share2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="socialMedia"
                  type="url"
                  value={formData.socialMedia}
                  onChange={(e) => setFormData(prev => ({ ...prev, socialMedia: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://instagram.com/your-profile"
                />
              </div>
            </div>
          )}

          {/* Contact Information Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information *</h3>
            
            {/* Contact Name */}
            <div className="mb-4">
              <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                id="contactName"
                type="text"
                value={formData.contactName}
                onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Unit Number */}
            <div className="mb-4">
              <label htmlFor="unitNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Unit Number *
              </label>
              <input
                id="unitNumber"
                type="text"
                value={formData.unitNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, unitNumber: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., 4B, 205, etc."
                required
              />
            </div>

            {/* Contact Phone */}
            <div className="mb-4">
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="+1234567890"
                required
              />
            </div>

            {/* WhatsApp */}
            <div className="mb-4">
              <label htmlFor="contactWhatsApp" className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Number
              </label>
              <input
                id="contactWhatsApp"
                type="tel"
                value={formData.contactWhatsApp}
                onChange={(e) => setFormData(prev => ({ ...prev, contactWhatsApp: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="+1234567890 (optional)"
              />
            </div>

            {/* Contact Email */}
            <div className="mb-4">
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                Create Post
                <Send className="ml-2 w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
