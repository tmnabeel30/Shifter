import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC2XKFnozpBi2WNLjqBpNVD1go9tjG1ads",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "shifter-ca239.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "shifter-ca239",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "shifter-ca239.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1841660965",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1841660965:web:0d8a3701e1c14420786bcc",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9YZSH1DBHX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
