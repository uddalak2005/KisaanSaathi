// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADpITFP2c8mJ-G7h9Ab_ign9o7R1olcvQ",
  authDomain: "kisaansathi-2f73b.firebaseapp.com",
  projectId: "kisaansathi-2f73b",
  storageBucket: "kisaansathi-2f73b.firebasestorage.app",
  messagingSenderId: "128312623355",
  appId: "1:128312623355:web:9681a31b78e37822fef05e",
  measurementId: "G-LQ3F29MR7F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db};