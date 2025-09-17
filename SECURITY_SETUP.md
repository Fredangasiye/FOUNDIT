# Firebase Security Rules Setup

This guide explains how to set up the security rules for the FOUNDIT app to ensure proper access control and data protection.

## Files Included

- `firestore.rules` - Firestore database security rules
- `firebase-storage.rules` - Firebase Storage security rules

## Setting Up Security Rules

### 1. Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`foundit-2`)
3. Navigate to "Firestore Database" in the left sidebar
4. Click on the "Rules" tab
5. Replace the existing rules with the content from `firestore.rules`
6. Click "Publish"

### 2. Firebase Storage Security Rules

1. In the Firebase Console, navigate to "Storage" in the left sidebar
2. Click on the "Rules" tab
3. Replace the existing rules with the content from `firebase-storage.rules`
4. Click "Publish"

## Security Rules Explanation

### Firestore Rules

- **Posts Collection**: Anyone can read posts, but only authenticated users can create/update them
- **Users Collection**: Users can only read and modify their own user data
- **Default Rule**: All other access is denied

### Storage Rules

- **Posts Images**: Anyone can read post images, only authenticated users can upload
- **Profile Images**: Anyone can read profile images, users can only upload their own
- **Default Rule**: All other access is denied

## Testing Security Rules

### Test Firestore Rules

1. **Unauthenticated Access**:
   - Should be able to read posts
   - Should NOT be able to create posts
   - Should NOT be able to read/write user data

2. **Authenticated Access**:
   - Should be able to read all posts
   - Should be able to create posts
   - Should only be able to read/write their own user data

### Test Storage Rules

1. **Unauthenticated Access**:
   - Should be able to read post images
   - Should be able to read profile images
   - Should NOT be able to upload images

2. **Authenticated Access**:
   - Should be able to read all images
   - Should be able to upload post images
   - Should only be able to upload their own profile images

## Important Notes

- These rules are designed for a community app where posts should be publicly readable
- User data is protected and only accessible by the user themselves
- Image uploads are restricted to authenticated users only
- Profile images can only be uploaded by the user they belong to

## Troubleshooting

If you encounter issues:

1. **Permission Denied Errors**: Check that the user is properly authenticated
2. **Cannot Read Posts**: Verify Firestore rules allow public read access
3. **Cannot Upload Images**: Ensure the user is authenticated and rules are published
4. **Cannot Access User Data**: Verify the user is trying to access their own data

## Development vs Production

- **Development**: You might want to temporarily allow all access for testing
- **Production**: Use the provided rules for proper security

To temporarily allow all access for development, replace the rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

**Remember to change back to the secure rules before deploying to production!**