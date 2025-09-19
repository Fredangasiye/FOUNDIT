# Vercel Environment Variables Setup

## 🔧 Add These Environment Variables to Vercel

Go to your Vercel dashboard and add these environment variables:

### Required Environment Variables:

```
VITE_FIREBASE_API_KEY=AIzaSyADRqZStC9kYRPsF19D8rpaKNbkz_htshk
VITE_FIREBASE_AUTH_DOMAIN=foundit-2.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=foundit-2
VITE_FIREBASE_STORAGE_BUCKET=foundit-2.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=990100407890
VITE_FIREBASE_APP_ID=1:990100407890:web:77dd5d9b51596e5039418b
VITE_FIREBASE_MEASUREMENT_ID=G-BQ6BH809QH
```

## 📋 Step-by-Step Instructions:

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select Your Project**: Click on "foundit" project
3. **Go to Settings**: Click on "Settings" tab
4. **Environment Variables**: Click on "Environment Variables" in the left sidebar
5. **Add Each Variable**: Click "Add New" and add each variable above
6. **Set Environment**: Make sure to set them for "Production", "Preview", and "Development"
7. **Redeploy**: Go to "Deployments" tab and click "Redeploy" on the latest deployment

## 🚀 After Adding Variables:

1. **Redeploy**: The app will automatically redeploy with the new environment variables
2. **Test**: Visit your production URL to test image uploads
3. **Monitor**: Check Firebase Console for data and analytics

## 🔍 Verification:

- **Firebase Console**: https://console.firebase.google.com/project/foundit-2
- **Storage**: Check if images are being uploaded
- **Analytics**: Check if user events are being tracked
- **Firestore**: Check if posts are being created

## 🎯 Expected Results:

- ✅ **Images will upload successfully** to Firebase Storage
- ✅ **Posts will be saved** to Firestore database
- ✅ **Analytics will track** user interactions
- ✅ **Real-time updates** will work properly
- ✅ **Production-ready** performance monitoring

## 🆘 Troubleshooting:

If images still don't work after deployment:
1. Check Vercel logs for errors
2. Verify environment variables are set correctly
3. Check Firebase Storage rules
4. Ensure Firebase project is properly configured