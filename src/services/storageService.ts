import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';
import imageCompression from 'browser-image-compression';

export interface UploadResult {
  url: string;
  path: string;
}

export const uploadImage = async (file: File, userId: string): Promise<UploadResult> => {
  try {
    // Compress the image before uploading
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    });

    // Create a unique filename with timestamp
    const timestamp = Date.now();
    const fileName = `${userId}_${timestamp}_${compressedFile.name}`;
    const storageRef = ref(storage, `posts/${fileName}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, compressedFile);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image. Please try again.');
  }
};

export const deleteImage = async (imagePath: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error('Failed to delete image.');
  }
};

export const uploadProfileImage = async (file: File, userId: string): Promise<UploadResult> => {
  try {
    // Compress the image before uploading
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.5,
      maxWidthOrHeight: 400,
      useWebWorker: true,
    });

    // Create a unique filename for profile image
    const timestamp = Date.now();
    const fileName = `profile_${userId}_${timestamp}.jpg`;
    const storageRef = ref(storage, `profiles/${fileName}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, compressedFile);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      path: snapshot.ref.fullPath
    };
  } catch (error) {
    console.error('Error uploading profile image:', error);
    throw new Error('Failed to upload profile image. Please try again.');
  }
};