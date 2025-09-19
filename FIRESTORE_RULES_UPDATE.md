# Firestore Rules Update - Fix "Missing or insufficient permissions" Error

## 🚨 **Current Issue:**
- **Error**: "Missing or insufficient permissions"
- **Cause**: Firestore rules require authentication, but app uses public posting
- **Solution**: Update rules to allow public access

## 🔧 **How to Fix:**

### **Option 1: Firebase Console (Recommended)**
1. Go to [Firebase Console](https://console.firebase.google.com/project/foundit-f59c2)
2. Click **"Firestore Database"** in the left sidebar
3. Click **"Rules"** tab
4. Replace the existing rules with:

```javascript
rules_version = '2';

// Firestore Security Rules for FOUNDIT App
service cloud.firestore {
  match /databases/{database}/documents {
    // Posts collection - anyone can read and write (public posting)
    match /posts/{postId} {
      allow read: if true; // Anyone can read posts
      allow write: if true; // Anyone can create/update posts (public posting)
    }
    
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Default rule - deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Click **"Publish"** button

### **Option 2: Firebase CLI (If you have it installed)**
```bash
firebase deploy --only firestore:rules
```

## ✅ **What This Fixes:**
- **Posts Collection**: Anyone can read and write (public posting)
- **Users Collection**: Still protected (requires authentication)
- **Other Collections**: Denied by default

## 🎯 **After Update:**
- ✅ **Posts will load** without permission errors
- ✅ **Users can create posts** without authentication
- ✅ **App will work** as intended (public posting)

## 🔒 **Security Note:**
This allows public posting, which is what you wanted. If you later want to add authentication, you can change the posts rules back to `allow write: if request.auth != null;`

## 📱 **Test After Update:**
1. Visit: https://foundit-livid.vercel.app
2. Check if posts load (no more permission errors)
3. Try creating a new post
4. Should work perfectly! ✅