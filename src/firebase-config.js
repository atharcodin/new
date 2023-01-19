// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCmaY3eyH0LKapNnvWOTlaWDkIm6bPgeSY",
  authDomain: "tiktok-profiles.firebaseapp.com",
  projectId: "tiktok-profiles",
  storageBucket: "tiktok-profiles.appspot.com",
  messagingSenderId: "659604469739",
  appId: "1:659604469739:web:22c2bfa1c3d300368d4bae"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const storage = getStorage(app);
