# 🔧 Admin Setup Guide

## 🎯 **Quick Setup (5 minutes)**

### **1. Change Admin Credentials**
Edit the file: `src/hooks/usePostsPublic.ts`

Find these lines (around line 6-7):
```typescript
const ADMIN_EMAIL = 'admin@foundit.com'; // Change this to your email
const ADMIN_PHONE = '+1234567890'; // Change this to your phone
```

**Replace with your actual credentials:**
```typescript
const ADMIN_EMAIL = 'your-email@example.com'; // Your real email
const ADMIN_PHONE = '+1234567890'; // Your real phone number
```

### **2. Save and Deploy**
```bash
git add .
git commit -m "Update admin credentials"
git push origin main
npx vercel --prod
```

### **3. Test Admin Access**
1. Visit your app
2. Click the login icon (top-right)
3. Enter your email and phone
4. You should see "Admin" status and delete buttons

## 🔐 **Admin Features**

### **What You Can Do as Admin:**
- ✅ **Delete any post** - Click red X button on posts
- ✅ **See admin status** - Green "Admin" indicator
- ✅ **Access all posts** - No restrictions
- ✅ **Manage content** - Full control over community posts

### **Admin Login Process:**
1. Click login icon (🔑) in top-right corner
2. Enter your email address
3. Enter your phone number
4. Click "Login"
5. You'll see "Admin" status and delete buttons

## 🚨 **Important Security Notes**

### **Keep Your Credentials Safe:**
- Don't share your admin email/phone publicly
- Use a secure email address
- Consider using a dedicated phone number for admin

### **Admin Session:**
- You stay logged in until you click logout
- Admin status persists across browser sessions
- Logout button appears when you're logged in

## 🎉 **You're All Set!**

Once you update the credentials and deploy:
- Your community can start using the app immediately
- You have full admin control over all posts
- The app is live and ready for your community

**Need help? Check the FINAL_SUMMARY.md for complete documentation!**