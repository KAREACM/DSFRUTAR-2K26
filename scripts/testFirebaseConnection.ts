import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || "",
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.VITE_FIREBASE_APP_ID || "",
};

async function testConnection() {
  console.log("🔥 Testing Firebase Connection to Project:", firebaseConfig.projectId);

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const testRef = doc(db, "_test_connection", "ping");
    await setDoc(testRef, {
      status: "connected",
      project: "disfrutar-2k26",
      timestamp: new Date().toISOString(),
    });
    console.log("✅ Successfully wrote test ping document to Firestore!");

    const querySnapshot = await getDocs(collection(db, "_test_connection"));
    console.log(`✅ Successfully fetched ${querySnapshot.size} test document(s) from Firestore!`);

    await deleteDoc(testRef);
    console.log("✅ Successfully cleaned up test document!");

    console.log("🚀 DISFRUTAR 2K26 Firebase Connection & Architecture Verification Passed 100%!");
  } catch (err: any) {
    console.error("❌ Firebase connection error:", err.message);
  }
}

testConnection();
