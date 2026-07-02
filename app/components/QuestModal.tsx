"use client";

import { useEffect, useState } from "react";
import { X, BadgeCheck, Circle, Trophy, Camera } from "lucide-react";
import type { Quest } from "@/lib/types";
import { QuestIcon } from "./QuestIcon";
import ProofUpload from "./ProofUpload";

interface QuestModalProps {
  quest: Quest | null;
  completed: boolean;
  onClose: () => void;
  onComplete: (questId: string, imageUrl: string) => void;
  userName: string;
}

export default function QuestModal({ quest, completed, onClose, onComplete, userName }: QuestModalProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!quest) return;
    try {
      const raw = localStorage.getItem(`skillquest-checks-${quest.id}`);
      setChecked(raw ? JSON.parse(raw) : {});
    } catch {
      setChecked({});
    }
  }, [quest]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (quest) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [quest, onClose]);

  if (!quest) return null;

  function toggleRequirement(id: string) {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    localStorage.setItem(`skillquest-checks-${quest!.id}`, JSON.stringify(next));
  }

  const allChecked = quest.requirements.every((r) => checked[r.id]);
  const doneCount = quest.requirements.filter((r) => checked[r.id]).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-md p-2 sm:p-4 sm:items-center animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quest-modal-title"
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/10 bg-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.8)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-white/10 bg-slate-900/95 p-5 sm:p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <div className={`flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border ${
              completed ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300" : "bg-cyan-950/60 border-cyan-500/40 text-cyan-300"
            }`}>
              <QuestIcon name={quest.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-cyan-400 truncate">{quest.category}</p>
              <h2 id="quest-modal-title" className="mt-0.5 text-lg sm:text-2xl font-black text-white leading-tight break-words">
                {quest.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/5 border border-white/10 p-2.5 text-slate-400 hover:bg-white/15 hover:text-white transition shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5 sm:p-6">
          <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed font-light">{quest.description}</p>

          <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 shadow-inner">
            <div className="flex items-center gap-3">
              <Trophy className="h-7 w-7 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{quest.level} Quest</p>
                <p className="text-sm sm:text-base font-bold text-amber-300">+{quest.xpReward} XP Reward</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-white">{doneCount}/{quest.requirements.length}</span>
              <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">Steps Done</p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">Action Steps Checklist</h3>
              <span className="text-xs text-slate-400">Tap to complete</span>
            </div>
            <ul className="space-y-2.5">
              {quest.requirements.map((req) => {
                const isDone = checked[req.id];
                return (
                  <li key={req.id}>
                    <button
                      type="button"
                      onClick={() => toggleRequirement(req.id)}
                      className={`flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition-all duration-200 transform active:scale-[0.98] ${
                        isDone
                          ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                          : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/40 text-slate-200"
                      }`}
                    >
                      {isDone ? (
                        <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                      ) : (
                        <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                      )}
                      <div>
                        <p className={`font-semibold text-sm sm:text-base ${isDone ? "text-emerald-300 line-through opacity-90" : "text-white"}`}>
                          {req.label}
                        </p>
                        {req.description && (
                          <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">{req.description}</p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {!completed && (
            <div className="rounded-3xl border border-dashed border-cyan-500/40 bg-cyan-950/20 p-5 sm:p-6 shadow-inner">
              <div className="mb-3 flex items-center gap-2">
                <Camera className="h-5 w-5 text-cyan-400" />
                <h3 className="font-bold text-white text-base">Submit Proof of Completion</h3>
              </div>
              <p className="mb-4 text-xs sm:text-sm text-slate-300/80 leading-relaxed">
                Check off all steps above, then attach a screenshot or image link to claim your XP reward and inspire the guild!
              </p>
              <ProofUpload
                questId={quest.id}
                questTitle={quest.title}
                userName={userName}
                disabled={!allChecked}
                disabledReason="⚠️ Complete all action steps in the checklist above first"
                onSuccess={(url) => onComplete(quest.id, url)}
              />
            </div>
          )}

          {completed && (
            <div className="rounded-3xl border border-emerald-500/40 bg-emerald-950/40 p-6 text-center shadow-[0_0_25px_rgba(16,185,129,0.2)]">
              <BadgeCheck className="mx-auto h-10 w-10 text-emerald-400 animate-bounce" />
              <p className="mt-2 text-lg font-black text-white">Quest Completed! 🎉</p>
              <p className="text-xs sm:text-sm text-emerald-300 mt-1">Your proof is recorded in guild telemetry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
