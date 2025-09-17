# FOUNDIT Setup Guide

## Firebase Configuration

To enable user authentication and data persistence, you need to set up Firebase:

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter your project name (e.g., "foundit-app")
4. Follow the setup wizard

### 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Google" provider
5. Add your authorized domain (localhost for development)

### 3. Enable Firestore Database

1. In your Firebase project, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development
4. Select a location close to your users

### 4. Get Firebase Configuration

1. In your Firebase project, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" and select "Web"
4. Register your app and copy the configuration

### 5. Create Environment File

Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 6. Install Dependencies

```bash
npm install
```

### 7. Start Development Server

```bash
npm run dev
```

## Features Implemented

### ✅ User Authentication
- **Email/Password Registration & Login**: Users can create accounts with email and password
- **Google OAuth**: Users can sign in with their Google account
- **Session Persistence**: Users stay logged in across browser sessions
- **Automatic Login**: Users are automatically logged in when they return

### ✅ Data Persistence
- **Firestore Database**: All posts and user data are stored in Firebase Firestore
- **Real-time Updates**: Data persists across sessions and devices
- **User Profiles**: User information is stored and can be updated

### ✅ Post Management
- **Create Posts**: Users can create posts in different categories (Lost, Found, For Sale/Services)
- **View Posts**: Posts are displayed with user information and timestamps
- **Category Filtering**: Posts can be filtered by category
- **Persistent Storage**: Posts remain after users log off

## Security Rules

Make sure to set up proper Firestore security rules in your Firebase console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all posts
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Users can only read/write their own user data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Troubleshooting

### Common Issues

1. **Firebase not initialized**: Make sure your `.env` file has the correct Firebase configuration
2. **Authentication not working**: Check that Google OAuth is enabled in Firebase console
3. **Posts not loading**: Verify Firestore rules allow read access
4. **CORS errors**: Add your domain to authorized domains in Firebase Authentication

### Development Tips

- Use Firebase Emulator Suite for local development
- Check browser console for detailed error messages
- Use Firebase console to monitor authentication and database activity 