"use client";

import { useEffect, useState } from "react";
import { Trophy, Users, Clock } from "lucide-react";

const CHALLENGE_END = Date.now() + 7 * 24 * 60 * 60 * 1000;

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Ended";
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hrs = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  return `${days}d ${hrs}h left`;
}

export default function LiveChallenge() {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [participants] = useState(24);

  useEffect(() => {
    setRemaining(Math.max(0, CHALLENGE_END - Date.now()));

    const id = setInterval(() => {
      setRemaining(Math.max(0, CHALLENGE_END - Date.now()));
    }, 60000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-6 shadow-neu-raised text-slate-800 overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-teal-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Featured Exploration
          </p>
        </div>
        <span className="rounded-lg bg-[#e6ecf2] border border-slate-200/80 px-2.5 py-0.5 text-[10px] font-bold text-teal-700 shadow-neu-inset-sm">
          Weekly Special
        </span>
      </div>

      <h2 className="mt-3.5 text-xl font-bold text-slate-800 tracking-tight">
        Week of Creation
      </h2>

      <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
        Complete any creative skill exploration this week. Top contributors earn the community badge and bonus progress steps.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-xl border border-slate-200/80 bg-[#e6ecf2] p-3.5 shadow-neu-inset-sm">
          <Clock className="h-4 w-4 text-teal-600" />
          <p className="mt-2 text-sm sm:text-base font-bold text-slate-800">
            {remaining !== null ? formatCountdown(remaining) : "Loading..."}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5 font-bold">Time Remaining</p>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-[#e6ecf2] p-3.5 shadow-neu-inset-sm">
          <Users className="h-4 w-4 text-teal-600" />
          <p className="mt-2 text-sm sm:text-base font-bold text-slate-800">
            {participants}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5 font-bold">Active Members</p>
        </div>
      </div>
    </div>
  );
}