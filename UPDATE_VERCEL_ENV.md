# Update Vercel Environment Variables

## 🔧 **New Firebase Project Configuration**

You need to update the Vercel environment variables with your new Firebase project credentials.

### **New Firebase Project: `foundit-f59c2`**

**Environment Variables to Update in Vercel:**

```
VITE_FIREBASE_API_KEY=AIzaSyC7L2KI_kyfZtbD_vV26JvSGnt6zndJHig
VITE_FIREBASE_AUTH_DOMAIN=foundit-f59c2.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=foundit-f59c2
VITE_FIREBASE_STORAGE_BUCKET=foundit-f59c2.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=611614359531
VITE_FIREBASE_APP_ID=1:611614359531:web:c8beed17f76175a71123ae
VITE_FIREBASE_MEASUREMENT_ID=G-6R976H464K
```

## 📋 **Steps to Update:**

### **1. Go to Vercel Dashboard:**
- Visit: https://vercel.com/dashboard
- Click on your "foundit" project

### **2. Update Environment Variables:**
- Go to **Settings** → **Environment Variables**
- For each variable above:
  - Click the **pencil icon** to edit
  - Update the value with the new Firebase credentials
  - Make sure it's set for **Production**, **Preview**, and **Development**

### **3. Redeploy:**
- Go to **Deployments** tab
- Click **"Redeploy"** on the latest deployment
- Or push a new commit to trigger automatic deployment

## 🎯 **Expected Results After Update:**

- ✅ **Images will upload** to `foundit-f59c2.firebasestorage.app`
- ✅ **Posts will save** to Firestore database
- ✅ **All features will work** (WhatsApp auto-fill, category highlighting, etc.)
- ✅ **No more placeholder images**

## 🔍 **Test Your App:**

1. **Local**: http://localhost:5173 (should work now)
2. **Production**: https://foundit-livid.vercel.app (after updating Vercel env vars)

## 🆘 **If Still Not Working:**

1. **Check Firebase Console**: https://console.firebase.google.com/project/foundit-f59c2
2. **Enable Storage**: Storage → Get started → Test mode
3. **Update Storage Rules**: Use the rules from `FIREBASE_STORAGE_RULES.md`
4. **Check browser console** for specific error messages

## 📊 **Current Status:**

- ✅ **Local development**: Working with new Firebase project
- ⏳ **Production deployment**: Needs Vercel environment variables updated
- ⏳ **Image uploads**: Will work after Vercel env vars are updated