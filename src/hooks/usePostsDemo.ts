import { useState, useEffect } from 'react';
import { Post } from '../types';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
            userPhone: '+1234567890',
            userName: 'Demo User',
            unitNumber: '4B'
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
            userPhone: '+1234567890',
            userName: 'Demo User',
            unitNumber: '4B'
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
            userPhone: '+1234567890',
            userName: 'Demo User',
            unitNumber: '4B'
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
        userPhone: currentUser.phone || '+1234567890',
        userName: currentUser.name || 'Demo User',
        unitNumber: currentUser.unitNumber || '4B'
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