import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

// Your Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyC1s4PtajgCM5iIKvTDLrpKI2MVY6NOuzU",
    authDomain: "fanshawe-marketplace.firebaseapp.com",
    projectId: "fanshawe-marketplace",
    storageBucket: "fanshawe-marketplace.firebasestorage.app",
    messagingSenderId: "301352702825",
    appId: "1:301352702825:web:010e62931418ee1d58a3f8",
    measurementId: "G-7GBZM9E330"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
