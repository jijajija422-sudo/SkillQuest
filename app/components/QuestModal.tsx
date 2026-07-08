"use client";

import { useEffect, useState } from "react";
import { X, BadgeCheck, Circle, Trophy, Camera, Sparkles, CheckCircle2, MessageSquare } from "lucide-react";
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
  const [reflection, setReflection] = useState("");

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
  const progressPercent = Math.round((doneCount / quest.requirements.length) * 100);

  const levelStyles: Record<string, { badge: string; iconBg: string; border: string }> = {
    Novice: {
      badge: "bg-emerald-950/80 border-emerald-500/40 text-emerald-300",
      iconBg: "bg-emerald-900/40 border-emerald-500/40 text-emerald-300",
      border: "border-emerald-500/30",
    },
    Journeyman: {
      badge: "bg-sky-950/80 border-sky-500/40 text-sky-300",
      iconBg: "bg-sky-900/40 border-sky-500/40 text-sky-300",
      border: "border-sky-500/30",
    },
    Adventurer: {
      badge: "bg-cyan-950/80 border-cyan-500/40 text-cyan-300",
      iconBg: "bg-cyan-900/40 border-cyan-500/40 text-cyan-300",
      border: "border-cyan-500/30",
    },
    Epic: {
      badge: "bg-purple-950/80 border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]",
      iconBg: "bg-purple-900/40 border-purple-500/40 text-purple-300",
      border: "border-purple-500/30",
    },
    Legendary: {
      badge: "bg-amber-950/80 border-amber-500/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]",
      iconBg: "bg-amber-900/40 border-amber-500/50 text-amber-300",
      border: "border-amber-500/40",
    },
  };

  const style = levelStyles[quest.level] || levelStyles.Adventurer;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 sm:items-center animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quest-modal-title"
    >
      <div
        className={`max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[2.5rem] sm:rounded-[2.5rem] border ${style.border} bg-slate-950 shadow-[0_0_60px_rgba(0,0,0,0.9)] text-white`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header Banner */}
        <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-white/10 bg-slate-900/95 p-5 sm:p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <div className={`flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl border ${
              completed ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300" : style.iconBg
            }`}>
              <QuestIcon name={quest.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-cyan-400 truncate">{quest.category}</span>
                <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${style.badge}`}>{quest.level}</span>
              </div>
              <h2 id="quest-modal-title" className="mt-1 text-lg sm:text-2xl font-black text-white leading-tight break-words">
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

        {/* Modal Content Body */}
        <div className="space-y-6 p-5 sm:p-6">
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">{quest.description}</p>

          {/* XP & Progress Summary Card */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 shadow-inner space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Reward Bounty</p>
                  <p className="text-base sm:text-lg font-black text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 fill-amber-300" />
                    <span>+{quest.xpReward} XP & {quest.level} Badge</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl sm:text-2xl font-black text-white">{doneCount}/{quest.requirements.length}</span>
                <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider font-semibold">Steps Done</p>
              </div>
            </div>

            {/* Live Progress Bar inside Modal */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>Checklist Progress</span>
                <span className={allChecked ? "text-emerald-400 font-bold" : "text-cyan-300"}>{progressPercent}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/60 border border-white/10 p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${
                    completed || allChecked ? "from-emerald-400 to-teal-300" : "from-cyan-400 via-indigo-500 to-purple-500"
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-cyan-400">Action Steps Checklist</h3>
              <span className="text-xs text-slate-400 font-medium">Tap each item when finished</span>
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
                          ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                          : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-cyan-500/40 text-slate-200"
                      }`}
                    >
                      {isDone ? (
                        <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)] transition-transform scale-110" />
                      ) : (
                        <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                      )}
                      <div>
                        <p className={`font-bold text-sm sm:text-base ${isDone ? "text-emerald-300 line-through opacity-90" : "text-white"}`}>
                          {req.label}
                        </p>
                        {req.description && (
                          <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">{req.description}</p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Completion Status or Proof Upload */}
          {!completed && (
            <div className={`rounded-3xl border p-5 sm:p-6 shadow-inner transition duration-300 ${
              allChecked
                ? "border-emerald-500/60 bg-emerald-950/30 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
                : "border-dashed border-cyan-500/40 bg-cyan-950/20"
            }`}>
              <div className="mb-3 flex items-center gap-2.5">
                <Camera className={`h-5 w-5 ${allChecked ? "text-emerald-400 animate-bounce" : "text-cyan-400"}`} />
                <h3 className="font-bold text-white text-base">
                  {allChecked ? "✨ All Steps Complete! Share Your Story Below:" : "Submit Proof of Completion"}
                </h3>
              </div>
              <p className="mb-4 text-xs sm:text-sm text-slate-300/90 leading-relaxed font-normal">
                {allChecked
                  ? "Amazing work! Write how you felt about completing this quest, then upload your proof image to claim your XP and inspire the guild."
                  : "Complete all action steps above, then write a short reflection and upload your proof image to claim your XP reward!"}
              </p>

              {/* Reflection textarea — always visible so user can draft while completing steps */}
              <div className="mb-5 space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Your reflection <span className="text-slate-500 normal-case font-normal tracking-normal">(optional — share how it felt!)</span></span>
                </label>
                <textarea
                  rows={3}
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  maxLength={400}
                  placeholder="How did completing this quest make you feel? What was the hardest part? What did you learn? The guild wants to hear your story!"
                  className="w-full resize-none rounded-2xl border border-white/15 bg-black/40 p-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition leading-relaxed"
                />
                <p className="text-right text-[11px] text-slate-500">{reflection.length}/400</p>
              </div>

              <ProofUpload
                questId={quest.id}
                questTitle={quest.title}
                userName={userName}
                disabled={!allChecked}
                disabledReason="Complete all action steps in the checklist above first"
                externalCaption={reflection}
                onSuccess={(url) => onComplete(quest.id, url)}
              />
            </div>
          )}

          {completed && (
            <div className="rounded-3xl border border-emerald-500/50 bg-emerald-950/50 p-6 text-center shadow-[0_0_35px_rgba(16,185,129,0.25)]">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400 animate-bounce" />
              <p className="mt-2 text-xl font-black text-white">Quest Completed! 🎉</p>
              <p className="text-xs sm:text-sm text-emerald-300 mt-1 font-semibold">
                Your proof is permanently recorded in guild telemetry.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
