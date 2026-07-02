"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, ChevronRight, Sparkles, Play, CheckCircle2 } from "lucide-react";
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

  const levelColors: Record<string, string> = {
    Novice: "bg-emerald-950/60 border-emerald-500/40 text-emerald-300",
    Adept: "bg-cyan-950/60 border-cyan-500/40 text-cyan-300",
    Master: "bg-purple-950/60 border-purple-500/40 text-purple-300",
  };
  const badgeClass = levelColors[quest.level] || "bg-cyan-950/60 border-cyan-500/40 text-cyan-300";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col justify-between w-full min-w-0 overflow-hidden rounded-3xl border p-5 sm:p-6 text-left transition-all duration-300 transform active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
        completed
          ? "border-emerald-500/40 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/30 shadow-[0_4px_20px_rgba(16,185,129,0.15)] hover:border-emerald-400"
          : "border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:-translate-y-1 hover:border-cyan-400/60 hover:bg-slate-800/80 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]"
      }`}
    >
      {/* Top Header Section */}
      <div>
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border ${
              completed ? "bg-emerald-900/30 border-emerald-500/40 text-emerald-300" : "bg-cyan-900/30 border-cyan-500/30 text-cyan-300"
            }`}>
              <QuestIcon name={quest.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-cyan-400/90 block truncate">
                {quest.category}
              </span>
              <h3 className="mt-0.5 text-lg sm:text-xl font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition">
                {quest.title}
              </h3>
            </div>
          </div>

          <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] sm:text-xs font-semibold ${badgeClass}`}>
            {quest.level}
          </span>
        </div>

        <p className="mt-3.5 text-xs sm:text-sm text-slate-300/85 line-clamp-2 leading-relaxed">
          {quest.description}
        </p>
      </div>

      {/* Progress & Reward Section */}
      <div className="mt-6 pt-4 border-t border-white/10 space-y-3.5 min-w-0">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="inline-flex items-center gap-1.5 text-amber-300 bg-amber-950/50 border border-amber-500/30 px-2.5 py-1 rounded-full">
            <Sparkles className="h-3.5 w-3.5" />
            +{quest.xpReward} XP Reward
          </span>
          <span className="text-slate-300 font-semibold">{displayProgress}% Complete</span>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/50 border border-white/10">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              completed
                ? "bg-gradient-to-r from-emerald-400 to-teal-300"
                : "bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500"
            }`}
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        {/* Clear Action Button at bottom of card */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
            <BadgeCheck className={`h-4 w-4 shrink-0 ${completed ? "text-emerald-400" : "text-cyan-400"}`} />
            <span className="truncate">{quest.requirements.length} Steps</span>
          </div>

          {completed ? (
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-900/40 border border-emerald-500/40 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Verified ✨</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-cyan-600/80 group-hover:bg-cyan-500 border border-cyan-400/50 px-3.5 py-1.5 rounded-xl shadow-[0_0_12px_rgba(6,182,212,0.3)] transition">
              <span>Launch Quest</span>
              <Play className="h-3 w-3 fill-white" />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
