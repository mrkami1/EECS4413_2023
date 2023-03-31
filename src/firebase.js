// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDgngatJSTP1uKDasu5rESDILWPEIFSvQo",
    authDomain: "project-6e0fc.firebaseapp.com",
    projectId: "project-6e0fc",
    storageBucket: "project-6e0fc.appspot.com",
    messagingSenderId: "19035409463",
    appId: "1:19035409463:web:f5469e6ce0a1c7f2ca43b2",
    measurementId: "G-REEWKMP6ML",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);

export const storage = getStorage(app);
