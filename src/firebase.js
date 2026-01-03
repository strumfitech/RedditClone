// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUF0Ez7JVTofGCcKHnFE3vqE7LpZI0KTQ",
  authDomain: "redditclone-5c7d4.firebaseapp.com",
  projectId: "redditclone-5c7d4",
  storageBucket: "redditclone-5c7d4.firebasestorage.app",
  messagingSenderId: "1016965619742",
  appId: "1:1016965619742:web:57130dfad3ac243abb8e0f",
  measurementId: "G-RZP6MB2H9L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);

export default app;
