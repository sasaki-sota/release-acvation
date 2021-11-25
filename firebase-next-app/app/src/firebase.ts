import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
} from "@firebase/firestore";
import {
  Auth,
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
} from "@firebase/auth";
// import {
//   connectStorageEmulator,
//   FirebaseStorage,
//   getStorage,
// } from "@firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const db: Firestore = getFirestore(app);
// connectFirestoreEmulator(db, "localhost", 8080);

export const auth: Auth = getAuth(app);
// connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true });
export const provider: GoogleAuthProvider = new GoogleAuthProvider();
// provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

// storage飲みうまく動作しないのでver8を利用する
// https://zenn.dev/masalib/books/2d6e8470732c8b/viewer/1823bc
// export const storage: FirebaseStorage = getStorage(app);
// connectStorageEmulator(storage, "localhost", 9199);

const compactApp = firebase.initializeApp(firebaseConfig);
export const storage = firebase.storage(compactApp);
// ローカルの方でもうまく動作しないため
// storage.useEmulator("localhost", 9199)
