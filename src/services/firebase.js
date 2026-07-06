import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDXC4kP4PO0v0UQ3uFktdWO4qFfjWTIerM",
  authDomain: "aquaguard-ai-e0d18.firebaseapp.com",
  projectId: "aquaguard-ai-e0d18",
  storageBucket: "aquaguard-ai-e0d18.firebasestorage.app",
  messagingSenderId: "129670157099",
  appId: "1:129670157099:web:147ed741b9eab77312eb6e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
