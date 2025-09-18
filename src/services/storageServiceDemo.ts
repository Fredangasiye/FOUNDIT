export interface UploadResult {
  url: string;
  path: string;
}

export const uploadImage = async (file: File, userId: string): Promise<UploadResult> => {
  try {
    // Create a mock image URL for demo purposes
    const mockUrl = `https://via.placeholder.com/400x300?text=Demo+Image+${Date.now()}`;
    
    return {
      url: mockUrl,
      path: `posts/demo_${userId}_${Date.now()}.jpg`
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};

export const deleteImage = async (imagePath: string): Promise<void> => {
  try {
    // Mock delete - just log it
    console.log('Mock delete image:', imagePath);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image.');
  }
};

export const uploadProfileImage = async (file: File, userId: string): Promise<UploadResult> => {
  try {
    // Create a mock profile image URL for demo purposes
    const mockUrl = `https://via.placeholder.com/150x150?text=Profile+${Date.now()}`;
    
    return {
      url: mockUrl,
      path: `profiles/demo_${userId}_${Date.now()}.jpg`
    };
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw new Error('Failed to upload profile image. Please try again.');
  }
};