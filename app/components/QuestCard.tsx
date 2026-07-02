"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, ChevronRight, Sparkles } from "lucide-react";
import type { Quest } from "@/lib/types";
import { QuestIcon } from "./QuestIcon";

interface QuestCardProps {
  quest: Quest;
  completed: boolean;
  onClick: () => void;
}

export default function QuestCard({ quest, completed, onClick }: QuestCardProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`skillquest-checks-${quest.id}`);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [quest.id]);

  const doneCount = Object.values(checked).filter(Boolean).length;
  const displayProgress = completed ? 100 : Math.max(quest.progress, Math.round((doneCount / quest.requirements.length) * 100));

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-6 text-left shadow-xl shadow-slate-200/50 transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-800/80 dark:shadow-slate-950/30 dark:hover:border-sky-600"
    >
      {completed && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
          <Sparkles className="h-3 w-3" />
          Complete
        </span>
      )}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
          <QuestIcon name={quest.icon} className="h-7 w-7" />
        </div>
        <div className="flex-1">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">{quest.category}</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{quest.title}</h3>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-sky-500" />
      </div>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>{quest.level} Quest · +{quest.xpReward} XP</span>
          <span>{displayProgress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500"
            style={{ width: `${displayProgress}%` }}
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <BadgeCheck className="h-4 w-4 shrink-0 text-emerald-500" />
          <span>{quest.requirements.length} requirements · Click for details</span>
        </div>
      </div>
    </button>
  );
}
