import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCVUcHehJUWyRhkEd6iujNbbD7DIGKx3Vc",
  authDomain: "marketplace-app-a6514.firebaseapp.com",
  projectId: "marketplace-app-a6514",
  storageBucket: "marketplace-app-a6514.appspot.com",
  messagingSenderId: "774455238801",
  appId: "1:774455238801:web:96b4de62c0b111bf7c5f30",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
