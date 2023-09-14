// firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwUl_S8KR4gxdvKCn2au6F78DBKbqTX_0",
  authDomain: "honey2023-f2061.firebaseapp.com",
  databaseURL: "https://honey2023-f2061-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "honey2023-f2061",
  storageBucket: "honey2023-f2061.appspot.com",
  messagingSenderId: "556062818578",
  appId: "1:556062818578:web:190c0d43d2599bea13f3cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
