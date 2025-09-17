import { useState, useEffect } from 'react';
import { createPost, getPosts, getPostsByCategory } from '../services/firestoreService';
import { Post } from '../types';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load posts from Firestore on component mount
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

  const addPost = async (postData: Omit<Post, 'id' | 'datePosted' | 'userPhone' | 'userName' | 'unitNumber'>, currentUser: any): Promise<boolean> => {
    if (!currentUser) {
      setError('You must be logged in to create a post');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const newPost: Post = {
        ...postData,
        id: Date.now().toString(),
        datePosted: new Date(),
        userPhone: currentUser.phone,
        userName: currentUser.name,
        unitNumber: currentUser.unitNumber
      };

      await createPost(newPost);
      // Reload posts to get the latest data
      await loadPosts();
      return true;
    } catch (error: any) {
      console.error('Error creating post:', error);
      setError(error.message || 'Failed to create post');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPosts = (category: string) => {
    return posts.filter(post => post.category === category);
  };

  return {
    posts,
    loading,
    error,
    addPost,
    loadPosts,
    loadPostsByCategory,
    getFilteredPosts
  };
}; 