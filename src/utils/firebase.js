// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-TMNP159czTSGKgPVMZUVbBYU1tS-Q6w",
  authDomain: "marshee-partner.firebaseapp.com",
  projectId: "marshee-partner",
  storageBucket: "marshee-partner.appspot.com",
  messagingSenderId: "866824622207",
  appId: "1:866824622207:web:88cc9c152bcb2d0b6def4a",
  measurementId: "G-3HN7687SXC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
