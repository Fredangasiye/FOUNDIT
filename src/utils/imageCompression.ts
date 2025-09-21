import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
}

const defaultOptions: CompressionOptions = {
  maxSizeMB: 0.5, // Compress to max 0.5MB
  maxWidthOrHeight: 1200, // Max width or height
  useWebWorker: true,
};

export const compressImage = async (file: File, options: Partial<CompressionOptions> = {}): Promise<File> => {
  try {
    console.log('🖼️ Compressing image...', {
      originalSize: (file.size / 1024 / 1024).toFixed(2) + 'MB',
      originalType: file.type
    });

    const compressionOptions = { ...defaultOptions, ...options };
    
    const compressedFile = await imageCompression(file, compressionOptions);
    
    console.log('✅ Image compressed successfully!', {
      originalSize: (file.size / 1024 / 1024).toFixed(2) + 'MB',
      compressedSize: (compressedFile.size / 1024 / 1024).toFixed(2) + 'MB',
      compressionRatio: ((1 - compressedFile.size / file.size) * 100).toFixed(1) + '%'
    });

    return compressedFile;
  } catch (error) {
    console.error('❌ Image compression failed:', error);
    // Return original file if compression fails
    return file;
  }
};

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file' };
  }

  // Check file size (max 10MB before compression)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { valid: false, error: 'Image file is too large. Please select an image smaller than 10MB' };
  }

  return { valid: true };
};