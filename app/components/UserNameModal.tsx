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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 transition">
      <div className="w-full max-w-sm rounded-2xl border-4 border-[#4a2e18] bg-parchment p-6 shadow-[0_16px_40px_rgba(0,0,0,0.85)] text-[#2b2118]">
        <div className="flex items-center gap-3 border-b-2 border-[#8c6239] pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-[#8c6239] bg-[#fff8ea] text-[#4a2e18] shadow-inner">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-guild text-[#2b2118] leading-tight">Inscribe Your Hero Title</h2>
            <p className="text-xs font-guild font-bold uppercase tracking-wider text-gold-stamped">Guild Registry Entry</p>
          </div>
        </div>
        <p className="mt-4 text-xs sm:text-sm text-[#5c3a1a] leading-relaxed font-serif">
          Inscribe your chosen name or title into the Guild Registry. This moniker will be etched into the Chronicle when you seal quest deeds.
        </p>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your hero title or moniker"
            className="w-full rounded-lg border-2 border-[#8c6239] bg-[#fff8ea] px-4 py-3 text-sm text-[#2b2118] placeholder:text-[#9e886d] focus:outline-none focus:ring-2 focus:ring-[#4a2e18] transition font-guild font-bold shadow-inner"
            autoFocus
            maxLength={24}
          />
          <button
            type="submit"
            className="w-full rounded-lg btn-bronze py-3 text-sm font-guild font-bold shadow-md transition"
          >
            Begin Adventurer Journey
          </button>
        </form>
      </div>
    </div>
  );
}
