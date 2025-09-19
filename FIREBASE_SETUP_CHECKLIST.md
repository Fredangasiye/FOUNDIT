# Firebase Setup Checklist for FOUNDIT App

## ✅ **Current Status Check:**

### **1. Firebase Project: `foundit-2`**
- **Project ID**: `foundit-2` ✅
- **Storage Bucket**: `foundit-2.firebasestorage.app` ✅
- **Status**: Need to verify if Storage is enabled

### **2. Required Services:**

#### **Firestore Database:**
- [ ] Go to Firebase Console → Firestore Database
- [ ] Click "Create database" if not exists
- [ ] Choose "Start in test mode"
- [ ] Select location (e.g., `us-central1`)

#### **Storage:**
- [ ] Go to Firebase Console → Storage
- [ ] Click "Get started" if not enabled
- [ ] Choose "Start in test mode"
- [ ] Select same location as Firestore

#### **Authentication (Optional):**
- [ ] Go to Firebase Console → Authentication
- [ ] Enable "Email/Password" if you want user accounts
- [ ] Enable "Google" if you want Google sign-in

### **3. Security Rules:**

#### **Firestore Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow write: if true;
      allow delete: if true;
    }
  }
}
```

#### **Storage Rules:**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
    }
    match /posts/{fileName} {
      allow write: if true;
      allow read: if true;
    }
  }
}
```

### **4. Environment Variables (Already Set):**
```env
VITE_FIREBASE_API_KEY=AIzaSyADRqZStC9kYRPsF19D8rpaKNbkz_htshk
VITE_FIREBASE_AUTH_DOMAIN=foundit-2.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=foundit-2
VITE_FIREBASE_STORAGE_BUCKET=foundit-2.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=990100407890
VITE_FIREBASE_APP_ID=1:990100407890:web:77dd5d9b51596e5039418b
VITE_FIREBASE_MEASUREMENT_ID=G-BQ6BH809QH
```

## 🚀 **Quick Setup Steps:**

1. **Go to**: https://console.firebase.google.com/project/foundit-2
2. **Enable Storage**: Storage → Get started → Test mode
3. **Enable Firestore**: Firestore Database → Create database → Test mode
4. **Update Rules**: Copy the rules above for both Storage and Firestore
5. **Test**: Visit https://foundit-livid.vercel.app and try uploading an image

## 🔍 **Troubleshooting:**

### **If Storage is already enabled:**
- Check the Rules tab and update with the public access rules above
- Make sure the bucket name matches: `foundit-2.firebasestorage.app`

### **If you get permission errors:**
- The rules are too restrictive
- Update both Storage and Firestore rules with the public access rules above

### **If images still don't upload:**
- Check browser console for specific error messages
- Verify the Firebase project is active and billing is enabled (required for Storage)

## 📞 **Need Help?**
- Firebase Console: https://console.firebase.google.com/project/foundit-2
- Firebase Docs: https://firebase.google.com/docs/storage/web/start