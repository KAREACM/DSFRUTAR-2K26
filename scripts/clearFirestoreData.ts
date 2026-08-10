import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
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

const COLLECTIONS_TO_CLEAR = [
  "registrations",
  "counters",
  "settings",
  "auditLogs",
  "notifications",
  "_test_connection",
];

async function clearAllData() {
  console.log(`⚠️ STARTING DATA DELETION on Firebase Project: ${firebaseConfig.projectId}`);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  let totalDeleted = 0;

  for (const colName of COLLECTIONS_TO_CLEAR) {
    try {
      const snap = await getDocs(collection(db, colName));
      console.log(`Deleting ${snap.size} document(s) from collection '${colName}'...`);
      for (const docSnap of snap.docs) {
        await deleteDoc(doc(db, colName, docSnap.id));
        totalDeleted++;
      }
      console.log(`✅ Collection '${colName}' is now clean.`);
    } catch (err: any) {
      console.error(`❌ Error clearing collection '${colName}':`, err.message);
    }
  }

  console.log(`\n🎉 Deletion Complete! Deleted a total of ${totalDeleted} document(s). Firestore project '${firebaseConfig.projectId}' is now 100% clean.`);
}

clearAllData();
