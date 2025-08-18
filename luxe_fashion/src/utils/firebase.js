import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAZpwsi4FTk1JRapyOk9EAkq6ooZ5WROgk",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "loginluxefashion.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "loginluxefashion",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "loginluxefashion.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "269632583286",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:269632583286:web:b73be2b6d2c28b7ca39157"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Configure Google Auth Provider
provider.setCustomParameters({
  prompt: 'select_account'
});

// Configure auth settings
auth.useDeviceLanguage();
auth.settings.appVerificationDisabledForTesting = false;

export { auth, provider };