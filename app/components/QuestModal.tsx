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

  const badgeAsset = quest.level === "Legendary" ? "badge-legendary.svg" :
                     quest.level === "Epic" ? "badge-platinum.svg" :
                     quest.level === "Adventurer" ? "badge-gold.svg" :
                     quest.level === "Journeyman" ? "badge-silver.svg" :
                     "badge-bronze.svg";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-2 sm:p-4 sm:items-center transition"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quest-modal-title"
    >
      <div
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl sm:rounded-2xl border-4 border-[#4a2e18] bg-parchment shadow-[0_16px_40px_rgba(0,0,0,0.85)] text-[#2b2118]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b-2 border-[#8c6239] bg-[#fcf8ed] p-5 sm:p-6 shadow-md">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-2 ${
              completed ? "bg-[#d8caa8] border-[#8c6239] text-[#5c3a1a]" : "bg-[#fff8ea] border-[#8c6239] text-[#4a2e18] shadow-inner"
            }`}>
              <QuestIcon name={quest.icon} className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-guild font-bold uppercase tracking-wider text-[#8c6239] truncate">{quest.category}</span>
                <span className="inline-flex items-center gap-1 rounded border border-[#8c6239] bg-[#ebdcc0] px-2 py-0.5 text-[10px] font-guild font-bold text-[#5c3a1a]">
                  <img src={`/assets/${badgeAsset}`} alt={quest.level} className="h-3.5 w-3.5 object-contain" />
                  {quest.level}
                </span>
              </div>
              <h2 id="quest-modal-title" className="mt-1 text-lg sm:text-xl font-bold font-guild text-[#2b2118] leading-tight break-words">
                {quest.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#8c6239] p-2 text-[#6e5338] hover:bg-[#ebdcc0] hover:text-[#2b2118] transition shrink-0"
            aria-label="Close scroll"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-5 sm:p-6">
          <p className="text-sm text-[#4a2e18] leading-relaxed font-serif">{quest.description}</p>

          {/* Reward & Progress Box */}
          <div className="rounded-xl border-2 border-[#8c6239] bg-[#fff8ea] p-4 sm:p-5 space-y-3 shadow-inner">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#ebdcc0] border border-[#8c6239] shrink-0">
                  <Trophy className="h-5 w-5 text-[#8c6239]" />
                </div>
                <div>
                  <p className="text-xs font-guild font-bold uppercase text-[#8c6239]">Bounty Reward</p>
                  <p className="text-sm font-bold font-guild text-[#4a2e18]">+{quest.xpReward} Prestige XP &middot; {quest.level} Medal</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-guild text-[#4a2e18]">{doneCount}/{quest.requirements.length}</span>
                <p className="text-[10px] text-[#6e5338] font-guild font-bold uppercase">Seals</p>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-guild font-bold text-[#8c6239]">
                <span>Deed Progress</span>
                <span className={allChecked ? "text-[#235338]" : ""}>{progressPercent}% Mastered</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full border border-[#8c6239] bg-[#d8caa8]/60 shadow-inner">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${completed || allChecked ? "bg-[#5c3a1a]" : "bg-gradient-to-r from-[#235338] via-[#1b432d] to-[#10b981]"}`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-[#c1b087] pb-2">
              <h3 className="text-xs font-guild font-bold uppercase tracking-wider text-gold-stamped">Quest Requirements</h3>
              <span className="text-xs font-semibold text-[#6e5338]">Stamp each step upon completion</span>
            </div>
            <ul className="space-y-2.5">
              {quest.requirements.map((req) => {
                const isDone = checked[req.id];
                return (
                  <li key={req.id}>
                    <button
                      type="button"
                      onClick={() => toggleRequirement(req.id)}
                      className={`flex w-full items-start gap-3 rounded-xl border-2 p-4 text-left transition shadow-sm ${
                        isDone
                          ? "border-[#8c6239]/60 bg-[#ebdcc0] text-[#6e5338]"
                          : "border-[#8c6239] bg-[#fff8ea] hover:bg-[#fdfaf3] text-[#2b2118]"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#235338] fill-[#eafee8]" />
                      ) : (
                        <Circle className="mt-0.5 h-5 w-5 shrink-0 text-[#a87440]" />
                      )}
                      <div>
                        <p className={`font-bold font-guild text-sm ${isDone ? "line-through text-[#6e5338]" : "text-[#4a2e18]"}`}>
                          {req.label}
                        </p>
                        {req.description && (
                          <p className="mt-1 text-xs text-[#5c3a1a] leading-relaxed">{req.description}</p>
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
            <div className={`rounded-xl border-2 p-5 sm:p-6 transition shadow-inner ${
              allChecked ? "border-[#235338] bg-[#eafee8]/40" : "border-dashed border-[#8c6239] bg-[#fff8ea]/60"
            }`}>
              <div className="mb-3 flex items-center gap-2">
                <Camera className="h-4 w-4 text-[#8c6239]" />
                <h3 className="font-bold font-guild text-[#4a2e18] text-sm">
                  {allChecked ? "All seals stamped — submit proof to claim bounty" : "Submit visual proof of completion"}
                </h3>
              </div>
              <p className="mb-4 text-xs text-[#6e5338] leading-relaxed">
                {allChecked
                  ? "Pen your reflections on the task and present visual proof of your deed."
                  : "Seal all step requirements above, then present your proof to claim XP."}
              </p>

              <div className="mb-5 space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-guild font-bold text-[#5c3a1a]">
                  <MessageSquare className="h-3.5 w-3.5 text-[#8c6239]" />
                  <span>Adventurer Reflection <span className="text-[#8c6239] font-normal">(optional chronicle entry)</span></span>
                </label>
                <textarea
                  rows={3}
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  maxLength={400}
                  placeholder="Inscribe how mastering this skill elevated your abilities..."
                  className="w-full resize-none rounded-lg border border-[#8c6239] bg-[#fff8ea] p-3 text-sm text-[#2b2118] placeholder:text-[#9e886d] focus:outline-none focus:ring-2 focus:ring-[#4a2e18] transition leading-relaxed"
                />
                <p className="text-right text-[11px] text-[#8c6239]">{reflection.length}/400</p>
              </div>

              <ProofUpload
                questId={quest.id}
                questTitle={quest.title}
                userName={userName}
                disabled={!allChecked}
                disabledReason="Seal all step requirements above first"
                externalCaption={reflection}
                onSuccess={(url) => onComplete(quest.id, url)}
              />
            </div>
          )}

          {completed && (
            <div className="rounded-xl border-2 border-[#8c6239] bg-[#ebdcc0] p-6 text-center shadow-inner">
              <CheckCircle2 className="mx-auto h-10 w-10 text-[#235338] fill-[#eafee8]" />
              <p className="mt-2 text-lg font-bold font-guild text-[#4a2e18]">Deed Officially Sealed</p>
              <p className="text-sm text-[#6e5338] mt-1">
                Your proof is inscribed forever in the Guild Chronicle.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
