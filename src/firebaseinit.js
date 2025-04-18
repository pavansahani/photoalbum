import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAe2ts998GRdrD653RG6h1cYN4i8U7Qbuc",
  authDomain: "blogging-app-7f580.firebaseapp.com",
  projectId: "blogging-app-7f580",
  storageBucket: "blogging-app-7f580.firebasestorage.app",
  messagingSenderId: "515064450667",
  appId: "1:515064450667:web:f1d04a602e16928b0deb2e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
