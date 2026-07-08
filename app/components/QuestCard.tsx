"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, Sparkles, Play, CheckCircle2, Trophy, ArrowUpRight } from "lucide-react";
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
  const displayProgress = completed ? 100 : Math.round((doneCount / quest.requirements.length) * 100);

  const levelStyles: Record<string, { badge: string; hover: string; bar: string; iconBg: string }> = {
    Novice: {
      badge: "bg-emerald-950/80 border-emerald-500/40 text-emerald-300",
      hover: "hover:border-emerald-400/70 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]",
      bar: "from-emerald-400 to-teal-400",
      iconBg: "bg-emerald-900/40 border-emerald-500/30 text-emerald-300",
    },
    Journeyman: {
      badge: "bg-sky-950/80 border-sky-500/40 text-sky-300",
      hover: "hover:border-sky-400/70 hover:shadow-[0_0_30px_rgba(56,189,248,0.25)]",
      bar: "from-sky-400 to-blue-500",
      iconBg: "bg-sky-900/40 border-sky-500/30 text-sky-300",
    },
    Adventurer: {
      badge: "bg-cyan-950/80 border-cyan-500/40 text-cyan-300",
      hover: "hover:border-cyan-400/70 hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]",
      bar: "from-cyan-400 via-teal-400 to-indigo-500",
      iconBg: "bg-cyan-900/40 border-cyan-500/30 text-cyan-300",
    },
    Epic: {
      badge: "bg-purple-950/80 border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]",
      hover: "hover:border-purple-400/70 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]",
      bar: "from-fuchsia-400 via-purple-500 to-indigo-500",
      iconBg: "bg-purple-900/40 border-purple-500/30 text-purple-300",
    },
    Legendary: {
      badge: "bg-amber-950/80 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
      hover: "hover:border-amber-400/80 hover:shadow-[0_0_35px_rgba(245,158,11,0.35)]",
      bar: "from-amber-300 via-orange-400 to-yellow-500",
      iconBg: "bg-amber-900/40 border-amber-500/40 text-amber-300",
    },
  };

  const style = levelStyles[quest.level] || levelStyles.Adventurer;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col justify-between w-full min-w-0 overflow-hidden rounded-3xl border p-5 sm:p-6 text-left transition-all duration-300 transform active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
        completed
          ? "border-emerald-500/50 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-emerald-950/40 shadow-[0_4px_25px_rgba(16,185,129,0.2)] hover:border-emerald-400"
          : `border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] hover:-translate-y-1.5 ${style.hover} hover:bg-slate-800/90`
      }`}
    >
      {/* Top Header Section */}
      <div>
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className={`flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border transition duration-300 group-hover:scale-110 ${
              completed ? "bg-emerald-900/40 border-emerald-500/50 text-emerald-300" : style.iconBg
            }`}>
              <QuestIcon name={quest.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.25em] text-cyan-400/90 block truncate">
                {quest.category}
              </span>
              <h3 className="mt-0.5 text-lg sm:text-xl font-black text-white line-clamp-1 group-hover:text-cyan-300 transition flex items-center gap-1.5">
                <span>{quest.title}</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-cyan-400 shrink-0" />
              </h3>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] sm:text-xs font-bold tracking-wide uppercase ${style.badge}`}>
              {quest.level}
            </span>
          </div>
        </div>

        <p className="mt-3.5 text-xs sm:text-sm text-slate-300/90 line-clamp-2 leading-relaxed font-normal">
          {quest.description}
        </p>
      </div>

      {/* Progress & Reward Section */}
      <div className="mt-6 pt-4 border-t border-white/10 space-y-3.5 min-w-0">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-1 rounded-full shadow-sm">
            <Sparkles className="h-3.5 w-3.5 fill-amber-400 text-amber-400 animate-pulse" />
            <span>+{quest.xpReward} XP Reward</span>
          </span>
          <span className="text-slate-300 font-bold">{displayProgress}% Complete</span>
        </div>

        <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/60 border border-white/10 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${
              completed ? "from-emerald-400 to-teal-300" : style.bar
            }`}
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        {/* Action Button & Checklist Info */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 truncate">
            <BadgeCheck className={`h-4 w-4 shrink-0 ${completed ? "text-emerald-400" : doneCount > 0 ? "text-cyan-400" : "text-slate-500"}`} />
            <span>
              {doneCount > 0 && !completed ? (
                <strong className="text-cyan-300">{doneCount}/{quest.requirements.length} Steps</strong>
              ) : (
                `${quest.requirements.length} Action Steps`
              )}
            </span>
          </div>

          {completed ? (
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-900/50 border border-emerald-500/50 px-3.5 py-1.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Verified ✨</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 group-hover:from-cyan-500 group-hover:to-indigo-500 border border-cyan-400/50 px-3.5 py-1.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition duration-200">
              <span>{doneCount > 0 ? "Resume Quest" : "Launch Quest"}</span>
              <Play className="h-3 w-3 fill-white transition transform group-hover:translate-x-0.5" />
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
