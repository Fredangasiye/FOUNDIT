import React, { useState } from 'react';
import { ArrowLeft, Upload, X, Send, Globe, Share2 } from 'lucide-react';
import { uploadImage } from '../services/imageService';
// import { trackPostCreated, trackImageUpload } from '../utils/analytics';
import { compressImage, validateImageFile } from '../utils/imageCompression';

interface NewPostPageProps {
  onCreatePost: (postData: {
    title: string;
    description: string;
    category: 'Lost' | 'Found' | 'For Sale/Give away' | 'EVENTS';
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
    eventDate?: string;
    eventTime?: string;
    eventLocation?: string;
    eventLink?: string;
  }) => void;
  onNavigate: (page: 'Home') => void;
}

export const NewPostPage: React.FC<NewPostPageProps> = ({ onCreatePost, onNavigate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Lost' as 'Lost' | 'Found' | 'For Sale/Give away' | 'EVENTS',
    image: '',
    image2: '',
    imagePath: '',
    imagePath2: '',
    price: undefined as number | undefined,
    isNegotiable: false,
    website: '',
    socialMedia: '',
    contactName: '',
    contactPhone: '',
    contactWhatsApp: '',
    contactEmail: '',
    unitNumber: '',
    eventDate: '',
    eventTime: '',
    eventLocation: '',
    eventLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [syncWhatsApp, setSyncWhatsApp] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

  // Auto-sync WhatsApp number when phone number changes and sync is enabled
  React.useEffect(() => {
    if (syncWhatsApp && formData.contactPhone) {
      // Extract just the number part (remove any existing country code)
      let phoneNumber = formData.contactPhone;
      
      // Remove common country codes if they exist
      if (phoneNumber.startsWith('+27')) {
        phoneNumber = phoneNumber.substring(3).trim();
      } else if (phoneNumber.startsWith('27')) {
        phoneNumber = phoneNumber.substring(2).trim();
      } else if (phoneNumber.startsWith('0')) {
        phoneNumber = phoneNumber.substring(1);
      }
      
      // Set WhatsApp with +27 country code and the cleaned number
      setFormData(prev => ({ 
        ...prev, 
        contactWhatsApp: `+27 ${phoneNumber}` 
      }));
    }
  }, [formData.contactPhone, syncWhatsApp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.contactName || !formData.contactPhone || !formData.contactWhatsApp || !formData.unitNumber) {
      alert('Please fill in all required fields including contact information');
      return;
    }

    setLoading(true);
    
    // Prepare post data, filtering out empty optional fields
    const postData: any = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      contactName: formData.contactName,
      contactPhone: formData.contactPhone,
      contactWhatsApp: formData.contactWhatsApp,
      unitNumber: formData.unitNumber,
      image: formData.image,
      imagePath: formData.imagePath
    };

    // Add second image for For Sale/Give away posts
    if (formData.category === 'For Sale/Give away' && formData.image2) {
      postData.image2 = formData.image2;
      postData.imagePath2 = formData.imagePath2;
    }

    // Only include optional fields if they have values
    if (formData.price !== undefined && formData.price > 0) {
      postData.price = formData.price;
    } else if (formData.price === -1) {
      // Price on Request - we'll handle this in the display logic
      postData.price = -1;
    }
    if (formData.isNegotiable) {
      postData.isNegotiable = formData.isNegotiable;
    }
    if (formData.contactEmail && formData.contactEmail.trim() !== '') {
      postData.contactEmail = formData.contactEmail;
    }
    if (formData.website && formData.website.trim() !== '') {
      postData.website = formData.website;
    }
    if (formData.socialMedia && formData.socialMedia.trim() !== '') {
      postData.socialMedia = formData.socialMedia;
    }
    
    // Add event-specific fields for EVENTS category
    if (formData.category === 'EVENTS') {
      if (formData.eventDate && formData.eventDate.trim() !== '') {
        postData.eventDate = formData.eventDate;
      }
      if (formData.eventTime && formData.eventTime.trim() !== '') {
        postData.eventTime = formData.eventTime;
      }
      if (formData.eventLocation && formData.eventLocation.trim() !== '') {
        postData.eventLocation = formData.eventLocation;
      }
      if (formData.eventLink && formData.eventLink.trim() !== '') {
        postData.eventLink = formData.eventLink;
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Track post creation
    // trackPostCreated(formData.category, !!formData.image);
    
    onCreatePost(postData);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 2 images for For Sale/Give away, 1 for others
    const maxImages = formData.category === 'For Sale/Give away' ? 2 : 1;
    if (files.length > maxImages) {
      alert(`Please select maximum ${maxImages} image(s) for ${formData.category} posts`);
      return;
    }

    // Validate all files
    for (const file of files) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }
    }

    setIsCompressing(true);
    setLoading(true);
    
    try {
      const compressedFiles: File[] = [];
      
      // Compress all images
      for (const file of files) {
        console.log('🖼️ Compressing image:', file.name);
        const compressedFile = await compressImage(file);
        compressedFiles.push(compressedFile);
      }

      setSelectedFiles(compressedFiles);
      
      // Create previews
      const previews: string[] = [];
      for (const file of compressedFiles) {
        const preview = URL.createObjectURL(file);
        previews.push(preview);
      }
      setImagePreviews(previews);

      // Upload images
      const tempUserId = 'temp_user_' + Date.now();
      const uploadPromises = compressedFiles.map((file, index) => 
        uploadImage(file, `${tempUserId}_${index}`)
      );
      
      const results = await Promise.all(uploadPromises);
      
      // Update form data with uploaded images
      const imageUrls = results.map(result => result.url);
      const imagePaths = results.map(result => result.path);
      
      setFormData(prev => ({
        ...prev,
        image: imageUrls[0] || '',
        imagePath: imagePaths[0] || '',
        image2: imageUrls[1] || '',
        imagePath2: imagePaths[1] || ''
      }));

      console.log('✅ Images uploaded successfully:', imageUrls);
      // trackImageUpload(true, compressedFiles.reduce((sum, file) => sum + file.size, 0));
      
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Error uploading images. Please try again.');
    } finally {
      setIsCompressing(false);
      setLoading(false);
    }
  };

  const removeImage = (index: number = 0) => {
    if (index === 0) {
      setFormData(prev => ({ 
        ...prev, 
        image: formData.image2 || '', 
        imagePath: formData.imagePath2 || '',
        image2: '', 
        imagePath2: '' 
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        image2: '', 
        imagePath2: '' 
      }));
    }
    
    // Update previews
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
    
    // Update selected files
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);
  };


  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('Home')}
              className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded-full transition-all duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-100">Create New Post</h1>
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
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'Lost' | 'Found' | 'For Sale/Give away' | 'EVENTS' }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
              <option value="For Sale/Give away">For Sale/Give away</option>
              <option value="EVENTS">Events & Meetings</option>
            </select>
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
              {formData.category === 'For Sale/Give away' ? 'Images (Optional - up to 2)' : 'Image (Optional)'}
            </label>
            
            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Upload Area */}
            {imagePreviews.length < (formData.category === 'For Sale/Give away' ? 2 : 1) && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-2">
                  {formData.category === 'For Sale/Give away' 
                    ? `Upload up to 2 images (${imagePreviews.length}/2)`
                    : 'Upload an image to your post'
                  }
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple={formData.category === 'For Sale/Give away'}
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={loading || isCompressing}
                />
                <label
                  htmlFor="image-upload"
                  className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                    loading || isCompressing
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isCompressing ? 'Compressing...' : loading ? 'Uploading...' : 'Choose Image(s)'}
                </label>
                {isCompressing && (
                  <p className="text-sm text-gray-500 mt-2">Optimizing images for faster loading...</p>
                )}
              </div>
            )}
          </div>

          {/* Price (for For Sale/Give away) */}
          {formData.category === 'For Sale/Give away' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Pricing
              </label>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="price-specific"
                    type="radio"
                    name="priceType"
                    value="specific"
                    checked={formData.price !== -1}
                    onChange={() => setFormData(prev => ({ ...prev, price: undefined, isNegotiable: false }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="price-specific" className={`ml-2 text-sm font-medium ${
                    formData.price !== -1 ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    Set specific price
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="price-request"
                    type="radio"
                    name="priceType"
                    value="request"
                    checked={formData.price === -1}
                    onChange={() => setFormData(prev => ({ ...prev, price: -1, isNegotiable: false }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="price-request" className={`ml-2 text-sm font-medium ${
                    formData.price === -1 ? 'text-blue-600' : 'text-gray-700'
                  }`}>
                    Price on Request
                  </label>
                </div>
              </div>
              {formData.price !== -1 && (
                <div className="mt-3 space-y-3">
                  <input
                    id="price"
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value ? Number(e.target.value) : undefined }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter price in Rands"
                    min="0"
                  />
                  <div className="flex items-center">
                    <input
                      id="negotiable"
                      type="checkbox"
                      checked={formData.isNegotiable}
                      onChange={(e) => setFormData(prev => ({ ...prev, isNegotiable: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="negotiable" className="ml-2 text-sm font-medium text-gray-700">
                      Price is negotiable
                    </label>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Website (for For Sale/Give away) */}
          {formData.category === 'For Sale/Give away' && (
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
                  onChange={(e) => {
                    let value = e.target.value;
                    // Auto-add https:// if user doesn't include a protocol
                    if (value && !value.match(/^https?:\/\//)) {
                      value = `https://${value}`;
                    }
                    setFormData(prev => ({ ...prev, website: value }));
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="your-website.com"
                />
              </div>
            </div>
          )}

          {/* Facebook Marketplace Link (for For Sale/Give away) */}
          {formData.category === 'For Sale/Give away' && (
            <div>
              <label htmlFor="socialMedia" className="block text-sm font-medium text-gray-700 mb-2">
                Facebook Marketplace Link (Optional)
              </label>
              <div className="relative">
                <Share2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="socialMedia"
                  type="url"
                  value={formData.socialMedia}
                  onChange={(e) => {
                    let value = e.target.value;
                    // Auto-add https:// if user doesn't include a protocol
                    if (value && !value.match(/^https?:\/\//)) {
                      value = `https://${value}`;
                    }
                    setFormData(prev => ({ ...prev, socialMedia: value }));
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="facebook.com/marketplace/item/..."
                />
              </div>
            </div>
          )}

          {/* Event Information Section - Only show for EVENTS category */}
          {formData.category === 'EVENTS' && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Event Date */}
                <div>
                  <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    value={formData.eventDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Event Time */}
                <div>
                  <label htmlFor="eventTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Time
                  </label>
                  <input
                    type="time"
                    id="eventTime"
                    value={formData.eventTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventTime: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                {/* Event Location */}
                <div>
                  <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Location
                  </label>
                  <input
                    type="text"
                    id="eventLocation"
                    value={formData.eventLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, eventLocation: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., Community Center, Church Hall"
                  />
                </div>
              </div>

              {/* Event Link */}
              <div>
                <label htmlFor="eventLink" className="block text-sm font-medium text-gray-700 mb-2">
                  Event/Meeting Link
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-purple-500" />
                  </div>
                  <input
                    type="url"
                    id="eventLink"
                    value={formData.eventLink}
                    onChange={(e) => {
                      let value = e.target.value;
                      // Auto-add https:// if not present
                      if (value && !value.match(/^https?:\/\//)) {
                        value = `https://${value}`;
                      }
                      setFormData(prev => ({ ...prev, eventLink: value }));
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="https://zoom.us/j/123456789 or https://eventbrite.com/..."
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  For online events, Zoom meetings, or event registration pages
                </p>
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
                onChange={(e) => {
                  // Only allow numbers and letters (for unit numbers like 4B, 205, etc.)
                  const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
                  setFormData(prev => ({ ...prev, unitNumber: value }));
                }}
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
                WhatsApp Number *
              </label>
              
              {/* Auto-fill option */}
              <div className="mb-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={syncWhatsApp}
                    onChange={(e) => {
                      setSyncWhatsApp(e.target.checked);
                      if (e.target.checked && formData.contactPhone) {
                        // Extract just the number part (remove any existing country code)
                        let phoneNumber = formData.contactPhone;
                        
                        // Remove common country codes if they exist
                        if (phoneNumber.startsWith('+27')) {
                          phoneNumber = phoneNumber.substring(3).trim();
                        } else if (phoneNumber.startsWith('27')) {
                          phoneNumber = phoneNumber.substring(2).trim();
                        } else if (phoneNumber.startsWith('0')) {
                          phoneNumber = phoneNumber.substring(1);
                        }
                        
                        // Set WhatsApp with +27 country code and the cleaned number
                        setFormData(prev => ({ 
                          ...prev, 
                          contactWhatsApp: `+27 ${phoneNumber}` 
                        }));
                      }
                    }}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-600">
                    Use same number as phone number
                  </span>
                </label>
              </div>

              <div className="flex">
                <select
                  value={formData.contactWhatsApp.split(' ')[0] || '+27'}
                  onChange={(e) => {
                    const currentNumber = formData.contactWhatsApp.split(' ').slice(1).join(' ');
                    setFormData(prev => ({ 
                      ...prev, 
                      contactWhatsApp: `${e.target.value} ${currentNumber}`.trim()
                    }));
                  }}
                  className="px-3 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 border-r-0"
                >
                  <option value="+27">🇿🇦 +27</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+39">🇮🇹 +39</option>
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+31">🇳🇱 +31</option>
                  <option value="+32">🇧🇪 +32</option>
                  <option value="+41">🇨🇭 +41</option>
                  <option value="+43">🇦🇹 +43</option>
                  <option value="+45">🇩🇰 +45</option>
                  <option value="+46">🇸🇪 +46</option>
                  <option value="+47">🇳🇴 +47</option>
                  <option value="+358">🇫🇮 +358</option>
                  <option value="+48">🇵🇱 +48</option>
                  <option value="+420">🇨🇿 +420</option>
                  <option value="+421">🇸🇰 +421</option>
                  <option value="+36">🇭🇺 +36</option>
                  <option value="+40">🇷🇴 +40</option>
                  <option value="+359">🇧🇬 +359</option>
                  <option value="+385">🇭🇷 +385</option>
                  <option value="+386">🇸🇮 +386</option>
                  <option value="+372">🇪🇪 +372</option>
                  <option value="+371">🇱🇻 +371</option>
                  <option value="+370">🇱🇹 +370</option>
                  <option value="+7">🇷🇺 +7</option>
                  <option value="+380">🇺🇦 +380</option>
                  <option value="+375">🇧🇾 +375</option>
                </select>
                <input
                  id="contactWhatsApp"
                  type="tel"
                  value={formData.contactWhatsApp.split(' ').slice(1).join(' ')}
                  onChange={(e) => {
                    const countryCode = formData.contactWhatsApp.split(' ')[0] || '+27';
                    const newValue = `${countryCode} ${e.target.value}`.trim();
                    setFormData(prev => ({ 
                      ...prev, 
                      contactWhatsApp: newValue
                    }));
                    // Disable sync if user manually changes WhatsApp number
                    // Compare just the number part (without country code)
                    const phoneNumberOnly = formData.contactPhone.replace(/^(\+27|27|0)/, '').trim();
                    const whatsappNumberOnly = e.target.value.trim();
                    if (whatsappNumberOnly !== phoneNumberOnly) {
                      setSyncWhatsApp(false);
                    }
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="795778455"
                  required
                />
              </div>
            </div>

            {/* Contact Email */}
            <div className="mb-4">
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="your.email@example.com (optional)"
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
