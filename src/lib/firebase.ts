import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBIWAqxz0wDn67Uu7qz1BNzCd6V923cmIQ",
    authDomain: "oseille-38c57.firebaseapp.com",
    projectId: "oseille-38c57",
    storageBucket: "oseille-38c57.firebasestorage.app",
    messagingSenderId: "1071809618186",
    appId: "1:1071809618186:web:76848e9f63722a21fc9af3",
    measurementId: "G-YD7G9B6BG2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore
export const db = getFirestore(app);

export default app;
