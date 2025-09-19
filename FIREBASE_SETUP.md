# Firebase Production Setup Guide

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `foundit-app` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Required Services

### Authentication
1. Go to Authentication > Sign-in method
2. Enable "Email/Password" provider
3. Enable "Google" provider (optional)

### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (we'll secure it later)
4. Select a location close to your users

### Storage
1. Go to Storage
2. Click "Get started"
3. Choose "Start in test mode" (we'll secure it later)
4. Select the same location as Firestore

## 3. Get Configuration Keys

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web app" icon
4. Register app with name: `foundit-web`
5. Copy the configuration object

## 4. Update Environment Variables

Create a `.env.local` file with your Firebase config:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 5. Deploy Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow write: if true; // For public posting
      allow delete: if true; // Admin can delete
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{fileName} {
      allow read: if true;
      allow write: if true; // For public posting
      allow delete: if true; // Admin can delete
    }
  }
}
```

## 6. Vercel Deployment

1. Add environment variables in Vercel dashboard
2. Go to Project Settings > Environment Variables
3. Add all Firebase config variables
4. Redeploy your app

## 7. Performance Optimization

### For 1000+ Posts
- Enable Firestore indexing
- Implement pagination (limit 20-50 posts per page)
- Use lazy loading for images
- Implement search and filtering

### Image Optimization
- Images are automatically compressed to 0.8MB max
- Resized to 1600px max width/height
- Fallback images for failed uploads
- CDN delivery through Firebase Storage

## 8. Monitoring

- Enable Firebase Performance Monitoring
- Set up Firebase Analytics
- Monitor storage usage and costs
- Set up alerts for errors

## 9. Security Considerations

- Implement rate limiting
- Add CAPTCHA for spam prevention
- Regular security rule reviews
- Monitor for abuse

## 10. Cost Management

- Set up billing alerts
- Monitor storage and bandwidth usage
- Implement image cleanup for deleted posts
- Consider CloudFlare for additional CDN