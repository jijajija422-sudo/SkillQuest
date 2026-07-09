"use client";

import { useEffect, useState } from "react";
import { Trophy, Users, Clock, ShieldAlert } from "lucide-react";

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
    <div className="relative rounded-xl border-4 border-[#4a2e18] bg-wood p-6 shadow-[0_8px_24px_rgba(0,0,0,0.7)] text-[#f4ecd8] overflow-hidden">
      {/* Decorative corner bolts */}
      <div className="absolute top-2.5 left-2.5 h-3 w-3 rounded-full bg-[#8c6239] border border-[#f5d77f]/40 shadow-inner" />
      <div className="absolute top-2.5 right-2.5 h-3 w-3 rounded-full bg-[#8c6239] border border-[#f5d77f]/40 shadow-inner" />
      <div className="absolute bottom-2.5 left-2.5 h-3 w-3 rounded-full bg-[#8c6239] border border-[#f5d77f]/40 shadow-inner" />
      <div className="absolute bottom-2.5 right-2.5 h-3 w-3 rounded-full bg-[#8c6239] border border-[#f5d77f]/40 shadow-inner" />

      <div className="flex items-center justify-between gap-2 border-b border-[#8c6239]/40 pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-[#f5d77f]" />
          <p className="text-xs font-guild font-bold uppercase tracking-wider text-gold-etched">
            Guild Bounty Board
          </p>
        </div>
        <span className="rounded bg-[#a87440]/30 border border-[#d4af37]/40 px-2 py-0.5 text-[10px] font-semibold text-[#f5d77f]">
          Weekly Edict
        </span>
      </div>

      <h2 className="mt-3.5 text-xl font-bold font-guild text-[#fff8ea] tracking-wide drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        Week of Creation
      </h2>

      <p className="mt-2 text-xs sm:text-sm text-[#eddcc4] leading-relaxed">
        Complete any creative quest this week. Top contributors earn the community bounty trophy and bonus prestige.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-lg border border-[#8c6239]/60 bg-[#160d07]/80 p-3.5 shadow-inner">
          <Clock className="h-4 w-4 text-[#d4af37]" />
          <p className="mt-2 text-sm sm:text-base font-guild font-bold text-[#f4ecd8]">
            {remaining !== null ? formatCountdown(remaining) : "Loading..."}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-[#bba78c] mt-0.5 font-semibold">Time Remaining</p>
        </div>

        <div className="rounded-lg border border-[#8c6239]/60 bg-[#160d07]/80 p-3.5 shadow-inner">
          <Users className="h-4 w-4 text-[#d4af37]" />
          <p className="mt-2 text-sm sm:text-base font-guild font-bold text-[#f4ecd8]">
            {participants}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-[#bba78c] mt-0.5 font-semibold">Adventurers</p>
        </div>
      </div>
    </div>
  );
}