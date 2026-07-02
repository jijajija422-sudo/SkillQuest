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
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="quest-modal-title"
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-slate-100 bg-white/95 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
              <QuestIcon name={quest.icon} className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{quest.category}</p>
              <h2 id="quest-modal-title" className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                {quest.title}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <p className="text-slate-600 dark:text-slate-300">{quest.description}</p>

          <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/50">
            <Trophy className="h-8 w-8 text-amber-500" />
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{quest.level} Quest</p>
              <p className="font-semibold text-slate-900 dark:text-white">+{quest.xpReward} XP reward</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm text-slate-500">{doneCount}/{quest.requirements.length}</p>
              <p className="text-xs text-slate-400">requirements</p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">Requirements</h3>
            <ul className="space-y-2">
              {quest.requirements.map((req) => {
                const isDone = checked[req.id];
                return (
                  <li key={req.id}>
                    <button
                      type="button"
                      onClick={() => toggleRequirement(req.id)}
                      className={`flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                        isDone
                          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                          : "border-slate-200 bg-white hover:border-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-sky-700"
                      }`}
                    >
                      {isDone ? (
                        <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      ) : (
                        <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />
                      )}
                      <div>
                        <p className={`font-medium ${isDone ? "text-emerald-800 dark:text-emerald-300" : "text-slate-900 dark:text-white"}`}>
                          {req.label}
                        </p>
                        {req.description && (
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{req.description}</p>
                        )}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {!completed && (
            <div className="rounded-2xl border border-dashed border-sky-300 bg-sky-50/50 p-5 dark:border-sky-700 dark:bg-sky-950/30">
              <div className="mb-3 flex items-center gap-2">
                <Camera className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Proof of Completion</h3>
              </div>
              <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                Upload a screenshot or photo to complete this quest and share it with the guild.
              </p>
              <ProofUpload
                questId={quest.id}
                questTitle={quest.title}
                userName={userName}
                disabled={!allChecked}
                disabledReason="Complete all requirements above first"
                onSuccess={(url) => onComplete(quest.id, url)}
              />
            </div>
          )}

          {completed && (
            <div className="rounded-2xl bg-emerald-50 p-4 text-center dark:bg-emerald-900/20">
              <BadgeCheck className="mx-auto h-8 w-8 text-emerald-500" />
              <p className="mt-2 font-semibold text-emerald-800 dark:text-emerald-300">Quest completed!</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Your proof is live in the guild feed.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
