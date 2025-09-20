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
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { User, Post } from '../types';

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
export const createPost = async (post: Post): Promise<string> => {
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

export const deletePost = async (postId: string): Promise<void> => {
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, { deleted: true });
}; 