"use client";

import { useCallback, useMemo, useState } from "react";
import {
  Camera,
  Gift,
  Search,
  Sparkles,
  SunMedium,
  Compass,
  Map,
  User,
  Flame,
  Trophy,
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
  const [activeTab, setActiveTab] = useState<"feed" | "quests" | "profile">("feed");
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Completed">("All");
  const [levelFilter, setLevelFilter] = useState<string>("All Levels");
  const [toast, setToast] = useState<string | null>(null);

  const { profile, updateHeroName, awardXp } = useAuth();
  const userName = profile.name || "Adventurer";
  const completedQuests = profile.completedQuests || [];

  const categories = useMemo(() => ["All", ...new Set(QUESTS.map((q) => q.category))], []);
  const levels = ["All Levels", "Novice", "Adept", "Master"];

  const filteredQuests = useMemo(() => {
    return QUESTS.filter((q) => {
      const isCompleted = completedQuests.includes(q.id);
      const matchStatus = 
        statusFilter === "All" ? true : 
        statusFilter === "Active" ? !isCompleted : 
        isCompleted;
      const matchLevel = levelFilter === "All Levels" || q.level === levelFilter;
      const matchCat = category === "All" || q.category === category;
      const matchSearch =
        !search ||
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        q.category.toLowerCase().includes(search.toLowerCase());
      
      return matchStatus && matchLevel && matchCat && matchSearch;
    });
  }, [search, category, statusFilter, levelFilter, completedQuests]);

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

  const tabs = [
    { id: "feed", label: "Guild Feed", icon: Compass },
    { id: "quests", label: "Quests", icon: Map },
    { id: "profile", label: "Profile", icon: User },
  ] as const;

  return (
    <>
      <UserNameModal onSave={updateHeroName} />

      {/* Instagram-style Fixed Glassmorphic Desktop Sidebar (Visible lg and up) */}
      <aside className="hidden lg:flex fixed left-0 top-[65px] bottom-0 w-64 flex-col justify-between border-r border-white/10 bg-slate-950/80 backdrop-blur-2xl p-6 z-30 shadow-2xl">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-900/40 border border-cyan-500/30 px-3.5 py-1.5 text-xs font-bold text-cyan-300 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 animate-pulse text-cyan-400 shrink-0" />
            <span>Navigation Hub</span>
          </div>

          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 font-bold transition-all duration-200 text-left ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-600/90 to-indigo-600/90 text-white border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.35)] translate-x-1"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span className="text-sm tracking-wide">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Mini Profile Status */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300">
          <p className="font-semibold text-white truncate">{profile.name}</p>
          <p className="text-cyan-400 font-medium mt-0.5">Level {profile.level} Adventurer</p>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-2">
            <span>Completed</span>
            <span className="font-bold text-emerald-400">{completedQuests.length} Quests</span>
          </div>
        </div>
      </aside>

      {/* Instagram-style Fixed Glassmorphic Mobile Bottom Nav (Visible below lg) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden items-center justify-around border-t border-white/10 bg-slate-950/90 backdrop-blur-2xl px-2 py-2.5 shadow-[0_-8px_32px_rgba(0,0,0,0.7)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl px-5 py-2 font-semibold transition-all duration-200 ${
                isActive
                  ? "text-cyan-300 scale-105"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <div className={`p-1.5 rounded-xl ${isActive ? "bg-cyan-900/50 border border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.4)]" : ""}`}>
                <Icon className={`h-5 w-5 ${isActive ? "text-cyan-300" : "text-slate-400"}`} />
              </div>
              <span className="text-[11px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content Wrapper with adaptive padding for Desktop Sidebar (lg:pl-72) and Mobile Bottom Nav (pb-28) */}
      <main className="min-h-screen w-full overflow-x-hidden px-3.5 py-6 pb-28 sm:px-6 md:px-10 lg:pl-72 lg:pr-12 lg:pb-12 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200">
        <section className="mx-auto w-full max-w-6xl min-w-0">
          
          {/* Top Hero Banner (Always renders cleanly above tabs) */}
          <div className="mb-8 space-y-4 w-full min-w-0">
            <div className="inline-flex max-w-full items-center gap-2 sm:gap-3 rounded-full bg-cyan-900/30 border border-cyan-500/20 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-cyan-300 shadow-lg shadow-cyan-900/20 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-pulse shrink-0" />
              <span className="truncate">SkillQuest — Neural Uplink Protocol Active</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 break-words">
              {activeTab === "feed" && "Live Guild Telemetry"}
              {activeTab === "quests" && "Turn every skill into an epic quest."}
              {activeTab === "profile" && "Hero Dossier & Achievements"}
            </h1>
          </div>

          {/* TAB 1: 'feed' Tab -> Shows GuildFeed and LiveChallenge */}
          {activeTab === "feed" && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start w-full min-w-0 animate-in fade-in duration-300">
              <div className="space-y-6 w-full min-w-0">
                <div className="rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-4 sm:p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] w-full min-w-0 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <div className="flex items-center gap-2.5">
                      <Flame className="h-5 w-5 text-cyan-400 animate-pulse" />
                      <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-white">Guild Feed</h2>
                    </div>
                    <span className="text-xs bg-cyan-900/50 border border-cyan-500/30 text-cyan-300 px-2.5 py-1 rounded-full font-semibold">Live Stream</span>
                  </div>
                  <div className="w-full min-w-0">
                    <GuildFeed />
                  </div>
                </div>
              </div>

              <div className="space-y-6 w-full min-w-0">
                <div className="w-full min-w-0">
                  <LiveChallenge />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 'quests' Tab -> Shows Journey Map, Active Journeys (Quest Board), and ProofUpload */}
          {activeTab === "quests" && (
            <div className="space-y-10 w-full min-w-0 animate-in fade-in duration-300">
              {/* Journey Map Box */}
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-5 sm:p-8 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] w-full min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-cyan-400/80">Quest Board</p>
                    <h2 className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold">Journey map</h2>
                  </div>
                  <SunMedium className="h-7 w-7 sm:h-8 sm:w-8 text-fuchsia-400 shrink-0" />
                </div>
                <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-4 w-full min-w-0">
                  <div className="rounded-3xl border border-white/5 bg-white/5 backdrop-blur-md p-4 sm:p-5 shadow-inner w-full min-w-0">
                    <p className="text-sm text-slate-400">Start</p>
                    <div className="mt-4 flex items-center gap-4 rounded-3xl bg-black/40 p-4 border border-white/5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-300 shrink-0">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white truncate">Intro adventure</p>
                        <p className="text-xs sm:text-sm text-slate-400">Pick a quest below and open it for details.</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-md p-4 sm:p-6 shadow-inner w-full min-w-0">
                    <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400">
                      <span>{completedQuests.length} completed</span>
                      <span>{QUESTS.length - completedQuests.length} remaining</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 w-full min-w-0">
                      {QUESTS.slice(0, 3).map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => setSelectedQuest(q)}
                          className="rounded-3xl bg-black/40 border border-white/5 p-4 text-left transition hover:bg-white/10 w-full min-w-0"
                        >
                          <p className="text-xs sm:text-sm text-cyan-400/80 truncate">{q.category}</p>
                          <p className="mt-2 font-semibold text-white text-sm sm:text-base line-clamp-2">{q.title}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Active Journeys (Quest Board) Box */}
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-5 sm:p-8 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] w-full min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Gift className="h-7 w-7 sm:h-8 sm:w-8 text-fuchsia-400 shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-cyan-400/80">Questlines</p>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white">Active journeys</h2>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 w-full mt-4 sm:mt-0">
                    {/* Status & Level Filter Row */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-black/20 p-2 sm:p-2.5 rounded-[1.5rem] border border-white/5 shadow-inner w-full">
                      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full max-w-full">
                        {["All", "Active", "Completed"].map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setStatusFilter(status as any)}
                            className={`shrink-0 rounded-full px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all ${
                              statusFilter === status
                                ? "bg-white text-slate-900 shadow-md transform scale-105"
                                : "text-slate-300 hover:bg-white/10"
                            }`}
                          >
                            {status === "Active" ? "🚀 To Do" : status === "Completed" ? "✨ Done" : "All Quests"}
                          </button>
                        ))}
                        <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block"></div>
                        {levels.map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setLevelFilter(lvl)}
                            className={`shrink-0 rounded-full px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all ${
                              levelFilter === lvl
                                ? "bg-slate-700 text-white border border-slate-500 shadow-sm transform scale-105"
                                : "text-slate-400 border border-transparent hover:bg-white/10"
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Search & Category Filter Row */}
                    <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-3 w-full">
                      <div className="relative w-full xl:w-64 shrink-0">
                        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="search"
                          placeholder="Search quests..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="w-full rounded-full border border-white/10 bg-black/40 py-2 sm:py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 shadow-inner"
                        />
                        {search && (
                          <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 bg-white/10 rounded-full">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none w-full max-w-full">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`shrink-0 rounded-full px-3.5 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition ${
                              category === cat
                                ? "bg-cyan-600/90 text-white border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                                : "bg-slate-800/60 border border-white/5 text-slate-300 hover:bg-slate-700"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 w-full min-w-0">
                  {filteredQuests.length === 0 ? (
                    <p className="py-8 text-center text-slate-400 col-span-full">No quests match your search.</p>
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

              {/* Proof of Completion Upload Box */}
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-5 sm:p-8 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] w-full min-w-0 overflow-hidden">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-cyan-400/80">
                      Proof of Completion
                    </p>
                    <h2 className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-white">
                      Upload quest evidence
                    </h2>
                  </div>
                  <Camera className="h-7 w-7 sm:h-8 sm:w-8 text-slate-300 shrink-0" />
                </div>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-300/80 font-light">
                  Submit a screenshot or photo to show your achievement and win the guild&apos;s applause.
                </p>
                <div className="mt-6 w-full min-w-0">
                  <ProofUpload userName={userName} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 'profile' Tab -> Shows CharacterSheet and Achievements */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start w-full min-w-0 animate-in fade-in duration-300">
              <div className="space-y-6 w-full min-w-0">
                <div className="w-full min-w-0">
                  <CharacterSheet />
                </div>
              </div>

              <div className="space-y-6 w-full min-w-0">
                <div className="w-full min-w-0">
                  <Achievements />
                </div>
              </div>
            </div>
          )}
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