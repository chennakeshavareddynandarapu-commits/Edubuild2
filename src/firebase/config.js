import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAbckv6T0Ic2HOUvBHiykvxxYk6bb6OzqI",
    authDomain: "edubuild-9cb5d.firebaseapp.com",
    projectId: "edubuild-9cb5d",
    storageBucket: "edubuild-9cb5d.firebasestorage.app",
    messagingSenderId: "403440536922",
    appId: "1:403440536922:web:7552c637b72b0ab84c7763",
    measurementId: "G-EDGS4QKMZN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics safely (only in browser)
export let analytics;
if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
}

export default app;
