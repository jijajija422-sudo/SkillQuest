"use client";

import { useEffect, useState } from "react";
import { Sparkles, Trophy, Users } from "lucide-react";

const CHALLENGE_END = Date.now() + 7 * 24 * 60 * 60 * 1000;

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Offline";
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
    <div className="rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
      {/* Glow Header Tag */}
      <div className="flex items-center gap-2 text-cyan-400">
        <Sparkles className="h-4 w-4 animate-pulse" />
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-400/80">
          Live Core Protocol
        </p>
      </div>

      {/* Main Title with subtle gradient */}
      <h2 className="mt-4 text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
        Week of Creation
      </h2>
      
      {/* Soft light description */}
      <p className="mt-3 text-sm leading-6 text-slate-300/80 font-light">
        Complete any creative quest this week with your guild. Top contributors earn the Nexus Trophy insignia.
      </p>

      {/* Glass Inner Metric Grid */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        {/* Time Remaining Card */}
        <div className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md p-4 shadow-sm">
          <Trophy className="h-5 w-5 text-fuchsia-400" />
          <p className="mt-2 font-mono text-lg font-bold tracking-wide text-cyan-300">
            {remaining !== null ? formatCountdown(remaining) : "Syncing..."}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mt-1">Time Remaining</p>
        </div>

        {/* Nodes Connected Card */}
        <div className="rounded-2xl border border-white/5 bg-white/5 backdrop-blur-md p-4 shadow-sm">
          <Users className="h-5 w-5 text-cyan-400" />
          <p className="mt-2 text-lg font-bold text-white">
            {participants}
          </p>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium mt-1">Nodes Active</p>
        </div>
      </div>
    </div>
  );
}