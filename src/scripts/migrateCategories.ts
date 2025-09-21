import { db } from '../services/firebase';
import { collection, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';

// Migration script to update category names
export const migrateCategories = async () => {
  try {
    console.log('Starting category migration...');
    
    // Get all posts with the old category name
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('category', '==', 'For Sale/Services'));
    const querySnapshot = await getDocs(q);
    
    console.log(`Found ${querySnapshot.size} posts to migrate`);
    
    const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
      const postData = docSnapshot.data();
      console.log(`Migrating post: ${postData.title}`);
      
      // Update the category to the new name
      await updateDoc(doc(db, 'posts', docSnapshot.id), {
        category: 'For Sale/Give away'
      });
      
      console.log(`✅ Migrated: ${postData.title}`);
    });
    
    await Promise.all(updatePromises);
    console.log('✅ Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
};

// Run migration if this file is executed directly
if (typeof window !== 'undefined') {
  // Only run in browser environment
  console.log('Category migration script loaded. Call migrateCategories() to run migration.');
}