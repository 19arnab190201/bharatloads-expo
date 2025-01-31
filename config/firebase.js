// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAp6aMdPEcAedQPW2hZ_DFCmIVBQe2uXlc",
  authDomain: "bharatloads-e4cbd.firebaseapp.com",
  databaseURL: "https://bharatloads-e4cbd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bharatloads-e4cbd",
  storageBucket: "bharatloads-e4cbd.firebasestorage.app",
  messagingSenderId: "949676261491",
  appId: "1:949676261491:web:d4dd36aedb351031a5aa06",
  measurementId: "G-HCVD7QQSK9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);