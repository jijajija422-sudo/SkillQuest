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

  const badgeAsset = quest.level === "Legendary" ? "badge-legendary.svg" :
                     quest.level === "Epic" ? "badge-platinum.svg" :
                     quest.level === "Adventurer" ? "badge-gold.svg" :
                     quest.level === "Journeyman" ? "badge-silver.svg" :
                     "badge-bronze.svg";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col justify-between w-full min-w-0 overflow-hidden rounded-xl border-2 p-5 sm:p-6 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8c6239] shadow-md ${
        completed
          ? "border-[#8c6239]/60 bg-[#ebdcc0] opacity-90"
          : "border-[#8c6239] bg-parchment hover:border-[#4a2e18] hover:shadow-[0_8px_20px_rgba(0,0,0,0.6)] hover:-translate-y-0.5"
      }`}
    >
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 transition shadow-inner ${
              completed ? "bg-[#d8caa8] border-[#8c6239] text-[#5c3a1a]" : "bg-[#fff8ea] border-[#8c6239] text-[#4a2e18]"
            }`}>
              <QuestIcon name={quest.icon} className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-guild font-bold uppercase tracking-wider text-[#8c6239] block truncate">
                {quest.category}
              </span>
              <h3 className="mt-0.5 text-base sm:text-lg font-bold font-guild text-[#2b2118] line-clamp-1 group-hover:text-[#8c6239] transition flex items-center gap-1.5">
                <span>{quest.title}</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition text-[#8c6239] shrink-0" />
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 bg-[#fff8ea] border border-[#8c6239] rounded-lg pl-1 pr-2.5 py-1 shadow-sm">
            <img src={`/assets/${badgeAsset}`} alt={quest.level} className="h-6 w-6 object-contain drop-shadow-sm" />
            <span className="text-xs font-guild font-bold text-[#5c3a1a]">
              {quest.level}
            </span>
          </div>
        </div>

        <p className="mt-3 text-xs sm:text-sm text-[#5c3a1a] line-clamp-2 leading-relaxed">
          {quest.description}
        </p>
      </div>

      {/* Progress & Reward */}
      <div className="mt-5 pt-4 border-t border-[#d8caa8] space-y-3 min-w-0">
        <div className="flex items-center justify-between text-xs font-guild font-bold">
          <span className="text-[#8c6239] bg-[#fff8ea] border border-[#c1b087] px-2 py-0.5 rounded">
            +{quest.xpReward} Prestige XP
          </span>
          <span className="text-[#4a2e18]">{displayProgress}% Mastered</span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full border border-[#8c6239] bg-[#d8caa8]/60 shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              completed ? "bg-[#5c3a1a]" : "bg-gradient-to-r from-[#235338] via-[#1b432d] to-[#10b981]"
            }`}
            style={{ width: `${displayProgress}%` }}
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-xs font-semibold text-[#6e5338]">
            {doneCount > 0 && !completed ? (
              <>{doneCount}/{quest.requirements.length} scrolls sealed</>
            ) : (
              <>{quest.requirements.length} quest requirements</>
            )}
          </p>

          {completed ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-guild font-bold text-[#fff8ea] bg-[#4a2e18] border border-[#8c6239] px-3 py-1.5 rounded-lg shadow-sm">
              <CheckCircle2 className="h-3.5 w-3.5 text-[#f5d77f]" />
              <span>Deed Sealed</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-xs font-guild font-bold btn-bronze px-3.5 py-1.5 rounded-lg shadow-sm">
              <span>{doneCount > 0 ? "Resume Deed" : "Inscribe Deed"}</span>
              <Play className="h-3 w-3 fill-[#fff8ea]" />
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
