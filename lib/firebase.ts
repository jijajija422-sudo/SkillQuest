import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  increment,
  getDoc,
  setDoc,
  getDocs,
  limit
} from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import type { GuildCompletion, UserProfile } from "./types";

// Grab keys from your .env.local file
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export function isFirebaseConfigured() {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey.trim() !== "" &&
    firebaseConfig.apiKey !== "your_api_key" &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId.trim() !== "" &&
    firebaseConfig.projectId !== "your_project_id"
  );
}

// Initialize Firebase securely (prevents crashing in Next.js when keys are omitted)
const app = isFirebaseConfigured()
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : null;

export const db = app ? getFirestore(app) : (null as any);
export const auth = app ? getAuth(app) : (null as any);
export const googleProvider = app ? new GoogleAuthProvider() : (null as any);

if (googleProvider) {
  googleProvider.setCustomParameters({ prompt: "select_account" });
}

// DATABASE: Save a new quest completion to Firestore
export async function postCompletion(payload: Omit<GuildCompletion, "id" | "createdAt" | "applause" | "applaudedBy">) {
  if (!isFirebaseConfigured() || !db) throw new Error("Firebase not configured");

  const docRef = await addDoc(collection(db, "feed"), {
    ...payload,
    createdAt: Date.now(),
    applause: 0,
    applaudedBy: []
  });
  return docRef.id;
}

// DATABASE: Stream live updates to the Guild Feed
export function subscribeToFeed(callback: (feed: GuildCompletion[]) => void) {
  if (!isFirebaseConfigured() || !db) return () => { };

  const q = query(collection(db, "feed"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const feed = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as GuildCompletion[];
    callback(feed);
  });
}

// DATABASE: Save a like/applaud
export async function applaudCompletion(itemId: string, userId: string) {
  if (!isFirebaseConfigured() || !db) return;

  const itemRef = doc(db, "feed", itemId);
  await updateDoc(itemRef, {
    applaudedBy: arrayUnion(userId),
    applause: increment(1)
  });
}

// FIRESTORE PROFILES: Fetch a user profile by UID
export async function fetchUserProfileDb(uid: string): Promise<UserProfile | null> {
  if (!isFirebaseConfigured() || !db) return null;
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return snapshot.data() as UserProfile;
  }
  return null;
}

// FIRESTORE PROFILES: Save or update a user profile
export async function saveUserProfileDb(profile: UserProfile): Promise<void> {
  if (!isFirebaseConfigured() || !db) return;
  const userRef = doc(db, "users", profile.id);
  await setDoc(userRef, profile, { merge: true });
}

// FIRESTORE SOCIAL: Follow another user profile
export async function followUserDb(currentUserId: string, targetUserId: string): Promise<void> {
  if (!isFirebaseConfigured() || !db || currentUserId === targetUserId) return;
  const currentRef = doc(db, "users", currentUserId);
  const targetRef = doc(db, "users", targetUserId);
  await updateDoc(currentRef, { following: arrayUnion(targetUserId) }).catch(() => {});
  await updateDoc(targetRef, { followers: arrayUnion(currentUserId) }).catch(() => {});
}

// FIRESTORE SOCIAL: Unfollow a user profile
export async function unfollowUserDb(currentUserId: string, targetUserId: string): Promise<void> {
  if (!isFirebaseConfigured() || !db || currentUserId === targetUserId) return;
  const currentRef = doc(db, "users", currentUserId);
  const targetRef = doc(db, "users", targetUserId);
  await updateDoc(currentRef, { following: arrayRemove(targetUserId) }).catch(() => {});
  await updateDoc(targetRef, { followers: arrayRemove(currentUserId) }).catch(() => {});
}

// FIRESTORE SOCIAL: Fetch public community profiles
export async function fetchPublicProfilesDb(limitNum = 20): Promise<UserProfile[]> {
  if (!isFirebaseConfigured() || !db) return [];
  const q = query(collection(db, "users"), limit(limitNum));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as UserProfile);
}

// AUTHENTICATION: Protected Google Login function
let activeLoginPromise: Promise<any> | null = null;

export const loginWithGoogle = async () => {
  if (!auth || !googleProvider) {
    throw new Error("Firebase not configured");
  }
  if (activeLoginPromise) {
    return activeLoginPromise;
  }
  try {
    activeLoginPromise = signInWithPopup(auth, googleProvider);
    const result = await activeLoginPromise;
    return result;
  } finally {
    activeLoginPromise = null;
  }
};

export const logoutUser = () => auth ? signOut(auth) : Promise.resolve();