// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };

// const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);


import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDtRaxkhywwSCNUle5F_3jd5uF6636Ko00",
  authDomain: "luxora-f3f7d.firebaseapp.com",
  projectId: "luxora-f3f7d",
  storageBucket: "luxora-f3f7d.firebasestorage.app",
  messagingSenderId: "855248837090",
  appId: "1:855248837090:web:9b502b4bcfd26a696d01bb"
};

// Return app instance or dummy fallback object during build phase
const app: FirebaseApp = getApps().length
  ? getApp()
  : initializeApp(
      firebaseConfig.apiKey
        ? firebaseConfig
        : { apiKey: 'build-phase-placeholder', projectId: 'placeholder' }
    );

export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);