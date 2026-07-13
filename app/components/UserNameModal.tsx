"use client";

import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
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
    if (!stored || stored === "Adventurer" || stored === "Member") {
      setOpen(true);
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim() || "Member";
    await updateHeroName(trimmed);
    onSave(trimmed);
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 transition backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-6 shadow-neu-raised-lg text-slate-800">
        <div className="flex items-center gap-3 border-b border-slate-200/80 pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-[#e6ecf2] text-teal-600 shadow-neu-inset-sm">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-tight">Welcome to SkillHub</h2>
            <p className="text-xs font-bold uppercase tracking-wider text-teal-600">Member Profile Setup</p>
          </div>
        </div>
        <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          Enter your preferred display name. This title will appear on your profile and on project verifications shared to the activity feed.
        </p>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your display name or title"
            className="w-full rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition font-semibold shadow-neu-inset-sm"
            autoFocus
            maxLength={24}
          />
          <button
            type="submit"
            className="w-full rounded-xl btn-bronze py-3 text-sm font-semibold shadow-neu-raised transition hover:scale-[1.01]"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}

