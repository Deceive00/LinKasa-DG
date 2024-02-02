// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore} from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiI7lfFjZLXXzYfAB84Oeo96jKBSqQhFQ",
  authDomain: "dg-linkasa.firebaseapp.com",
  projectId: "dg-linkasa",
  storageBucket: "dg-linkasa.appspot.com",
  messagingSenderId: "471807426282",
  appId: "1:471807426282:web:f28ae6db1df8060f33e193"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage();
export const auth = getAuth(app);
export const registerAuth = getAuth(app);
export const db = getFirestore(app)