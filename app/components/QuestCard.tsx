"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ArrowUpRight, Play } from "lucide-react";
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

  const badgeAsset = (quest.level === "Masterclass" || quest.level === "Legendary") ? "badge-legendary.svg" :
                     (quest.level === "Advanced" || quest.level === "Epic") ? "badge-platinum.svg" :
                     (quest.level === "Foundational" || quest.level === "Novice") ? "badge-bronze.svg" :
                     quest.level === "Adventurer" ? "badge-gold.svg" :
                     quest.level === "Journeyman" ? "badge-silver.svg" :
                     "badge-bronze.svg";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col justify-between w-full min-w-0 overflow-hidden rounded-2xl p-5 sm:p-6 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 ${
        completed
          ? "bg-[#e6ecf2] border border-slate-300/80 shadow-neu-inset-sm opacity-90"
          : "bg-[#f0f4f8] border border-slate-200/80 shadow-neu-raised hover:shadow-neu-raised-lg hover:-translate-y-1"
      }`}
    >
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition shadow-neu-inset-sm ${
              completed ? "bg-slate-200 text-slate-600" : "bg-[#e6ecf2] text-teal-600"
            }`}>
              <QuestIcon name={quest.icon} className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-teal-600 block truncate">
                {quest.category}
              </span>
              <h3 className="mt-0.5 text-base sm:text-lg font-bold text-slate-800 line-clamp-1 group-hover:text-teal-600 transition flex items-center gap-1.5">
                <span>{quest.title}</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition text-teal-600 shrink-0" />
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 bg-[#e6ecf2] border border-slate-200/80 rounded-xl pl-1.5 pr-3 py-1 shadow-neu-inset-sm">
            <img src={`/assets/${badgeAsset}`} alt={quest.level} className="h-6 w-6 object-contain drop-shadow-sm" />
            <span className="text-xs font-bold text-slate-700">
              {quest.level}
            </span>
          </div>
        </div>

        <p className="mt-3 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {quest.description}
        </p>
      </div>

      {/* Progress & Reward */}
      <div className="mt-5 pt-4 border-t border-slate-200/80 space-y-3 min-w-0">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-teal-700 bg-[#e6ecf2] border border-slate-200/80 px-2.5 py-1 rounded-lg shadow-neu-inset-sm">
            +{quest.xpReward} Progress Steps
          </span>
          <span className="text-slate-700">{displayProgress}% Complete</span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-[#e6ecf2] shadow-neu-inset-sm">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              completed ? "bg-slate-500" : "bg-gradient-to-r from-teal-500 to-blue-500"
            }`}
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-xs font-semibold text-slate-500">
            {doneCount > 0 && !completed ? (
              <>{doneCount}/{quest.requirements.length} tasks verified</>
            ) : (
              <>{quest.requirements.length} exploration steps</>
            )}
          </p>

          {completed ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-[#e6ecf2] border border-slate-300 px-3 py-1.5 rounded-xl shadow-neu-inset-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" />
              <span>Completed</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold btn-bronze px-3.5 py-1.5 rounded-xl shadow-neu-raised-sm">
              <span>{doneCount > 0 ? "Continue Exploration" : "Start Exploration"}</span>
              <Play className="h-3 w-3 fill-blue-600 text-blue-600" />
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

