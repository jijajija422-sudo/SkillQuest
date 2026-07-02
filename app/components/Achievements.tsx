"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
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
    <div className="rounded-[2rem] border border-theme bg-theme-surface p-8 shadow-xl shadow-slate-200/50 dark:border-theme dark:shadow-slate-950/30">
      <div className="flex items-center gap-3">
        <Sparkles className="h-5 w-5 text-amber-500" />
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Achievements</p>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Milestones earned</h3>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {unlocked.length > 0 ? (
          unlocked.map((achievement) => (
            <div key={achievement.id} className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <p className="font-semibold text-slate-900 dark:text-white">{achievement.title}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{achievement.description}</p>
            </div>
          ))
        ) : (
          <div className="rounded-3xl bg-slate-50 p-4 text-slate-600 dark:bg-slate-900/50 dark:text-slate-300">
            Unlock your first achievement by completing a quest.
          </div>
        )}
      </div>

      {nextAchievement ? (
        <div className="mt-6 rounded-3xl bg-slate-100 p-4 dark:bg-slate-900/70">
          <p className="text-sm text-slate-500 dark:text-slate-400">Next achievement</p>
          <p className="mt-2 font-semibold text-slate-900 dark:text-white">{nextAchievement.title}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{nextAchievement.description}</p>
        </div>
      ) : (
        <div className="mt-6 rounded-3xl bg-emerald-50 p-4 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
          You have unlocked all current achievements — keep going!
        </div>
      )}
    </div>
  );
}
