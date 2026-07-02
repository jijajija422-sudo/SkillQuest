"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth, isFirebaseConfigured, loginWithGoogle as firebaseLogin, logoutUser as firebaseLogout, fetchUserProfileDb, saveUserProfileDb, followUserDb, unfollowUserDb } from "./firebase";
import type { UserProfile } from "./types";
import { getProfile as getLocalProfile, saveProfile as saveLocalProfile, addXp as addXpToProfile } from "./user";

interface AuthContextType {
  user: User | null;
  profile: UserProfile;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateHeroName: (newName: string) => Promise<void>;
  updateProfileDetails: (partial: Partial<UserProfile>) => Promise<void>;
  followUser: (targetUid: string) => Promise<void>;
  unfollowUser: (targetUid: string) => Promise<void>;
  awardXp: (xpAmount: number, questId: string) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    id: "guest",
    name: "Adventurer",
    xp: 0,
    level: 1,
    completedQuests: [],
  });
  const [loading, setLoading] = useState(true);

  const [authErrorModal, setAuthErrorModal] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) {
      setProfile(getLocalProfile());
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        let dbProfile = await fetchUserProfileDb(firebaseUser.uid);
        if (!dbProfile) {
          dbProfile = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || "Adventurer",
            xp: 0,
            level: 1,
            completedQuests: [],
          };
          await saveUserProfileDb(dbProfile);
        }
        setProfile(dbProfile);
        saveLocalProfile(dbProfile);
      } else {
        setProfile(getLocalProfile());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    if (isFirebaseConfigured()) {
      try {
        await firebaseLogin();
      } catch (err: any) {
        if (
          err?.code === "auth/cancelled-popup-request" ||
          err?.code === "auth/popup-closed-by-user" ||
          err?.message?.includes("cancelled-popup-request") ||
          err?.message?.includes("popup-closed-by-user")
        ) {
          console.log("Google sign-in popup cancelled or closed by user.");
          return;
        }
        if (
          err?.code === "auth/configuration-not-found" ||
          err?.code === "auth/operation-not-allowed" ||
          err?.message?.includes("configuration-not-found") ||
          err?.message?.includes("operation-not-allowed")
        ) {
          setAuthErrorModal(err?.code || "auth/configuration-not-found");
          return;
        }
        alert(`Authentication error: ${err.message || "Could not sign in with Google."}`);
      }
    } else {
      alert("Firebase is running in local demo mode. Configure API keys in .env.local to enable Google Login.");
    }
  };

  const simulateDevLogin = async () => {
    const fakeUser = {
      uid: "google-dev-hero-101",
      displayName: "Google Adventurer",
      email: "adventurer@skillquest.dev",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    } as User;
    setUser(fakeUser);
    let dbProfile = await fetchUserProfileDb(fakeUser.uid);
    if (!dbProfile) {
      dbProfile = {
        id: fakeUser.uid,
        name: "Google Adventurer",
        xp: 150,
        level: 2,
        completedQuests: ["q1"],
      };
      await saveUserProfileDb(dbProfile);
    }
    setProfile(dbProfile);
    saveLocalProfile(dbProfile);
    setAuthErrorModal(null);
  };

  const logout = async () => {
    if (isFirebaseConfigured() && auth && auth.currentUser) {
      await firebaseLogout();
    }
    setUser(null);
    const guest = getLocalProfile();
    setProfile(guest);
  };

  const updateHeroName = async (newName: string) => {
    const trimmed = newName.trim() || "Adventurer";
    const updated = { ...profile, name: trimmed };
    setProfile(updated);
    saveLocalProfile(updated);
    if (user && isFirebaseConfigured()) {
      await saveUserProfileDb(updated);
    }
    window.dispatchEvent(new CustomEvent("skillquest-profile-update"));
  };

  const updateProfileDetails = async (partial: Partial<UserProfile>) => {
    const updated = { ...profile, ...partial };
    setProfile(updated);
    saveLocalProfile(updated);
    if (isFirebaseConfigured() && profile.id !== "guest") {
      await saveUserProfileDb(updated);
    }
    window.dispatchEvent(new CustomEvent("skillquest-profile-update"));
  };

  const followUser = async (targetUid: string) => {
    if (profile.id === "guest" || profile.id === targetUid) return;
    const currentFollowing = profile.following || [];
    if (currentFollowing.includes(targetUid)) return;
    const updated = { ...profile, following: [...currentFollowing, targetUid] };
    setProfile(updated);
    saveLocalProfile(updated);
    if (isFirebaseConfigured()) {
      await followUserDb(profile.id, targetUid);
    }
    window.dispatchEvent(new CustomEvent("skillquest-profile-update"));
  };

  const unfollowUser = async (targetUid: string) => {
    if (profile.id === "guest" || profile.id === targetUid) return;
    const currentFollowing = profile.following || [];
    if (!currentFollowing.includes(targetUid)) return;
    const updated = { ...profile, following: currentFollowing.filter(id => id !== targetUid) };
    setProfile(updated);
    saveLocalProfile(updated);
    if (isFirebaseConfigured()) {
      await unfollowUserDb(profile.id, targetUid);
    }
    window.dispatchEvent(new CustomEvent("skillquest-profile-update"));
  };

  const awardXp = async (xpAmount: number, questId: string): Promise<UserProfile> => {
    if (profile.completedQuests.includes(questId)) return profile;
    const withQuest = { ...profile, completedQuests: [...profile.completedQuests, questId] };
    const updated = addXpToProfile(withQuest, xpAmount);
    setProfile(updated);
    saveLocalProfile(updated);
    if (user && isFirebaseConfigured()) {
      await saveUserProfileDb(updated);
    }
    window.dispatchEvent(new CustomEvent("skillquest-profile-update"));
    return updated;
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, updateHeroName, updateProfileDetails, followUser, unfollowUser, awardXp }}>
      {children}

      {authErrorModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl border border-cyan-500/40 bg-slate-900 p-8 shadow-[0_0_40px_rgba(6,182,212,0.25)] text-white">
            <div className="flex items-center gap-3 text-cyan-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-950 border border-cyan-500/40 text-lg font-bold">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-white">Enable Google Sign-In in Firebase</h3>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              Your API keys are connected to project <span className="font-semibold text-cyan-300">skillquest-f8a2c</span>! However, Google Sign-In has not been turned on yet inside your Firebase Console.
            </p>
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 p-5 text-sm space-y-3">
              <p className="font-semibold text-white">To enable it in 20 seconds:</p>
              <ol className="list-decimal list-inside space-y-2 text-slate-300 text-xs sm:text-sm">
                <li>
                  Click here to open your project settings:{" "}
                  <a
                    href="https://console.firebase.google.com/project/skillquest-f8a2c/authentication/providers"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 underline font-semibold hover:text-cyan-300"
                  >
                    Open Firebase Providers Console ↗
                  </a>
                </li>
                <li>Click <span className="text-white font-medium">Add new provider</span> → select <span className="text-white font-medium">Google</span>.</li>
                <li>Toggle the switch to <span className="text-emerald-400 font-medium">Enable</span>, select your project support email, and click <span className="text-white font-medium">Save</span>.</li>
              </ol>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setAuthErrorModal(null)}
                className="w-full sm:w-auto rounded-xl px-5 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 transition"
              >
                Close
              </button>
              <button
                type="button"
                onClick={simulateDevLogin}
                className="w-full sm:w-auto rounded-xl border border-fuchsia-500/50 bg-fuchsia-950/40 px-5 py-2.5 text-sm font-semibold text-fuchsia-300 hover:bg-fuchsia-900/60 transition shadow-[0_0_15px_rgba(217,70,239,0.2)]"
              >
                Simulate Google Login (Dev Mode)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthErrorModal(null);
                  login();
                }}
                className="w-full sm:w-auto rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500 transition shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              >
                I Enabled It — Retry Login
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
