import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBofWevCvKSTbD2Wgy5v05kyzqKIIkmPFs",
  authDomain: "bookstore-economy.firebaseapp.com",
  projectId: "bookstore-economy",
  storageBucket: "bookstore-economy.appspot.com",
  messagingSenderId: "733671429818",
  appId: "1:733671429818:web:fc36f5fc97bcbb95e19483",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage();
export const db = getFirestore(app);

export default app;

