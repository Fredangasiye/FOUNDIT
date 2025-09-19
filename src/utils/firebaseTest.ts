// Firebase connection test utility
import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const testFirebaseConnection = async (): Promise<{
  success: boolean;
  error?: string;
  storageUrl?: string;
}> => {
  try {
    console.log('Testing Firebase connection...');
    
    // Test with a simple text file
    const testContent = 'Firebase connection test';
    const testBlob = new Blob([testContent], { type: 'text/plain' });
    
    // Create a test file reference
    const testRef = ref(storage, `test/connection-test-${Date.now()}.txt`);
    
    // Try to upload
    const snapshot = await uploadBytes(testRef, testBlob);
    console.log('Upload successful:', snapshot);
    
    // Try to get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Download URL:', downloadURL);
    
    return {
      success: true,
      storageUrl: downloadURL
    };
  } catch (error: any) {
    console.error('Firebase connection test failed:', error);
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
};

// Test function that can be called from browser console
(window as any).testFirebase = testFirebaseConnection;