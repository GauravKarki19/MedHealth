import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Construct Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Check if Firebase is configured
const isFirebaseConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId;

let app = null;
let auth = null;
let provider = null;

// Initialize Firebase only if configuration is present
if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    provider = new GoogleAuthProvider();
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
    console.warn("Google Sign-In will be disabled. Please configure Firebase in your .env file.");
  }
} else {
  console.warn("Firebase configuration not found. Google Sign-In will be disabled.");
  console.warn("To enable Firebase, add the following to your frontend/.env file:");
  console.warn("  VITE_FIREBASE_API_KEY=your_api_key");
  console.warn("  VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain");
  console.warn("  VITE_FIREBASE_PROJECT_ID=your_project_id");
  console.warn("  VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket");
  console.warn("  VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id");
  console.warn("  VITE_FIREBASE_APP_ID=your_app_id");
  console.warn("  VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id");
}

// Export with fallback functions
export { 
  auth, 
  provider, 
  signInWithPopup,
  isFirebaseConfigured 
};
