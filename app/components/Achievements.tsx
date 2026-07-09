"use client";

import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import { getProfile } from "@/lib/user";
import { getUnlockedAchievements, getNextAchievement } from "@/lib/achievements";
import type { Achievement } from "@/lib/achievements";

export default function Achievements() {
  const [unlocked, setUnlocked] = useState<Achievement[]>([]);
  const [nextAchievement, setNextAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const profile = getProfile();
    setUnlocked(getUnlockedAchievements(profile));
    setNextAchievement(getNextAchievement(profile));
  }, []);

  return (
    <div className="rounded-xl border-2 border-[#8c6239] bg-parchment p-6 shadow-[0_8px_20px_rgba(0,0,0,0.6)] text-[#2b2118]">
      <div className="flex items-center gap-3 border-b border-[#c1b087] pb-4">
        <div className="h-10 w-10 rounded-lg bg-[#ebdcc0] border border-[#8c6239] flex items-center justify-center shrink-0 shadow-inner">
          <Award className="h-6 w-6 text-[#8c6239]" />
        </div>
        <div>
          <p className="text-xs font-guild font-bold uppercase tracking-wider text-gold-stamped">Guild Honors</p>
          <h3 className="text-xl font-bold font-guild text-[#4a2e18]">Unlocked Milestones</h3>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {unlocked.length > 0 ? (
          unlocked.map((achievement, idx) => {
            const badgeIcon = idx % 4 === 0 ? "badge-legendary.svg" : idx % 3 === 0 ? "badge-platinum.svg" : idx % 2 === 0 ? "badge-gold.svg" : "badge-silver.svg";
            return (
              <div key={achievement.id} className="rounded-xl border-2 border-[#8c6239] bg-[#fff8ea] p-4 flex items-center gap-3.5 shadow-sm">
                <img src={`/assets/${badgeIcon}`} alt="Honor Medal" className="h-10 w-10 shrink-0 object-contain drop-shadow" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold font-guild text-[#4a2e18] text-sm">{achievement.title}</p>
                  <p className="mt-0.5 text-xs text-[#6e5338] leading-relaxed">{achievement.description}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl bg-[#fff8ea] border-2 border-[#c1b087] p-6 text-center text-sm font-guild font-semibold text-[#6e5338] shadow-inner">
            Complete your first quest scroll to claim your maiden guild medal.
          </div>
        )}
      </div>

      {nextAchievement ? (
        <div className="mt-6 rounded-xl bg-[#23170e] border-2 border-[#8c6239] p-4 text-[#f4ecd8] shadow-md">
          <p className="text-[10px] font-guild font-bold uppercase tracking-wider text-gold-etched">Upcoming Milestone Target</p>
          <p className="mt-1 font-bold font-guild text-[#fff8ea] text-sm flex items-center gap-2">
            <img src="/assets/badge-bronze.svg" alt="Target" className="h-5 w-5 object-contain" />
            <span>{nextAchievement.title}</span>
          </p>
          <p className="text-xs text-[#c2b59b] mt-1 leading-relaxed pl-7">{nextAchievement.description}</p>
        </div>
      ) : (
        <div className="mt-6 rounded-xl bg-[#23170e] border-2 border-[#8c6239] p-4 text-center text-sm font-guild font-bold text-gold-etched shadow-md">
          All Guild Milestones Unlocked — Supreme Grandmaster!
        </div>
      )}
    </div>
  );
}
