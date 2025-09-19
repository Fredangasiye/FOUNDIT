import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';
import imageCompression from 'browser-image-compression';

export interface ImageUploadResult {
  url: string;
  path: string;
  success: boolean;
  error?: string;
}

export interface ImageUploadOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  quality?: number;
  useWebWorker?: boolean;
}

// Default compression options for production
const DEFAULT_OPTIONS: ImageUploadOptions = {
  maxSizeMB: 0.8, // Reduced for better performance
  maxWidthOrHeight: 1600, // Optimized for web display
  quality: 0.8,
  useWebWorker: true,
};

// Fallback image URL for when uploads fail
const FALLBACK_IMAGE_URL = 'https://via.placeholder.com/400x300?text=Image+Upload+Failed';

/**
 * Compress and upload image to Firebase Storage
 * Includes comprehensive error handling and fallbacks
 */
export const uploadImage = async (
  file: File, 
  userId: string, 
  options: ImageUploadOptions = {}
): Promise<ImageUploadResult> => {
  try {
    // Validate file
    if (!file || !file.type.startsWith('image/')) {
      throw new Error('Invalid file type. Please select an image.');
    }

    // Check file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File too large. Please select an image smaller than 10MB.');
    }

    const uploadOptions = { ...DEFAULT_OPTIONS, ...options };
    
    // Compress the image
    const compressedFile = await imageCompression(file, {
      maxSizeMB: uploadOptions.maxSizeMB!,
      maxWidthOrHeight: uploadOptions.maxWidthOrHeight!,
      useWebWorker: uploadOptions.useWebWorker!,
    });

    // Create a unique filename with timestamp and random string
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const fileExtension = compressedFile.name.split('.').pop() || 'jpg';
    const fileName = `post_${userId}_${timestamp}_${randomString}.${fileExtension}`;
    
    // Create storage reference
    const storageRef = ref(storage, `posts/${fileName}`);

    // Upload the file with timeout
    const uploadPromise = uploadBytes(storageRef, compressedFile);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Upload timeout')), 30000)
    );
    
    const snapshot = await Promise.race([uploadPromise, timeoutPromise]) as any;
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      path: snapshot.ref.fullPath,
      success: true,
    };
  } catch (error: any) {
    console.error('Image upload error:', error);
    
    // Return fallback result instead of throwing
    return {
      url: FALLBACK_IMAGE_URL,
      path: '',
      success: false,
      error: error.message || 'Failed to upload image',
    };
  }
};

/**
 * Delete image from Firebase Storage
 */
export const deleteImage = async (imagePath: string): Promise<boolean> => {
  try {
    if (!imagePath || imagePath === FALLBACK_IMAGE_URL) {
      return true; // Nothing to delete
    }
    
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false; // Don't throw, just return false
  }
};

/**
 * Generate a unique filename for posts
 */
export const generateImageFileName = (userId: string, originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const fileExtension = originalName.split('.').pop() || 'jpg';
  return `post_${userId}_${timestamp}_${randomString}.${fileExtension}`;
};

/**
 * Validate image file before upload
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select a valid image file.' };
  }

  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    return { valid: false, error: 'Image must be smaller than 10MB.' };
  }

  // Check file size (minimum 1KB)
  if (file.size < 1024) {
    return { valid: false, error: 'Image file appears to be corrupted.' };
  }

  return { valid: true };
};

/**
 * Get optimized image URL with size parameters
 */
export const getOptimizedImageUrl = (url: string, width?: number, height?: number): string => {
  if (!url || url === FALLBACK_IMAGE_URL) {
    return url;
  }

  // For Firebase Storage, we can add resize parameters
  if (url.includes('firebasestorage.googleapis.com')) {
    const baseUrl = url.split('?')[0];
    const params = new URLSearchParams();
    
    if (width) params.append('w', width.toString());
    if (height) params.append('h', height.toString());
    
    return `${baseUrl}?${params.toString()}`;
  }

  return url;
};