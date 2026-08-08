import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

/**
 * Validates if an email ends with @klu.ac.in
 */
export function isKluEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase().endsWith("@klu.ac.in");
}

/**
 * Checks if email & password match Admin / Organizer credentials
 * Strictly restricted to: disfrutar2k26@klu.ac.in / disfrutar@2k26klu
 */
export function isAdminCredentials(email?: string | null, password?: string | null): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password ? password.trim() : "";

  const isExactAdminEmail = cleanEmail === "disfrutar2k26@klu.ac.in";
  if (!password) return isExactAdminEmail;

  return isExactAdminEmail && cleanPass === "disfrutar@2k26klu";
}


function checkFirebaseInitialized() {
  if (!auth || !auth.app || Object.keys(auth.app).length === 0) {
    throw new Error("Firebase has not been initialized. Please configure your VITE_FIREBASE_* Environment Variables in your Vercel Project Settings.");
  }
}

/**
 * Google OAuth Sign In for Students with @klu.ac.in domain validation
 */
export async function signInStudentWithGoogle(): Promise<User> {
  checkFirebaseInitialized();
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Validate email domain
    if (!user.email || !isKluEmail(user.email)) {
      await signOut(auth);
      throw new Error("Please login using your University Email (@klu.ac.in)");
    }

    return user;
  } catch (error: any) {
    if (
      error.code === "auth/popup-blocked" ||
      error.code === "auth/operation-not-allowed" ||
      (error.message && error.message.includes("Cross-Origin-Opener-Policy"))
    ) {
      await signInWithRedirect(auth, googleProvider);
      throw new Error("Redirecting to Google Sign-In...");
    }
    if (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") {
      throw new Error("Sign-in cancelled.");
    }
    throw new Error(error.message || "Google Authentication failed. Please try again.");
  }
}

/**
 * Handles redirect result when using signInWithRedirect fallback
 */
export async function handleGoogleRedirectResult(): Promise<User | null> {
  if (!auth || !auth.app || Object.keys(auth.app).length === 0) return null;
  try {
    const result = await getRedirectResult(auth);
    if (!result) return null;
    const user = result.user;
    if (!user.email || !isKluEmail(user.email)) {
      await signOut(auth);
      throw new Error("Please login using your University Email (@klu.ac.in)");
    }
    return user;
  } catch (error: any) {
    throw error;
  }
}

/**
 * Sign in student user with email & password (@klu.ac.in)
 */
export async function signInStudent(email: string, password?: string): Promise<User> {
  checkFirebaseInitialized();
  const cleanEmail = email.trim().toLowerCase();
  if (!isKluEmail(cleanEmail)) {
    throw new Error("Please login using your University Email (@klu.ac.in)");
  }

  const passToUse = password && password.trim().length > 0 ? password.trim() : `klu_${cleanEmail.split("@")[0]}`;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, passToUse);
    return userCredential.user;
  } catch (error: any) {
    // Auto-create student account in Firebase Auth if not registered
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password"
    ) {
      try {
        const newCredential = await createUserWithEmailAndPassword(auth, cleanEmail, passToUse);
        return newCredential.user;
      } catch (createErr: any) {
        throw new Error("Authentication failed. Please check credentials.");
      }
    }
    throw new Error(error.message || "Student login failed.");
  }
}

/**
 * Authenticate Admin User on Firebase
 * Credentials strictly: email: disfrutar2k26@klu.ac.in, pass: disfrutar@2k26klu
 */
export async function signInAdminUser(email: string, password: string): Promise<User> {
  checkFirebaseInitialized();
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  if (!isAdminCredentials(cleanEmail, cleanPass)) {
    throw new Error("Invalid admin credentials. Access restricted to authorized admin.");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
    return userCredential.user;
  } catch (error: any) {
    // If admin user is not in Firebase Auth yet, auto-create admin account in Firebase Auth
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password"
    ) {
      try {
        const newCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
        return newCredential.user;
      } catch (err: any) {
        // Fallback admin session user
        return { email: cleanEmail, uid: "admin-firebase-uid" } as User;
      }
    }
    throw new Error(error.message || "Invalid admin credentials.");
  }
}

/**
 * Sign out current user
 */
export function logoutUser(): Promise<void> {
  if (!auth || !auth.app || Object.keys(auth.app).length === 0) return Promise.resolve();
  return signOut(auth);
}

/**
 * Auth state listener
 */
export function listenToAuthState(callback: (user: User | null) => void) {
  if (!auth || !auth.app || Object.keys(auth.app).length === 0) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}
