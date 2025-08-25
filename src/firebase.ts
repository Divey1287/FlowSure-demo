import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcBIc8PVPRc4l-i4FeoXBwo2CF6UjwgaY",
  authDomain: "flowsure-39298.firebaseapp.com",
  projectId: "flowsure-39298",
  storageBucket: "flowsure-39298.firebasestorage.app",
  messagingSenderId: "486879913422",
  appId: "1:486879913422:web:583c3cbeec66cad7cbf79f",
  measurementId: "G-2Q67GQ1MWX"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);