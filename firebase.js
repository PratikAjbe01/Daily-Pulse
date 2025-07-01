import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCkqN1RyAtx1v3w0coG38uvfxGsO3Z33fw",
  authDomain: "daily-pulse-ed591.firebaseapp.com",
  projectId: "daily-pulse-ed591",
  storageBucket: "daily-pulse-ed591.firebasestorage.app",
  messagingSenderId: "953859705100",
  appId: "1:953859705100:web:47b7bd01bc2df39b832129",
  measurementId: "G-B1SV30DBXN"
};

export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);