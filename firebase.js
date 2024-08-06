import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCyV91NIsWcfyUXD7x3Bmh7X6JwVH4Huyk",
    authDomain: "reactexpensetracking.firebaseapp.com",
    projectId: "reactexpensetracking",
    storageBucket: "reactexpensetracking.appspot.com",
    messagingSenderId: "662649829655",
    appId: "1:662649829655:web:4171aae3005f5f589a9f52"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };