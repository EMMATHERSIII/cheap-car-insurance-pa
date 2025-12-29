import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDI5wxGVHZ11maJsk72dizaKKJx1KOYmuw",
  authDomain: "cheap-car-insurance-49eab.firebaseapp.com",
  projectId: "cheap-car-insurance-49eab",
  storageBucket: "cheap-car-insurance-49eab.firebasestorage.app",
  messagingSenderId: "240634438804",
  appId: "1:240634438804:web:cd544bf4d0bbdcaf4dc081",
  measurementId: "G-EYYK7HSM3T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
