import React, { useState } from 'react';
import { ArrowLeft, Upload, X, Send, Globe, Share2 } from 'lucide-react';
import { uploadImage, validateImageFile } from '../services/imageService';
// import { trackPostCreated, trackImageUpload } from '../utils/analytics';

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
  const [syncWhatsApp, setSyncWhatsApp] = useState(false);

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
      image: formData.image
    };

    // Only include optional fields if they have values
    if (formData.price !== undefined && formData.price > 0) {
      postData.price = formData.price;
    } else if (formData.price === -1) {
      // Price on Request - we'll handle this in the display logic
      postData.price = -1;
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
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Track post creation
    // trackPostCreated(formData.category, !!formData.image);
    
    onCreatePost(postData);
    setLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file before upload
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setLoading(true);
    try {
      // Generate a temporary user ID for upload (will be replaced with actual user ID in production)
      const tempUserId = 'temp_user_' + Date.now();
      const result = await uploadImage(file, tempUserId);
      
      if (result.success) {
        setFormData(prev => ({ 
          ...prev, 
          image: result.url,
          imagePath: result.path
        }));
        console.log('Image uploaded successfully:', result.url);
        // trackImageUpload(true, file.size);
      } else {
        // Still set the image (fallback) but show warning
        setFormData(prev => ({ 
          ...prev, 
          image: result.url,
          imagePath: result.path
        }));
        console.warn('Image upload failed, using fallback:', result.error);
        alert('Image upload failed, but you can still create the post. The image will show a placeholder.');
        // trackImageUpload(false, file.size);
      }
    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image. Please try again.");
      // trackImageUpload(false, file.size);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: '', imagePath: '' }));
  };


  return (
    <div className="min-h-screen bg-gray-900">
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
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'Lost' | 'Found' | 'For Sale/Services' }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
              <option value="For Sale/Services">For Sale/Services</option>
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
                    checked={formData.price !== undefined && formData.price !== -1}
                    onChange={() => setFormData(prev => ({ ...prev, price: undefined }))}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor="price-specific" className={`ml-2 text-sm font-medium ${
                    formData.price !== undefined && formData.price !== -1 ? 'text-blue-600' : 'text-gray-700'
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
                    onChange={() => setFormData(prev => ({ ...prev, price: -1 }))}
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
                <div className="mt-3">
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

          {/* Facebook Marketplace Link (for For Sale/Services) */}
          {formData.category === 'For Sale/Services' && (
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
