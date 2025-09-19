import { useState, useEffect, useCallback } from 'react';
import { createPost, getPosts, getPostsByCategory, deletePost as firestoreDeletePost } from '../services/firestoreService';
import { Post } from '../types';

const POSTS_PER_PAGE = 20; // Optimized for performance

export const usePostsProduction = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  // Load posts with pagination
  const loadPosts = useCallback(async (page: number = 1, category?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      let fetchedPosts: Post[];
      
      if (category) {
        fetchedPosts = await getPostsByCategory(category);
      } else {
        fetchedPosts = await getPosts();
      }

      // Calculate pagination
      const total = fetchedPosts.length;
      const totalPages = Math.ceil(total / POSTS_PER_PAGE);
      const startIndex = (page - 1) * POSTS_PER_PAGE;
      const endIndex = startIndex + POSTS_PER_PAGE;
      const paginatedPosts = fetchedPosts.slice(startIndex, endIndex);

      setPosts(paginatedPosts);
      setTotalPosts(total);
      setTotalPages(totalPages);
      setCurrentPage(page);
    } catch (error: any) {
      console.error('Error loading posts:', error);
      setError(error.message || 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load posts by category with pagination
  const loadPostsByCategory = useCallback(async (category: string, page: number = 1) => {
    await loadPosts(page, category);
  }, [loadPosts]);

  // Add new post
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
      
      // Reload current page to show the new post
      await loadPosts(currentPage);
      return true;
    } catch (error: any) {
      console.error('Error creating post:', error);
      setError(error.message || 'Failed to create post');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete post
  const deletePost = async (postId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await firestoreDeletePost(postId);
      
      // Reload current page
      await loadPosts(currentPage);
      return true;
    } catch (error: any) {
      console.error('Error deleting post:', error);
      setError(error.message || 'Failed to delete post');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get filtered posts (for category tabs)
  const getFilteredPosts = (category: string) => {
    return posts.filter(post => post.category === category);
  };

  // Search posts
  const searchPosts = useCallback(async (query: string, category?: string) => {
    if (!query.trim()) {
      await loadPosts(1, category);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let allPosts: Post[];
      
      if (category) {
        allPosts = await getPostsByCategory(category);
      } else {
        allPosts = await getPosts();
      }

      // Filter posts by search query
      const filteredPosts = allPosts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.description.toLowerCase().includes(query.toLowerCase()) ||
        post.contactName.toLowerCase().includes(query.toLowerCase())
      );

      // Apply pagination to search results
      const total = filteredPosts.length;
      const totalPages = Math.ceil(total / POSTS_PER_PAGE);
      const startIndex = 0;
      const endIndex = POSTS_PER_PAGE;
      const paginatedPosts = filteredPosts.slice(startIndex, endIndex);

      setPosts(paginatedPosts);
      setTotalPosts(total);
      setTotalPages(totalPages);
      setCurrentPage(1);
    } catch (error: any) {
      console.error('Error searching posts:', error);
      setError(error.message || 'Failed to search posts');
    } finally {
      setLoading(false);
    }
  }, [loadPosts]);

  // Load initial posts
  useEffect(() => {
    loadPosts(1);
  }, [loadPosts]);

  return {
    posts,
    loading,
    error,
    currentPage,
    totalPages,
    totalPosts,
    postsPerPage: POSTS_PER_PAGE,
    addPost,
    deletePost,
    loadPosts,
    loadPostsByCategory,
    getFilteredPosts,
    searchPosts,
    setCurrentPage
  };
};