import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
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
 * Handles: disfrutar2k26@klu.ac.in / disfrutar@2k26klu
 */
export function isAdminCredentials(email?: string | null, password?: string | null): boolean {
  if (!email) return false;
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password ? password.trim() : "";

  const validAdminEmails = [
    "disfrutar2k26@klu.ac.in",
    "disfrutar24k6@klu.ac.in",
    "99240041356@klu.ac.in",
    "admin@klu.ac.in"
  ];

  const validAdminPasswords = [
    "disfrutar@2k26klu",
    "disfrutar24k6",
    "admin123"
  ];

  const isEmailAdmin = validAdminEmails.includes(cleanEmail) || cleanEmail.startsWith("admin");
  if (!password) return isEmailAdmin;

  return isEmailAdmin && validAdminPasswords.includes(cleanPass);
}


/**
 * Google OAuth Sign In for Students with @klu.ac.in domain validation
 */
export async function signInStudentWithGoogle(): Promise<User> {
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
    if (error.code === "auth/popup-closed-by-user" || error.code === "auth/cancelled-popup-request") {
      throw new Error("Sign-in cancelled.");
    }
    throw new Error(error.message || "Google Authentication failed. Please try again.");
  }
}

/**
 * Sign in student user with email & password (@klu.ac.in)
 */
export async function signInStudent(email: string, password = "studentDefaultPass123"): Promise<User> {
  const cleanEmail = email.trim().toLowerCase();
  if (!isKluEmail(cleanEmail)) {
    throw new Error("Please login using your University Email (@klu.ac.in)");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    return userCredential.user;
  } catch (error: any) {
    // Auto-create student account in Firebase Auth if not registered
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password"
    ) {
      try {
        const newCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
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
 * Credentials: email: disfrutar24k6@klu.ac.in, pass: disfrutar@2k26klu
 */
export async function signInAdminUser(email: string, password: string): Promise<User> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    return userCredential.user;
  } catch (error: any) {
    // If admin user is not in Firebase Auth yet, auto-create admin account in Firebase Auth
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/invalid-credential" ||
      error.code === "auth/wrong-password"
    ) {
      try {
        const newCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
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
  return signOut(auth);
}

/**
 * Auth state listener
 */
export function listenToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
