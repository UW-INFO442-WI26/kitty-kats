// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJIphQPqSUYAryuHzYa0o5GXktQjXKN4M",
  authDomain: "kitty-kats.firebaseapp.com",
  projectId: "kitty-kats",
  storageBucket: "kitty-kats.firebasestorage.app",
  messagingSenderId: "1044098363086",
  appId: "1:1044098363086:web:024ee38f56e16c4cba2a9f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
