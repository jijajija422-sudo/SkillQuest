"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle2, Circle, Trophy, Camera, MessageSquare } from "lucide-react";
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

  const badgeAsset = (quest.level === "Masterclass" || quest.level === "Legendary") ? "badge-legendary.svg" :
                     (quest.level === "Advanced" || quest.level === "Epic") ? "badge-platinum.svg" :
                     (quest.level === "Foundational" || quest.level === "Novice") ? "badge-bronze.svg" :
                     quest.level === "Adventurer" ? "badge-gold.svg" :
                     quest.level === "Journeyman" ? "badge-silver.svg" :
                     "badge-bronze.svg";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-2 sm:p-4 sm:items-center transition backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quest-modal-title"
    >
      <div
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-slate-200/80 bg-[#f0f4f8] shadow-neu-raised-lg text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-slate-200/80 bg-[#f0f4f8]/95 backdrop-blur-md p-5 sm:p-6 shadow-neu-raised-sm">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition shadow-neu-inset-sm ${
              completed ? "bg-slate-200 text-slate-600" : "bg-[#e6ecf2] text-teal-600"
            }`}>
              <QuestIcon name={quest.icon} className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 truncate">{quest.category}</span>
                <span className="inline-flex items-center gap-1 rounded-lg border border-slate-200/80 bg-[#e6ecf2] px-2 py-0.5 text-[10px] font-bold text-slate-700 shadow-neu-inset-sm">
                  <img src={`/assets/${badgeAsset}`} alt={quest.level} className="h-3.5 w-3.5 object-contain" />
                  {quest.level}
                </span>
              </div>
              <h2 id="quest-modal-title" className="mt-1 text-lg sm:text-xl font-bold text-slate-800 leading-tight break-words">
                {quest.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200/80 p-2 text-slate-500 hover:text-red-600 transition shrink-0 shadow-neu-raised-sm"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-5 sm:p-6">
          <p className="text-sm text-slate-700 leading-relaxed">{quest.description}</p>

          {/* Reward & Progress Box */}
          <div className="rounded-2xl border border-slate-200/80 bg-[#e6ecf2] p-4 sm:p-5 space-y-3 shadow-neu-inset-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#f0f4f8] border border-slate-200/80 shrink-0 shadow-neu-raised-sm">
                  <Trophy className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-teal-600">Skill Reward</p>
                  <p className="text-sm font-bold text-slate-800">+{quest.xpReward} Progress Steps &middot; {quest.level} Badge</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-slate-800">{doneCount}/{quest.requirements.length}</span>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Steps</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Exploration Progress</span>
                <span className={allChecked ? "text-teal-600" : ""}>{progressPercent}% Complete</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#f0f4f8] shadow-neu-inset-sm">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${completed || allChecked ? "bg-slate-500" : "bg-gradient-to-r from-teal-500 to-blue-500"}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-200/80 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-600">Exploration Steps</h3>
              <span className="text-xs font-semibold text-slate-500">Check each step upon completion</span>
            </div>
            <ul className="space-y-2.5">
              {quest.requirements.map((req) => {
                const isDone = checked[req.id];
                return (
                  <li key={req.id}>
                    <button
                      type="button"
                      onClick={() => toggleRequirement(req.id)}
                      className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition shadow-neu-raised-sm ${
                        isDone
                          ? "border-slate-300/80 bg-[#e6ecf2] text-slate-500 shadow-neu-inset-sm"
                          : "border-slate-200/80 bg-[#f0f4f8] hover:bg-[#e6ecf2] text-slate-800"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" />
                      ) : (
                        <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
                      )}
                      <div>
                        <p className={`font-bold text-sm ${isDone ? "line-through text-slate-400" : "text-slate-800"}`}>
                          {req.label}
                        </p>
                        {req.description && (
                          <p className="mt-1 text-xs text-slate-500 leading-relaxed">{req.description}</p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Proof Upload / Reflection Section */}
          {!completed && (
            <div className={`rounded-2xl border p-5 sm:p-6 transition shadow-neu-inset-sm ${
              allChecked ? "border-teal-500 bg-teal-50/40" : "border-dashed border-slate-300 bg-[#e6ecf2]/60"
            }`}>
              <div className="mb-3 flex items-center gap-2">
                <Camera className="h-4 w-4 text-teal-600" />
                <h3 className="font-bold text-slate-800 text-sm">
                  {allChecked ? "All steps completed — submit verification to earn progress steps" : "Submit project verification"}
                </h3>
              </div>
              <p className="mb-4 text-xs text-slate-500 leading-relaxed">
                {allChecked
                  ? "Share your key learnings and upload visual verification of your project work."
                  : "Complete all checklist steps above, then submit your project verification to earn progress steps."}
              </p>

              <div className="mb-5 space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <MessageSquare className="h-3.5 w-3.5 text-teal-600" />
                  <span>Key Learnings &amp; Notes <span className="text-slate-400 font-normal">(optional activity note)</span></span>
                </label>
                <textarea
                  rows={3}
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  maxLength={400}
                  placeholder="Describe what you built and what skills you learned..."
                  className="w-full resize-none rounded-xl border border-slate-200/80 bg-[#f0f4f8] p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition leading-relaxed shadow-neu-inset-sm"
                />
                <p className="text-right text-[11px] text-slate-400">{reflection.length}/400</p>
              </div>

              <ProofUpload
                questId={quest.id}
                questTitle={quest.title}
                userName={userName}
                disabled={!allChecked}
                disabledReason="Complete all checklist steps above first"
                externalCaption={reflection}
                onSuccess={(url) => onComplete(quest.id, url)}
              />
            </div>
          )}

          {completed && (
            <div className="rounded-2xl border border-slate-200/80 bg-[#e6ecf2] p-6 text-center shadow-neu-inset-sm">
              <CheckCircle2 className="mx-auto h-10 w-10 text-teal-600" />
              <p className="mt-2 text-lg font-bold text-slate-800">Exploration Verified &amp; Completed</p>
              <p className="text-sm text-slate-500 mt-1">
                Your project verification has been shared to the Recent Activity feed.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

