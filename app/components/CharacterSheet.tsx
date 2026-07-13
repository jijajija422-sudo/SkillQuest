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
      <div className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-6 shadow-neu-raised text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-teal-600">Member Profile Dashboard</p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl btn-bronze px-3 py-1.5 text-xs font-bold transition shadow-neu-raised-sm hover:scale-[1.02]"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#e6ecf2] border border-slate-200/80 overflow-hidden shrink-0 shadow-neu-inset-sm">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-slate-800">{profile.level}</span>
            )}
            <span className="absolute bottom-0 right-0 bg-slate-800 border-t border-l border-slate-700 px-1.5 py-0.5 text-[10px] font-bold text-white rounded-tl-lg">
              Lvl {profile.level}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-800 truncate text-lg">{profile.name}</p>
            <p className="text-xs font-semibold text-slate-500">{profile.classTitle || "SkillHub Member"}</p>
            <p className="text-xs text-teal-600 font-bold mt-0.5">{titleForLevel(profile.level)}</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600">
            <span>Level Progression</span>
            <span className="font-bold text-slate-800">
              {profile.xp.toLocaleString()} / {xpNeeded.toLocaleString()} Points
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full border border-slate-200/80 bg-[#e6ecf2] p-0.5 shadow-neu-inset-sm">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-blue-500 transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs font-semibold text-slate-600 border-t border-slate-200/80 pt-4">
          <span>Followers: <strong className="text-slate-800 font-bold">{(profile.followers || []).length}</strong></span>
          <span>Following: <strong className="text-slate-800 font-bold">{(profile.following || []).length}</strong></span>
          <span>Completed Challenges: <strong className="text-slate-800 font-bold">{profile.completedQuests.length}</strong></span>
        </div>
      </div>
    </>
  );
}

export function updateProfileGlobally(profile: UserProfile) {
  saveProfile(profile);
  window.dispatchEvent(new CustomEvent("skillquest-profile-update"));
  window.dispatchEvent(new CustomEvent("skillhub-profile-update"));
}

