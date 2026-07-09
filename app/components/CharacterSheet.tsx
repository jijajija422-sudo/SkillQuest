"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { titleForLevel, xpForLevel, saveProfile } from "@/lib/user";
import type { UserProfile } from "@/lib/types";
import ProfileModal from "./ProfileModal";
import { Edit3, Shield } from "lucide-react";

export default function CharacterSheet() {
  const { profile } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  if (!profile) return null;

  const xpNeeded = xpForLevel(profile.level);
  const pct = Math.min(100, Math.round((profile.xp / xpNeeded) * 100));

  return (
    <>
      <ProfileModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      <div className="rounded-xl border-2 border-[#8c6239] bg-parchment p-6 shadow-[0_8px_20px_rgba(0,0,0,0.6)] text-[#2b2118]">
        <div className="flex items-center justify-between border-b border-[#c1b087] pb-3">
          <p className="text-xs font-guild font-bold uppercase tracking-wider text-gold-stamped">Guild Adventurer Sheet</p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg btn-bronze px-3 py-1.5 text-xs font-guild font-bold transition"
          >
            <Edit3 className="h-3.5 w-3.5" />
            <span>Modify Dossier</span>
          </button>
        </div>

        <div className="mt-5 flex items-center gap-4">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-lg bg-[#ebdcc0] border-2 border-[#8c6239] overflow-hidden shrink-0 shadow-inner">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xl font-bold font-guild text-[#4a2e18]">{profile.level}</span>
            )}
            <span className="absolute bottom-0 right-0 bg-[#4a2e18] border-t border-l border-[#8c6239] px-1.5 py-0.5 text-[10px] font-guild font-bold text-[#f5d77f] rounded-tl">
              Lvl {profile.level}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold font-guild text-[#4a2e18] truncate text-lg">{profile.name}</p>
            <p className="text-xs font-semibold text-[#6e5338]">{profile.classTitle || "Guild Explorer"}</p>
            <p className="text-xs text-[#8c6239] font-guild font-bold mt-0.5">{titleForLevel(profile.level)}</p>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-guild font-bold text-[#6e5338]">
            <span>Rank Progression</span>
            <span className="font-bold text-[#4a2e18]">
              {profile.xp.toLocaleString()} / {xpNeeded.toLocaleString()} XP
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full border border-[#8c6239] bg-[#ebdcc0] p-0.5 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#235338] via-[#1b432d] to-[#10b981] transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-xs font-guild font-semibold text-[#5c3a1a] border-t border-[#c1b087] pt-4">
          <span>Comrades: <strong className="text-[#4a2e18] font-bold">{(profile.followers || []).length}</strong></span>
          <span>Following: <strong className="text-[#4a2e18] font-bold">{(profile.following || []).length}</strong></span>
          <span>Sealed Quests: <strong className="text-[#4a2e18] font-bold">{profile.completedQuests.length}</strong></span>
        </div>
      </div>
    </>
  );
}

export function updateProfileGlobally(profile: UserProfile) {
  saveProfile(profile);
  window.dispatchEvent(new CustomEvent("skillquest-profile-update"));
}
