import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import * as dotenv from "dotenv";

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.VITE_FIREBASE_APP_ID || "",
};

const COLLECTIONS = [
  "registrations",
  "counters",
  "settings",
  "auditLogs",
  "notifications",
  "_test_connection",
];

async function inspectData() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log(`🔍 Inspecting Firestore Project: ${firebaseConfig.projectId}`);
  for (const colName of COLLECTIONS) {
    try {
      const snap = await getDocs(collection(db, colName));
      console.log(`Collection '${colName}': ${snap.size} document(s)`);
    } catch (err: any) {
      console.error(`Error checking '${colName}':`, err.message);
    }
  }
}

inspectData();
