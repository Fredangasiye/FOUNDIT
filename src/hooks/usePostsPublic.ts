import { useState, useEffect } from 'react';
import { createPost, getPosts, getPostsByCategory, deletePost as firestoreDeletePost, updatePost } from '../services/firestoreService';
import { Post } from '../types';

// Admin configuration - change this to your details
const ADMIN_EMAIL = 'fred@foundit.com'; // Change this to your email
const ADMIN_PHONE = '+27795778455'; // Change this to your phone

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

  // Re-check admin status when component re-renders
  useEffect(() => {
    const checkAdmin = () => {
      const adminEmail = localStorage.getItem('foundit_admin_email');
      const adminPhone = localStorage.getItem('foundit_admin_phone');
      return adminEmail === ADMIN_EMAIL && adminPhone === ADMIN_PHONE;
    };
    setIsAdmin(checkAdmin());
  }, [posts]);

  // Load posts from Firebase on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
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
      const fetchedPosts = await getPostsByCategory(category);
      setPosts(fetchedPosts);
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

      await createPost(newPost);
      await loadPosts(); // Reload posts to get the latest data
      return true;
    } catch (error: any) {
      console.error('Error creating post:', error);
      setError(error.message || 'Failed to create post');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await firestoreDeletePost(postId);
      await loadPosts(); // Reload posts after deletion
      return true;
    } catch (error: any) {
      console.error('Error deleting post:', error);
      setError(error.message || 'Failed to delete post');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const editPost = async (postId: string, updatedData: Partial<Post>): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // Update post in Firebase
      await updatePost(postId, updatedData);
      
      // Update local state
      const updatedPosts = posts.map(post => 
        post.id === postId ? { ...post, ...updatedData } : post
      );
      setPosts(updatedPosts);
      return true;
    } catch (error: any) {
      console.error('Error editing post:', error);
      setError(error.message || 'Failed to edit post');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPosts = (category: string) => {
    return posts.filter(post => post.category === category);
  };

  const handleAdminLogin = (email: string, phone: string) => {
    if (email === ADMIN_EMAIL && phone === ADMIN_PHONE) {
      localStorage.setItem('foundit_admin_email', email);
      localStorage.setItem('foundit_admin_phone', phone);
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('foundit_admin_email');
    localStorage.removeItem('foundit_admin_phone');
    setIsAdmin(false);
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
    handleAdminLogin,
    handleAdminLogout
  };
};