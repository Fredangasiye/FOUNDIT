export interface User {
  id: string;
  name: string;
  unitNumber: string;
  phone: string;
  password: string;
  profilePhoto: string;
  authProvider?: 'local' | 'google';
  email?: string;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  category: 'Lost' | 'Found' | 'For Sale/Services';
  image: string;
  price?: number; // Price in RANDS for For Sale/Services posts
  website?: string; // Website URL for For Sale/Services posts
  socialMedia?: string; // Social media link for For Sale/Services posts
  datePosted: Date;
  userPhone: string;
  userName: string;
  unitNumber: string;
}