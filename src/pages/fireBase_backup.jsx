// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDq8Sa4KSwisWdj6OgBvIJQE1ATOuQZypk",
  authDomain: "libraray-catalog.firebaseapp.com",
  projectId: "libraray-catalog",
  storageBucket: "libraray-catalog.firebasestorage.app",
  messagingSenderId: "753760740039",
  appId: "1:753760740039:web:b9381739141b2812a6d4e2",
  measurementId: "G-2G3TJPNM23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Create a Google provider instance
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup };
