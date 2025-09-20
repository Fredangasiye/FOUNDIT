// Analytics utility functions for tracking custom events
import { track } from '@vercel/analytics/react';

// Track post creation events
export const trackPostCreated = (category: string, hasImage: boolean) => {
  try {
    track('post_created', {
      category,
      has_image: hasImage,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

// Track contact button clicks
export const trackContactClick = (method: 'whatsapp' | 'phone' | 'email', postId: string, category: string) => {
  try {
    track('contact_click', {
      method,
      post_id: postId,
      category,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

// Track admin actions
export const trackAdminAction = (action: 'login' | 'logout' | 'edit_post' | 'delete_post' | 'bulk_delete', postId?: string, postCount?: number) => {
  try {
    track('admin_action', {
      action,
      post_id: postId || null,
      post_count: postCount || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

// Track category navigation
export const trackCategorySwitch = (fromCategory: string, toCategory: string) => {
  try {
    track('category_switch', {
      from_category: fromCategory,
      to_category: toCategory,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

// Track page navigation
export const trackPageView = (page: string, category?: string) => {
  try {
    track('page_view', {
      page,
      category: category || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

// Track search queries
export const trackSearch = (query: string, resultsCount: number) => {
  try {
    track('search_query', {
      query,
      results_count: resultsCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

// Track image uploads
export const trackImageUpload = (success: boolean, fileSize?: number) => {
  try {
    track('image_upload', {
      success,
      file_size: fileSize || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};

// Track bulk operations
export const trackBulkOperation = (operation: 'select_all' | 'clear_selection' | 'bulk_delete', count: number) => {
  try {
    track('bulk_operation', {
      operation,
      count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Analytics tracking failed:', error);
  }
};