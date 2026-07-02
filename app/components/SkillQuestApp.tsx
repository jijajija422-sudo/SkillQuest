"use client";

import { useCallback, useMemo, useState } from "react";
import {
  ArrowRight,
  Camera,
  Gift,
  Search,
  Sparkles,
  SunMedium,
} from "lucide-react";
import { QUESTS } from "@/lib/quests";
import { useAuth } from "@/lib/auth-context";
import QuestCard from "./QuestCard";
import QuestModal from "./QuestModal";
import GuildFeed from "./GuildFeed";
import CharacterSheet from "./CharacterSheet";
import ProofUpload from "./ProofUpload";
import LiveChallenge from "./LiveChallenge";
import Achievements from "./Achievements";
import Toast from "./Toast";
import UserNameModal from "./UserNameModal";
import type { Quest } from "@/lib/types";

export default function SkillQuestApp() {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [toast, setToast] = useState<string | null>(null);

  const { profile, updateHeroName, awardXp } = useAuth();
  const userName = profile.name || "Adventurer";
  const completedQuests = profile.completedQuests || [];

  const categories = useMemo(() => ["All", ...new Set(QUESTS.map((q) => q.category))], []);

  const filteredQuests = useMemo(() => {
    return QUESTS.filter((q) => {
      const matchCat = category === "All" || q.category === category;
      const matchSearch =
        !search ||
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [search, category]);

  const handleComplete = useCallback(
    async (questId: string, _imageUrl: string) => {
      const quest = QUESTS.find((q) => q.id === questId);
      if (!quest || completedQuests.includes(questId)) return;

      await awardXp(quest.xpReward, questId);
      setToast(`Quest complete! +${quest.xpReward} XP earned. Shared with the guild.`);
      setSelectedQuest(null);
    },
    [completedQuests, awardXp]
  );

  return (
    <>
      <UserNameModal onSave={updateHeroName} />

      {/* 🌌 UPDATE 1: Deep Sci-Fi Background Gradient */}
      <main className="min-h-screen px-6 py-10 sm:px-10 lg:px-16 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200">
        <section className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 rounded-full bg-cyan-900/30 border border-cyan-500/20 px-4 py-2 text-sm font-semibold text-cyan-300 shadow-lg shadow-cyan-900/20 backdrop-blur-md">
                <Sparkles className="h-4 w-4 animate-pulse" />
                SkillQuest — Initializing learning protocol
              </div>
              <div className="max-w-2xl space-y-6">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400/80">
                    Neural Uplink Active
                  </p>
                  {/* 🌌 UPDATE 2: Fixed Dark Mode Text Clashing */}
                  <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 sm:text-6xl">
                    Turn every skill into an epic quest.
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-slate-300/80 font-light">
                    Discover more active journeys, engage the core protocol, and complete quests with live guild telemetry.
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <CharacterSheet />
                  {/* 🌌 UPDATE 3: Glassmorphic Guild Feed Wrapper */}
                  <div className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Guild Feed</p>
                    <div className="mt-4">
                      <GuildFeed compact />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* 🌌 UPDATE 4: Glassmorphic Journey Map */}
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">Quest Board</p>
                    <h2 className="mt-2 text-3xl font-bold">Journey map</h2>
                  </div>
                  <SunMedium className="h-8 w-8 text-fuchsia-400" />
                </div>
                <div className="mt-10 grid gap-4">
                  <div className="rounded-3xl border border-white/5 bg-white/5 backdrop-blur-md p-5 shadow-inner">
                    <p className="text-sm text-slate-400">Start</p>
                    <div className="mt-4 flex items-center gap-4 rounded-3xl bg-black/40 p-4 border border-white/5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Intro adventure</p>
                        <p className="text-sm text-slate-400">Pick a quest below and open it for details.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-md p-6 shadow-inner">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>{completedQuests.length} completed</span>
                      <span>{QUESTS.length - completedQuests.length} remaining</span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {QUESTS.slice(0, 3).map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setSelectedQuest(q)}
                          className="rounded-3xl bg-black/40 border border-white/5 p-4 text-left transition hover:bg-white/10"
                        >
                          <p className="text-sm text-cyan-400/80">{q.category}</p>
                          <p className="mt-2 font-semibold text-white">{q.title}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 🌌 UPDATE 5: Glassmorphic Proof of Completion */}
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">
                      Proof of Completion
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-white">
                      Upload quest evidence
                    </h2>
                  </div>
                  <Camera className="h-8 w-8 text-slate-300" />
                </div>
                <p className="mt-4 text-slate-300/80 font-light">
                  Submit a screenshot or photo to show your achievement and win the guild&apos;s applause.
                </p>
                <div className="mt-6">
                  <ProofUpload userName={userName} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-8 xl:grid-cols-[0.7fr_0.3fr]">
            <div className="space-y-8">
              {/* 🌌 UPDATE 6: Glassmorphic Questlines Box */}
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Gift className="h-8 w-8 text-fuchsia-400" />
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">Questlines</p>
                      <h2 className="text-3xl font-bold text-white">Active journeys</h2>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="search"
                        placeholder="Search quests…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded-full border border-white/10 bg-black/40 py-2 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                      />
                    </div>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                          category === cat
                            ? "bg-cyan-600/80 text-white border border-cyan-400/50"
                            : "bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 grid gap-6">
                  {filteredQuests.length === 0 ? (
                    <p className="py-8 text-center text-slate-400">No quests match your search.</p>
                  ) : (
                    filteredQuests.map((quest) => (
                      <QuestCard
                        key={quest.id}
                        quest={quest}
                        completed={completedQuests.includes(quest.id)}
                        onClick={() => setSelectedQuest(quest)}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              {/* 🌌 UPDATE 7: Side Highlights Wrapper */}
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">Guild Highlights</p>
                <div className="mt-6">
                  <GuildFeed />
                </div>
              </div>
              
              {/* 🌌 UPDATE 8: Glassmorphic Quest Highlights */}
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-8 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
                <p className="text-sm uppercase tracking-[0.3em] text-cyan-400/80">Quest Highlights</p>
                <div className="mt-6 grid gap-4">
                  {QUESTS.slice(0, 4).map((quest) => (
                    <div key={quest.id} className="rounded-3xl border border-white/5 bg-white/5 backdrop-blur-md p-4 shadow-sm">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-white">{quest.title}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400">{quest.category}</p>
                        </div>
                        <span className="rounded-full bg-cyan-900/40 border border-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300">{quest.level}</span>
                      </div>
                      <p className="mt-3 text-sm text-slate-300/80">{quest.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{quest.category}</span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{quest.xpReward} XP</span>
                        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">{quest.requirements.length} steps</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Achievements />
              <LiveChallenge />
            </aside>
          </div>
        </section>
      </main>

      <QuestModal
        quest={selectedQuest}
        completed={selectedQuest ? completedQuests.includes(selectedQuest.id) : false}
        onClose={() => setSelectedQuest(null)}
        onComplete={handleComplete}
        userName={userName}
      />

      <Toast message={toast ?? ""} visible={!!toast} onClose={() => setToast(null)} />
    </>
  );
}