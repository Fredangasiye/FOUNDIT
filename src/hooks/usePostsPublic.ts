import { useState, useEffect } from 'react';
import { createPost, getPosts, getPostsByCategory, deletePost as firestoreDeletePost, updatePost } from '../services/firestoreService';
import { trackAdminAction, trackBulkOperation } from '../utils/analytics';
import { Post, CreatePostData } from '../types';

// Admin configuration - change this to your details
const ADMIN_EMAIL = 'fred@foundit.com'; // Change this to your email
const ADMIN_PHONE = '0795774877'; // Change this to your phone

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [examplePostsAdded, setExamplePostsAdded] = useState(() => {
    return localStorage.getItem('foundit_example_posts_added') === 'true';
  });
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  
  // Initialize admin state immediately
  const checkAdminStatus = () => {
    const adminEmail = localStorage.getItem('foundit_admin_email');
    const adminPhone = localStorage.getItem('foundit_admin_phone');
    return adminEmail === ADMIN_EMAIL && adminPhone === ADMIN_PHONE;
  };
  
  const [isAdmin, setIsAdmin] = useState(checkAdminStatus);

  // Check if current user is admin on component mount and when posts change
  useEffect(() => {
    const checkAdmin = () => {
      const adminEmail = localStorage.getItem('foundit_admin_email');
      const adminPhone = localStorage.getItem('foundit_admin_phone');
      const isAdminUser = adminEmail === ADMIN_EMAIL && adminPhone === ADMIN_PHONE;
      return isAdminUser;
    };
    
    // Set admin state immediately
    const adminStatus = checkAdmin();
    setIsAdmin(adminStatus);
    
    // Also listen for storage changes (in case admin logs in/out in another tab)
    const handleStorageChange = () => {
      setIsAdmin(checkAdmin());
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Load posts from Firebase on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  // Add example posts after posts are loaded - DISABLED TO PREVENT DUPLICATES
  // useEffect(() => {
  //   if (!loading && posts.length === 0) {
  //     addExamplePostsIfNeeded();
  //   }
  // }, [loading, posts.length]);

  const addExamplePostsIfNeeded = async () => {
    // Wait for posts to load first, then check if we need examples
    if (loading || examplePostsAdded) return;
    
    // Check if example posts already exist (we expect 6 example posts)
    const adminPosts = posts.filter(post => post.isAdminPost === true);
    if (adminPosts.length >= 6) {
      console.log('Example posts already exist, skipping...');
      setExamplePostsAdded(true);
      localStorage.setItem('foundit_example_posts_added', 'true');
      return;
    }
    
    // Only add examples if there are no posts at all
    if (posts.length === 0) {
      const examplePosts: CreatePostData[] = [
        {
          title: "Lost: Black iPhone 13 Pro",
          description: "I lost my black iPhone 13 Pro yesterday evening around 7 PM. It has a clear case with a photo of my family inside. The phone was last seen near the main entrance. It's very important to me as it contains precious family photos. Please contact me if found!",
          category: "Lost" as const,
          contactName: "Sarah Johnson",
          contactPhone: "0821234567",
          contactEmail: "sarah.johnson@email.com",
          contactWhatsApp: "0821234567",
          unitNumber: "Unit 15",
          image: "/example-images/lost-iphone.svg",
          isAdminPost: true
        },
        {
          title: "Found: Blue Backpack with Laptop",
          description: "Found a blue backpack containing a Dell laptop near the parking area this morning. The backpack also has some books and a water bottle. I've kept it safe and would like to return it to the rightful owner. Please describe the contents to claim it.",
          category: "Found" as const,
          contactName: "Mike Chen",
          contactPhone: "0834567890",
          contactEmail: "mike.chen@email.com",
          contactWhatsApp: "0834567890",
          unitNumber: "Unit 8",
          image: "/example-images/found-backpack.svg",
          isAdminPost: true
        },
        {
          title: "Professional Photography Services",
          description: "Offering professional photography services for events, portraits, and real estate. 10+ years experience with high-quality equipment. Specializing in family portraits, corporate events, and property photography. Competitive rates and flexible scheduling available.",
          category: "For Sale/Services" as const,
          price: 500,
          contactName: "David Wilson",
          contactPhone: "0845678901",
          contactEmail: "david.wilson@photography.com",
          contactWhatsApp: "0845678901",
          unitNumber: "Unit 22",
          image: "/example-images/photography-service.svg",
          website: "https://davidwilsonphotography.com",
          socialMedia: "https://instagram.com/davidwilsonphoto",
          isAdminPost: true
        },
        {
          title: "Lost: Golden Retriever - Max",
          description: "Our beloved golden retriever Max went missing yesterday afternoon. He's 3 years old, very friendly, and wearing a blue collar with our contact info. Last seen near the playground area. He responds to his name and loves treats. Please help us find him!",
          category: "Lost" as const,
          contactName: "Emma Thompson",
          contactPhone: "0856789012",
          contactEmail: "emma.thompson@email.com",
          contactWhatsApp: "0856789012",
          unitNumber: "Unit 12",
          image: "/example-images/lost-dog.svg",
          isAdminPost: true
        },
        {
          title: "Found: Set of Car Keys",
          description: "Found a set of car keys with a small keychain near the mailboxes. The keys appear to be for a Toyota vehicle. I've left them with the building security. Please contact me to describe the keychain to claim them.",
          category: "Found" as const,
          contactName: "Lisa Park",
          contactPhone: "0867890123",
          contactEmail: "lisa.park@email.com",
          contactWhatsApp: "0867890123",
          unitNumber: "Unit 5",
          image: "/example-images/found-keys.svg",
          isAdminPost: true
        },
        {
          title: "Home Tutoring - Mathematics & Science",
          description: "Experienced tutor offering mathematics and science tutoring for high school students. Bachelor's degree in Engineering with 5+ years teaching experience. Available evenings and weekends. Can help with exam preparation and homework assistance.",
          category: "For Sale/Services" as const,
          price: 200,
          contactName: "Dr. James Miller",
          contactPhone: "0878901234",
          contactEmail: "james.miller@tutoring.com",
          contactWhatsApp: "0878901234",
          unitNumber: "Unit 18",
          image: "/example-images/tutoring-service.svg",
          website: "https://jamesmiller-tutoring.com",
          socialMedia: "https://facebook.com/jamesmiller-tutoring",
          isAdminPost: true
        }
      ];

      // Add each example post to Firebase
      for (const postData of examplePosts) {
        try {
          const postId = await createPost({
            ...postData,
            datePosted: new Date()
          });
          console.log(`Created example post with ID: ${postId}`);
        } catch (error) {
          console.error('Error adding example post:', error);
        }
      }
      
      // Reload posts to show the examples
      await loadPosts();
      setExamplePostsAdded(true);
      localStorage.setItem('foundit_example_posts_added', 'true');
    }
  };

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

  const addPost = async (postData: Omit<CreatePostData, 'datePosted' | 'isAdminPost'>): Promise<boolean> => {
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
      
      // Track admin delete action
      if (isAdmin) {
        trackAdminAction('delete_post', postId);
      }
      
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
      
      // Track admin edit action
      if (isAdmin) {
        trackAdminAction('edit_post', postId);
      }
      
      return true;
    } catch (error: any) {
      console.error('Error editing post:', error);
      setError(error.message || 'Failed to edit post');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Bulk delete functions
  const togglePostSelection = (postId: string) => {
    setSelectedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const selectAllPosts = () => {
    setSelectedPosts(new Set(posts.map(post => post.id)));
    
    // Track bulk operation
    if (isAdmin) {
      trackBulkOperation('select_all', posts.length);
    }
  };

  const clearSelection = () => {
    setSelectedPosts(new Set());
    
    // Track bulk operation
    if (isAdmin) {
      trackBulkOperation('clear_selection', 0);
    }
  };

  const bulkDeletePosts = async (): Promise<boolean> => {
    if (selectedPosts.size === 0) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      // Delete all selected posts
      const deletePromises = Array.from(selectedPosts).map(postId => 
        firestoreDeletePost(postId)
      );
      
      await Promise.all(deletePromises);
      
      // Track bulk delete action
      if (isAdmin) {
        trackAdminAction('bulk_delete', undefined, selectedPosts.size);
        trackBulkOperation('bulk_delete', selectedPosts.size);
      }
      
      // Clear selection and reload posts
      setSelectedPosts(new Set());
      await loadPosts();
      return true;
    } catch (error: any) {
      console.error('Error bulk deleting posts:', error);
      setError(error.message || 'Failed to delete posts');
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
      // Trigger storage event for other tabs
      window.dispatchEvent(new Event('storage'));
      
      // Track admin login
      trackAdminAction('login');
      
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('foundit_admin_email');
    localStorage.removeItem('foundit_admin_phone');
    setIsAdmin(false);
    // Trigger storage event for other tabs
    window.dispatchEvent(new Event('storage'));
    
    // Track admin logout
    trackAdminAction('logout');
  };

  return {
    posts,
    loading,
    error,
    isAdmin,
    selectedPosts,
    addPost,
    deletePost,
    editPost,
    loadPosts,
    loadPostsByCategory,
    getFilteredPosts,
    handleAdminLogin,
    handleAdminLogout,
    togglePostSelection,
    selectAllPosts,
    clearSelection,
    bulkDeletePosts
  };
};