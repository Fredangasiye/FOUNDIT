import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { User, Post, CreatePostData } from '../types';

// User operations
export const createUser = async (user: User): Promise<void> => {
  // Destructure user to exclude password field for security
  const { password, ...userWithoutPassword } = user;
  
  // Ensure all optional fields have default values to prevent undefined errors
  const userDataForFirestore = {
    ...userWithoutPassword,
    phone: userWithoutPassword.phone || '',
    unitNumber: userWithoutPassword.unitNumber || '',
    profilePhoto: userWithoutPassword.profilePhoto || '',
    authProvider: userWithoutPassword.authProvider || 'local',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
  
  await setDoc(doc(db, 'users', user.id), userDataForFirestore);
};

export const getUser = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return userDoc.data() as User;
  }
  return null;
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<void> => {
  // Destructure userData to exclude password field for security
  const { password, ...userDataWithoutPassword } = userData;
  
  await updateDoc(doc(db, 'users', userId), {
    ...userDataWithoutPassword,
    updatedAt: serverTimestamp()
  });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const q = query(collection(db, 'users'), where('email', '==', email));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data() as User;
  }
  return null;
};

// Post operations
export const createPost = async (post: CreatePostData): Promise<string> => {
  // Filter out undefined values to prevent Firestore errors
  const cleanPost = Object.fromEntries(
    Object.entries(post).filter(([_, value]) => value !== undefined)
  );
  
  const docRef = await addDoc(collection(db, 'posts'), {
    ...cleanPost,
    datePosted: serverTimestamp(),
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const getPosts = async (): Promise<Post[]> => {
  const q = query(collection(db, 'posts'), orderBy('datePosted', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    datePosted: doc.data().datePosted?.toDate() || new Date()
  })) as Post[];
};

export const getPostsByCategory = async (category: string): Promise<Post[]> => {
  const q = query(
    collection(db, 'posts'), 
    where('category', '==', category),
    orderBy('datePosted', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    datePosted: doc.data().datePosted?.toDate() || new Date()
  })) as Post[];
};

export const getPostsByUser = async (userPhone: string): Promise<Post[]> => {
  const q = query(
    collection(db, 'posts'), 
    where('userPhone', '==', userPhone),
    orderBy('datePosted', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    ...doc.data(),
    id: doc.id,
    datePosted: doc.data().datePosted?.toDate() || new Date()
  })) as Post[];
};



export const updatePost = async (postId: string, postData: Partial<Post>): Promise<void> => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    ...postData,
    updatedAt: serverTimestamp()
  });
};

// Image upload functions
export const uploadImage = async (file: File, postId: string): Promise<string> => {
  const imageRef = ref(storage, `post-images/${postId}/${file.name}`);
  const snapshot = await uploadBytes(imageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error for image deletion failures
  }
};

export const deletePost = async (postId: string): Promise<void> => {
  const postRef = doc(db, 'posts', postId);
  await deleteDoc(postRef);
}; 