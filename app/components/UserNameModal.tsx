"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface UserNameModalProps {
  onSave: (name: string) => void;
}

export default function UserNameModal({ onSave }: UserNameModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { updateHeroName } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem("skillquest-user-name");
    if (!stored || stored === "Adventurer") {
      setOpen(true);
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim() || "Adventurer";
    await updateHeroName(trimmed);
    onSave(trimmed);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
          <Sparkles className="h-5 w-5" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Welcome, adventurer!</h2>
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Choose a guild name to appear on the feed when you complete quests.
        </p>
        <form onSubmit={submit} className="mt-4 space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your hero name"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            autoFocus
            maxLength={24}
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white hover:bg-slate-800 dark:bg-sky-600 dark:hover:bg-sky-700"
          >
            Begin quest
          </button>
        </form>
      </div>
    </div>
  );
}
