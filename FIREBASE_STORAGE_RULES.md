# Firebase Storage Rules for Public Access

## Current Issue
The image upload is failing because Firebase Storage rules are likely too restrictive for public access.

## Required Storage Rules

Go to Firebase Console → Storage → Rules and update with these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to all files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Allow public write access to posts folder
    match /posts/{fileName} {
      allow write: if true;
      allow read: if true;
    }
    
    // Allow public write access to profiles folder
    match /profiles/{fileName} {
      allow write: if true;
      allow read: if true;
    }
  }
}
```

## Firestore Rules

Also update Firestore rules for public access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow public read access to posts
    match /posts/{postId} {
      allow read: if true;
      allow write: if true;
      allow delete: if true;
    }
    
    // Allow public read access to users
    match /users/{userId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

## Steps to Fix:

1. Go to [Firebase Console](https://console.firebase.google.com/project/foundit-2)
2. Click on "Storage" in the left sidebar
3. Click on "Rules" tab
4. Replace the existing rules with the rules above
5. Click "Publish"
6. Repeat for Firestore rules

## Test After Update:

1. Visit https://foundit-livid.vercel.app
2. Try uploading an image
3. Check if the image appears instead of placeholder

## Alternative: Check Firebase Project Status

If the rules don't work, the Firebase project might need to be properly initialized:

1. Make sure the project is active
2. Check if billing is enabled (required for Storage)
3. Verify the project ID matches your environment variables