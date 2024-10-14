import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCcqmdFsxF9AUuBfcG7Lmbjo9oPyqJt4Nw",
    authDomain: "mini-project-1-8263d.firebaseapp.com",
    projectId: "mini-project-1-8263d",
    storageBucket: "mini-project-1-8263d.appspot.com",
    messagingSenderId: "370304896567",
    appId: "1:370304896567:web:8a3b9f60bb8218e80179b2"
  };
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);