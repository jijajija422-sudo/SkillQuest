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
    <div className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-6 shadow-neu-raised text-slate-800">
      <div className="flex items-center gap-3 border-b border-slate-200/80 pb-4">
        <div className="h-10 w-10 rounded-xl bg-[#e6ecf2] border border-slate-200/80 flex items-center justify-center shrink-0 shadow-neu-inset-sm">
          <Award className="h-6 w-6 text-teal-600" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal-600">Skill Badges</p>
          <h3 className="text-xl font-bold text-slate-800">Journey Milestones</h3>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {unlocked.length > 0 ? (
          unlocked.map((achievement, idx) => {
            const badgeIcon = idx % 4 === 0 ? "badge-legendary.svg" : idx % 3 === 0 ? "badge-platinum.svg" : idx % 2 === 0 ? "badge-gold.svg" : "badge-silver.svg";
            return (
              <div key={achievement.id} className="rounded-xl border border-slate-200/80 bg-[#e6ecf2] p-4 flex items-center gap-3.5 shadow-neu-inset-sm">
                <img src={`/assets/${badgeIcon}`} alt="Badge" className="h-10 w-10 shrink-0 object-contain drop-shadow" />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800 text-sm">{achievement.title}</p>
                  <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">{achievement.description}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-xl bg-[#e6ecf2] border border-slate-200/80 p-6 text-center text-sm font-semibold text-slate-500 shadow-neu-inset-sm">
            Complete your first skill verification to unlock your first badge.
          </div>
        )}
      </div>

      {nextAchievement ? (
        <div className="mt-6 rounded-xl bg-slate-900 border border-slate-800 p-4 text-white shadow-neu-raised-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Next Milestone Target</p>
          <p className="mt-1 font-bold text-white text-sm flex items-center gap-2">
            <img src="/assets/badge-bronze.svg" alt="Target" className="h-5 w-5 object-contain" />
            <span>{nextAchievement.title}</span>
          </p>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed pl-7">{nextAchievement.description}</p>
        </div>
      ) : (
        <div className="mt-6 rounded-xl bg-slate-900 border border-slate-800 p-4 text-center text-sm font-bold text-teal-400 shadow-neu-raised-sm">
          All Milestones Unlocked — Master SkillHub Pro!
        </div>
      )}
    </div>
  );
}

