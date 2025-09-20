// Analytics utility functions for tracking custom events
import { track } from '@vercel/analytics';

// Track post creation events
export const trackPostCreated = (category: string, hasImage: boolean) => {
  track('post_created', {
    category,
    has_image: hasImage,
    timestamp: new Date().toISOString()
  });
};

// Track contact button clicks
export const trackContactClick = (method: 'whatsapp' | 'phone' | 'email', postId: string, category: string) => {
  track('contact_click', {
    method,
    post_id: postId,
    category,
    timestamp: new Date().toISOString()
  });
};

// Track admin actions
export const trackAdminAction = (action: 'login' | 'logout' | 'edit_post' | 'delete_post' | 'bulk_delete', postId?: string, postCount?: number) => {
  track('admin_action', {
    action,
    post_id: postId || null,
    post_count: postCount || null,
    timestamp: new Date().toISOString()
  });
};

// Track category navigation
export const trackCategorySwitch = (fromCategory: string, toCategory: string) => {
  track('category_switch', {
    from_category: fromCategory,
    to_category: toCategory,
    timestamp: new Date().toISOString()
  });
};

// Track page navigation
export const trackPageView = (page: string, category?: string) => {
  track('page_view', {
    page,
    category: category || null,
    timestamp: new Date().toISOString()
  });
};

// Track search queries
export const trackSearch = (query: string, resultsCount: number) => {
  track('search_query', {
    query,
    results_count: resultsCount,
    timestamp: new Date().toISOString()
  });
};

// Track image uploads
export const trackImageUpload = (success: boolean, fileSize?: number) => {
  track('image_upload', {
    success,
    file_size: fileSize || null,
    timestamp: new Date().toISOString()
  });
};

// Track bulk operations
export const trackBulkOperation = (operation: 'select_all' | 'clear_selection' | 'bulk_delete', count: number) => {
  track('bulk_operation', {
    operation,
    count,
    timestamp: new Date().toISOString()
  });
};