import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD85LClNL6QLOkiHBCQgG2xeQacqqbIKv8",
  authDomain: "teamtapestry-39ff7.firebaseapp.com",
  projectId: "teamtapestry-39ff7",
  storageBucket: "teamtapestry-39ff7.appspot.com",
  messagingSenderId: "504988729644",
  appId: "1:504988729644:web:9b69315ac150eec768ac89"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Test function to check Firebase connection
export const testFirebaseConnection = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'departments'));
    console.log('Successfully connected to Firebase. Departments collection exists.');
    return true;
  } catch (error) {
    console.error('Error connecting to Firebase:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    // Return false even if there's an error, so the app can continue loading
    return false;
  }
};

export default app;
