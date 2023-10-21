import { initializeApp } from "firebase/app";
import firebaseConfig from "./firebase.config";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const initializeFirebase = () => {
  initializeApp(firebaseConfig);
};

export const db = getFirestore(initializeApp(firebaseConfig));
export const storage = getStorage(initializeApp(firebaseConfig));
export const app = initializeApp(firebaseConfig);
