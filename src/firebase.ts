import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAtgLfUsqHeYlHfqITsFOpWUtHV2jr45jc",
  authDomain: "apore-vault.firebaseapp.com",
  projectId: "apore-vault",
  storageBucket: "apore-vault.appspot.com",
  messagingSenderId: "612796850763",
  appId: "1:612796850763:web:eb0e5c7d5495e2c14123ce",
  measurementId: "G-K50MSGGB8N"
};


export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);