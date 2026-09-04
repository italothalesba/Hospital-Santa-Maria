import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "gen-lang-client-0418888020",
  appId: "1:527982913697:web:000529645090968f91e8e0",
  apiKey: "AIzaSyA6OESxtrK-09AgtBMIjRv2Y8t4sNdK39g",
  authDomain: "gen-lang-client-0418888020.firebaseapp.com",
  storageBucket: "gen-lang-client-0418888020.firebasestorage.app",
  messagingSenderId: "527982913697"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-hospitalsantamar-2cdf01fc-9174-457a-8901-fabfc410a7b6");
export const auth = getAuth(app);
