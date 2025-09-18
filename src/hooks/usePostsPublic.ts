import { useState, useEffect } from 'react';
import { Post } from '../types';

// Admin configuration - change this to your details
const ADMIN_EMAIL = 'admin@foundit.com'; // Change this to your email
const ADMIN_PHONE = '+1234567890'; // Change this to your phone

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if current user is admin
  useEffect(() => {
    const checkAdmin = () => {
      const adminEmail = localStorage.getItem('foundit_admin_email');
      const adminPhone = localStorage.getItem('foundit_admin_phone');
      return adminEmail === ADMIN_EMAIL && adminPhone === ADMIN_PHONE;
    };
    setIsAdmin(checkAdmin());
  }, []);

  // Load posts from localStorage on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const savedPosts = localStorage.getItem('foundit_posts');
      if (savedPosts) {
        const fetchedPosts = JSON.parse(savedPosts);
        setPosts(fetchedPosts);
      } else {
        // Create some demo posts
        const demoPosts: Post[] = [
          {
            id: '1',
            title: 'Lost: Black iPhone 13',
            description: 'Lost my black iPhone 13 near the pool area. Has a clear case with a photo of my dog.',
            category: 'Lost',
            image: 'https://via.placeholder.com/400x300?text=Lost+iPhone',
            price: undefined,
            website: '',
            socialMedia: '',
            datePosted: new Date(Date.now() - 86400000), // 1 day ago
            contactName: 'John Smith',
            contactPhone: '+1234567890',
            contactWhatsApp: '+1234567890',
            contactEmail: 'john@example.com',
            unitNumber: '4B',
            isAdminPost: false
          },
          {
            id: '2',
            title: 'Found: Blue Backpack',
            description: 'Found a blue backpack in the lobby. Please contact me if it\'s yours.',
            category: 'Found',
            image: 'https://via.placeholder.com/400x300?text=Found+Backpack',
            price: undefined,
            website: '',
            socialMedia: '',
            datePosted: new Date(Date.now() - 172800000), // 2 days ago
            contactName: 'Sarah Johnson',
            contactPhone: '+0987654321',
            contactWhatsApp: '+0987654321',
            contactEmail: 'sarah@example.com',
            unitNumber: '2A',
            isAdminPost: false
          },
          {
            id: '3',
            title: 'For Sale: Coffee Table',
            description: 'Beautiful wooden coffee table in excellent condition. Perfect for living room.',
            category: 'For Sale/Services',
            image: 'https://via.placeholder.com/400x300?text=Coffee+Table',
            price: 150,
            website: '',
            socialMedia: '',
            datePosted: new Date(Date.now() - 259200000), // 3 days ago
            contactName: 'Mike Wilson',
            contactPhone: '+1122334455',
            contactWhatsApp: '+1122334455',
            contactEmail: 'mike@example.com',
            unitNumber: '6C',
            isAdminPost: false
          }
        ];
        setPosts(demoPosts);
        localStorage.setItem('foundit_posts', JSON.stringify(demoPosts));
      }
    } catch (error: any) {
      console.error('Error loading posts:', error);
      setError(error.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const loadPostsByCategory = async (category: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const savedPosts = localStorage.getItem('foundit_posts');
      if (savedPosts) {
        const allPosts = JSON.parse(savedPosts);
        const filteredPosts = allPosts.filter((post: Post) => post.category === category);
        setPosts(filteredPosts);
      }
    } catch (error: any) {
      console.error('Error loading posts by category:', error);
      setError(error.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const addPost = async (postData: Omit<Post, 'id' | 'datePosted' | 'isAdminPost'>): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const newPost: Post = {
        ...postData,
        id: Date.now().toString(),
        datePosted: new Date(),
        isAdminPost: false
      };

      const updatedPosts = [newPost, ...posts];
      setPosts(updatedPosts);
      localStorage.setItem('foundit_posts', JSON.stringify(updatedPosts));
      setLoading(false);
      return true;
    } catch (error: any) {
      console.error('Error creating post:', error);
      setError(error.message || 'Failed to create post');
      setLoading(false);
      return false;
    }
  };

  const deletePost = async (postId: string): Promise<boolean> => {
    if (!isAdmin) {
      setError('Only admin can delete posts');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedPosts = posts.filter(post => post.id !== postId);
      setPosts(updatedPosts);
      localStorage.setItem('foundit_posts', JSON.stringify(updatedPosts));
      setLoading(false);
      return true;
    } catch (error: any) {
      console.error('Error deleting post:', error);
      setError(error.message || 'Failed to delete post');
      setLoading(false);
      return false;
    }
  };

  const editPost = async (postId: string, updatedData: Partial<Post>): Promise<boolean> => {
    if (!isAdmin) {
      setError('Only admin can edit posts');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const updatedPosts = posts.map(post => 
        post.id === postId ? { ...post, ...updatedData } : post
      );
      setPosts(updatedPosts);
      localStorage.setItem('foundit_posts', JSON.stringify(updatedPosts));
      setLoading(false);
      return true;
    } catch (error: any) {
      console.error('Error editing post:', error);
      setError(error.message || 'Failed to edit post');
      setLoading(false);
      return false;
    }
  };

  const loginAsAdmin = (email: string, phone: string): boolean => {
    if (email === ADMIN_EMAIL && phone === ADMIN_PHONE) {
      localStorage.setItem('foundit_admin_email', email);
      localStorage.setItem('foundit_admin_phone', phone);
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = (): void => {
    localStorage.removeItem('foundit_admin_email');
    localStorage.removeItem('foundit_admin_phone');
    setIsAdmin(false);
  };

  const getFilteredPosts = (category: string) => {
    return posts.filter(post => post.category === category);
  };

  return {
    posts,
    loading,
    error,
    isAdmin,
    addPost,
    deletePost,
    editPost,
    loadPosts,
    loadPostsByCategory,
    getFilteredPosts,
    loginAsAdmin,
    logoutAdmin
  };
};