"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { titleForLevel, xpForLevel, saveProfile } from "@/lib/user";
import type { UserProfile } from "@/lib/types";
import ProfileModal from "./ProfileModal";
import { Edit3 } from "lucide-react";

export default function CharacterSheet() {
  const { profile } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (!profile) return null;

  const xpNeeded = xpForLevel(profile.level);
  const pct = Math.min(100, Math.round((profile.xp / xpNeeded) * 100));

  return (
    <>
      <ProfileModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <div className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
        <div className="flex items-center justify-between">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">Character Sheet</p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/60 transition"
          >
            <Edit3 className="h-3 w-3" />
            <span>Edit</span>
          </button>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 border border-cyan-500/40 overflow-hidden shrink-0">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-white">{profile.level}</span>
            )}
            <span className="absolute bottom-0 right-0 bg-cyan-600 px-1.5 py-0.5 text-[10px] font-black text-white rounded-tl-lg">
              {profile.level}
            </span>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-white truncate text-lg">{profile.name}</p>
            <p className="text-xs text-cyan-300 font-medium">{profile.classTitle || "Fullstack Paladin"}</p>
            <p className="text-xs text-slate-400 mt-0.5">{titleForLevel(profile.level)}</p>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>XP Progress</span>
            <span className="font-semibold text-cyan-300">
              {profile.xp.toLocaleString()} / {xpNeeded.toLocaleString()}
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-black/40 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-4">
          <span>Followers: <strong className="text-white">{(profile.followers || []).length}</strong></span>
          <span>Following: <strong className="text-white">{(profile.following || []).length}</strong></span>
          <span>Quests: <strong className="text-emerald-400">{profile.completedQuests.length}</strong></span>
        </div>
      </div>
    </>
  );
}

export function updateProfileGlobally(profile: UserProfile) {
  saveProfile(profile);
  window.dispatchEvent(new CustomEvent("skillquest-profile-update"));
}
