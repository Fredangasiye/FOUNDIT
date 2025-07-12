import React, { useState } from 'react';
import { ArrowLeft, User, Home, Phone, Upload, X, Save, Mail } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfilePageProps {
  user: UserType | null;
  onUpdateProfile: (userData: Partial<UserType>) => void;
  onNavigate: (page: 'Home') => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateProfile, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    unitNumber: user?.unitNumber || '',
    phone: user?.phone || '',
    profilePhoto: user?.profilePhoto || '',
    email: user?.email || ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.unitNumber || !formData.phone) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onUpdateProfile(formData);
    setLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, profilePhoto: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, profilePhoto: '' }));
  };

  if (!user) {
    return null;
  }

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
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
          {/* Profile Photo */}
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Profile Photo
            </label>
            
            {formData.profilePhoto ? (
              <div className="relative inline-block">
                <img
                  src={formData.profilePhoto}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full border-4 border-gray-300 mx-auto"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto border-4 border-gray-300">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
            
            <label className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors duration-200">
              <Upload className="w-4 h-4" />
              Upload Photo
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Email (for Google users) */}
          {user?.authProvider === 'google' && (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  placeholder="Email from Google account"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed for Google accounts</p>
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Unit Number */}
          <div>
            <label htmlFor="unitNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Apartment Number *
            </label>
            <div className="relative">
              <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="unitNumber"
                type="text"
                value={formData.unitNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, unitNumber: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., 4B, 205, etc."
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number {user?.authProvider === 'google' ? '(Optional)' : '*'}
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="phone"
                type="tel"
                pattern="[0-9]*"
                inputMode="numeric"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setFormData(prev => ({ ...prev, phone: value }));
                }}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your phone number (digits only)"
                required={user?.authProvider !== 'google'}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.name || !formData.unitNumber || (user?.authProvider !== 'google' && !formData.phone)}
            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};