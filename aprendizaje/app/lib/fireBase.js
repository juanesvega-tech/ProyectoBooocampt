// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBY8xDCBToEFFtmdFZp2oxaEuPB0alL-uQ",
  authDomain: "react-63d89.firebaseapp.com",
  projectId: "react-63d89",
  storageBucket: "react-63d89.firebasestorage.app",
  messagingSenderId: "859722752626",
  appId: "1:859722752626:web:ed4c610733c88e42bf58eb",
  measurementId: "G-X045H6BM9G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);