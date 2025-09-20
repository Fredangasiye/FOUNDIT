export interface User {
  id: string;
  name: string;
  unitNumber: string;
  phone?: string; // Optional since we're using email for authentication
  email: string; // Required for authentication
  password: string;
  profilePhoto: string;
  authProvider?: 'local' | 'google';
}

export interface Post {
  id: string;
  title: string;
  description: string;
  category: 'Lost' | 'Found' | 'For Sale/Services';
  image: string;
  imagePath?: string; // Firebase Storage path for permanent file storage
  price?: number; // Price in RANDS for For Sale/Services posts
  website?: string; // Website URL for For Sale/Services posts
  socialMedia?: string; // Social media link for For Sale/Services posts
  datePosted: Date;
  // Contact Information
  contactName: string;
  contactPhone: string;
  contactWhatsApp: string;
  contactEmail?: string; // Optional email field
  unitNumber: string;
  // Admin fields
  isAdminPost?: boolean;
}

export type CreatePostData = Omit<Post, 'id'>;