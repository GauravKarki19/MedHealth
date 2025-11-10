# Firebase Setup Guide (Optional)

## Current Status
✅ **Firebase is now optional** - The app will work without Firebase, but Google Sign-In will be disabled.

## Why Firebase?
Firebase is used for **Google Sign-In** authentication. If you don't need Google Sign-In, you can skip this setup.

## How to Set Up Firebase (If You Want Google Sign-In)

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name (e.g., "TelMedSphere")
   - Enable/disable Google Analytics (optional)
   - Click "Create project"

### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get started**
3. Go to **Sign-in method** tab
4. Enable **Google** as a sign-in provider:
   - Click on "Google"
   - Toggle "Enable"
   - Enter project support email
   - Click "Save"

### Step 3: Register Your App

1. In Firebase Console, click the **Web** icon (`</>`) or go to **Project Settings**
2. Register your app:
   - App nickname: "TelMedSphere Web"
   - Don't check "Also set up Firebase Hosting" (unless you want it)
   - Click "Register app"

### Step 4: Get Your Firebase Config

After registering, you'll see your Firebase configuration. It looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-XXXXXXXXXX"
};
```

### Step 5: Add to Frontend .env File

Open `frontend/.env` and add these variables:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace the values with your actual Firebase config values.

### Step 6: Restart Frontend Server

1. Stop the frontend server (`Ctrl+C`)
2. Start it again:
   ```powershell
   npm run dev
   ```

### Step 7: Verify

1. Open the app in your browser
2. Check the browser console - you should see: "Firebase initialized successfully"
3. Try the Google Sign-In button - it should work now

## Troubleshooting

### Error: "Firebase: Error (auth/invalid-api-key)"

**Solution:**
- Check that all Firebase environment variables are set in `frontend/.env`
- Make sure there are no extra spaces or quotes
- Restart the frontend server after updating .env

### Error: "Firebase configuration not found"

**Solution:**
- Verify that `frontend/.env` file exists
- Check that all `VITE_FIREBASE_*` variables are set
- Make sure you're using `VITE_` prefix (required for Vite)

### Google Sign-In Button Doesn't Work

**Solution:**
- Check browser console for errors
- Verify Firebase Authentication is enabled in Firebase Console
- Make sure Google Sign-In provider is enabled
- Check that your domain is authorized (for production)

## Without Firebase

If you don't set up Firebase:
- ✅ App will still work
- ✅ Regular email/password login will work
- ❌ Google Sign-In button will show an error message
- ❌ Users can only use email/password authentication

## Quick Test

To test if Firebase is working:
1. Open browser console
2. Look for: "Firebase initialized successfully"
3. If you see warnings about Firebase not being configured, add the environment variables

## Notes

- Firebase is **free** for development and small projects
- You can use Firebase without a credit card for the free tier
- The free tier includes:
  - Authentication (50K MAU - Monthly Active Users)
  - Firestore (1 GB storage, 50K reads/day)
  - Hosting (10 GB storage, 360 MB/day transfer)

