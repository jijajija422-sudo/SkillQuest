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
  ArrowUpDown,
  RotateCcw,
  CheckCircle2,
  Play,
  X,
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
  const [sortBy, setSortBy] = useState<"recommended" | "xp-desc" | "level-asc" | "progress-desc">("recommended");
  const [toast, setToast] = useState<string | null>(null);

  const { profile, updateHeroName, awardXp } = useAuth();
  const userName = profile.name || "Adventurer";
  const completedQuests = profile.completedQuests || [];

  const categories = useMemo(() => ["All", ...new Set(QUESTS.map((q) => q.category))], []);
  const levels = ["All Levels", "Novice", "Journeyman", "Adventurer", "Epic", "Legendary"];

  const categoryEmojis: Record<string, string> = {
    All: "✨",
    "Coding & Tech": "💻",
    "Culinary & Baking": "🍳",
    "Arts & Crafts": "🎨",
    "Music & Audio": "🎵",
    "Fitness & Outdoors": "🏃",
    "Mindfulness & Reading": "🧘",
    "Community & Gaming": "🤝",
    "Design & Career": "💼",
  };

  const levelWeights: Record<string, number> = {
    Novice: 1,
    Journeyman: 2,
    Adventurer: 3,
    Epic: 4,
    Legendary: 5,
  };

  const filteredQuests = useMemo(() => {
    const list = QUESTS.filter((q) => {
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
        q.category.toLowerCase().includes(search.toLowerCase()) ||
        q.description.toLowerCase().includes(search.toLowerCase());

      return matchStatus && matchLevel && matchCat && matchSearch;
    });

    return list.sort((a, b) => {
      if (sortBy === "xp-desc") return b.xpReward - a.xpReward;
      if (sortBy === "level-asc") return (levelWeights[a.level] || 1) - (levelWeights[b.level] || 1);
      if (sortBy === "progress-desc") {
        const getProg = (q: Quest) => {
          if (completedQuests.includes(q.id)) return 100;
          try {
            const raw = typeof window !== "undefined" ? localStorage.getItem(`skillquest-checks-${q.id}`) : null;
            if (!raw) return 0;
            const checked = JSON.parse(raw);
            return Math.round((Object.values(checked).filter(Boolean).length / q.requirements.length) * 100);
          } catch {
            return 0;
          }
        };
        return getProg(b) - getProg(a);
      }
      // default: recommended puts active/in-progress first, then high XP
      const aDone = completedQuests.includes(a.id);
      const bDone = completedQuests.includes(b.id);
      if (aDone !== bDone) return aDone ? 1 : -1;
      return b.xpReward - a.xpReward;
    });
  }, [search, category, statusFilter, levelFilter, sortBy, completedQuests]);

  const recommendedNext = useMemo(() => {
    const uncompleted = QUESTS.filter((q) => !completedQuests.includes(q.id));
    return uncompleted.slice(0, 3);
  }, [completedQuests]);

  const totalProgressPercent = Math.round((completedQuests.length / QUESTS.length) * 100);

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

  function resetFilters() {
    setSearch("");
    setCategory("All");
    setStatusFilter("All");
    setLevelFilter("All Levels");
    setSortBy("recommended");
  }

  const tabs = [
    { id: "feed", label: "Guild Feed", icon: Compass },
    { id: "quests", label: "Quests Board", icon: Map },
    { id: "profile", label: "Hero Dossier", icon: User },
  ] as const;

  return (
    <>
      <UserNameModal onSave={updateHeroName} />

      {/* Fixed Glassmorphic Desktop Sidebar (Visible lg and up) */}
      <aside className="hidden lg:flex fixed left-0 top-[65px] bottom-0 w-64 flex-col justify-between border-r border-white/10 bg-slate-950/90 backdrop-blur-2xl p-6 z-30 shadow-2xl">
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
            <span className="font-bold text-emerald-400">{completedQuests.length} of {QUESTS.length} Quests</span>
          </div>
        </div>
      </aside>

      {/* Fixed Glassmorphic Mobile Bottom Nav (Visible below lg) */}
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

      {/* Main Content Wrapper */}
      <main className="min-h-screen w-full overflow-x-hidden px-3.5 py-6 pb-28 sm:px-6 md:px-10 lg:pl-72 lg:pr-12 lg:pb-12 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200">
        <section className="mx-auto w-full max-w-6xl min-w-0">
          
          {/* Top Hero Banner */}
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
              {/* Journey Map & Overview Box */}
              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/50 to-slate-950/80 backdrop-blur-2xl p-6 sm:p-8 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] w-full min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-cyan-400 font-extrabold flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-amber-400" />
                      <span>Quest Board Dossier</span>
                    </p>
                    <h2 className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-black text-white">Journey Map & Mastery</h2>
                  </div>
                  
                  {/* Overall Completion Pill */}
                  <div className="flex items-center gap-4 bg-black/50 border border-white/10 rounded-2xl p-3.5 px-5 shadow-inner">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Overall Mastery</p>
                      <p className="text-lg font-black text-emerald-400">{completedQuests.length} / {QUESTS.length} Quests</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      {totalProgressPercent}%
                    </div>
                  </div>
                </div>

                {/* Overall Progress Bar */}
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>Neural Skill Uplink Progress</span>
                    <span className="text-cyan-300 font-bold">{QUESTS.length - completedQuests.length} Quests Remaining</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-black/60 border border-white/10 p-0.5">
                    <div
                      className="h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                      style={{ width: `${totalProgressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Recommended Next Quests */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-cyan-300 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-fuchsia-400 animate-pulse" />
                      <span>Recommended Next Quests For Your Level</span>
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 w-full min-w-0">
                    {recommendedNext.map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setSelectedQuest(q)}
                        className="group relative rounded-3xl bg-slate-900/60 border border-white/10 p-5 text-left transition duration-300 hover:bg-slate-800/90 hover:border-cyan-400/60 hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] w-full min-w-0 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 truncate">
                              {q.category}
                            </span>
                            <span className="text-[10px] font-bold bg-amber-950/60 border border-amber-500/40 text-amber-300 px-2 py-0.5 rounded-full shrink-0">
                              +{q.xpReward} XP
                            </span>
                          </div>
                          <p className="font-bold text-white text-base group-hover:text-cyan-300 transition line-clamp-1">{q.title}</p>
                          <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">{q.description}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                          <span>{q.level} Quest</span>
                          <span className="flex items-center gap-1">Launch <Play className="h-3 w-3 fill-current" /></span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Journeys (Quest Board) Box */}
              <div className="rounded-[2rem] border border-white/10 bg-slate-900/40 backdrop-blur-xl p-5 sm:p-8 text-white shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] w-full min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Gift className="h-7 w-7 sm:h-8 sm:w-8 text-fuchsia-400 shrink-0" />
                    <div>
                      <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-cyan-400 font-bold">Skill Questlines</p>
                      <h2 className="text-2xl sm:text-3xl font-black text-white">Explore All Quests</h2>
                    </div>
                  </div>

                  {/* Sort By Controls */}
                  <div className="flex items-center gap-2 bg-black/40 border border-white/10 px-3.5 py-2 rounded-2xl text-xs font-semibold">
                    <ArrowUpDown className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span className="text-slate-400 shrink-0">Sort By:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="recommended" className="bg-slate-900 text-white">✨ Recommended</option>
                      <option value="xp-desc" className="bg-slate-900 text-white">🔥 Highest XP Reward</option>
                      <option value="level-asc" className="bg-slate-900 text-white">🌱 Novice to Legendary</option>
                      <option value="progress-desc" className="bg-slate-900 text-white">⚡ Closest to Complete</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-4 w-full mt-6">
                  {/* Status & Level Filter Row */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-black/30 p-2.5 rounded-[1.5rem] border border-white/5 shadow-inner w-full">
                    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full max-w-full">
                      {["All", "Active", "Completed"].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setStatusFilter(status as any)}
                          className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all duration-200 ${
                            statusFilter === status
                              ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg shadow-cyan-500/25 scale-105"
                              : "text-slate-300 hover:bg-white/10"
                          }`}
                        >
                          {status === "Active" ? "🚀 To Do" : status === "Completed" ? "✨ Verified Done" : "All Status"}
                        </button>
                      ))}
                      <div className="w-px h-6 bg-white/10 mx-1 hidden sm:block"></div>
                      {levels.map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setLevelFilter(lvl)}
                          className={`shrink-0 rounded-full px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-extrabold uppercase tracking-wider transition-all duration-200 ${
                            levelFilter === lvl
                              ? "bg-slate-700 text-white border border-cyan-400/50 shadow-sm scale-105"
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
                    <div className="relative w-full xl:w-72 shrink-0">
                      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="search"
                        placeholder="Search title, category, keywords..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-full border border-white/10 bg-black/50 py-2.5 pl-10 pr-10 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 shadow-inner transition"
                      />
                      {search && (
                        <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 bg-white/10 rounded-full transition">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Category Pills with Emojis & Counts */}
                    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none w-full max-w-full">
                      {categories.map((cat) => {
                        const count = cat === "All" ? QUESTS.length : QUESTS.filter((q) => q.category === cat).length;
                        const emoji = categoryEmojis[cat] || "🧭";
                        const isActive = category === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                              isActive
                                ? "bg-cyan-600 text-white border border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105"
                                : "bg-slate-900/80 border border-white/10 text-slate-300 hover:bg-slate-800 hover:border-white/20"
                            }`}
                          >
                            <span>{emoji}</span>
                            <span>{cat}</span>
                            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? "bg-black/30 text-white" : "bg-white/10 text-slate-400"}`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Filter Counter Banner */}
                <div className="mt-6 flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-3">
                  <span>Showing <strong className="text-white font-bold">{filteredQuests.length}</strong> of {QUESTS.length} Quests</span>
                  {(search || category !== "All" || statusFilter !== "All" || levelFilter !== "All Levels") && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold transition"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>

                {/* Quests Grid or Empty State */}
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 w-full min-w-0">
                  {filteredQuests.length === 0 ? (
                    <div className="col-span-full rounded-3xl border border-dashed border-white/15 bg-black/30 p-12 text-center space-y-4">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-400">
                        <Search className="h-8 w-8 text-cyan-400 animate-pulse" />
                      </div>
                      <h3 className="text-lg font-bold text-white">No Quests Found</h3>
                      <p className="text-sm text-slate-400 max-w-md mx-auto">
                        We couldn&apos;t find any quests matching your current filters or search keywords. Try adjusting your category or level criteria.
                      </p>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:bg-cyan-500 transition"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span>Reset All Filters</span>
                      </button>
                    </div>
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
                    <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-cyan-400 font-bold">
                      Proof of Completion
                    </p>
                    <h2 className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-white">
                      Upload quest evidence
                    </h2>
                  </div>
                  <Camera className="h-7 w-7 sm:h-8 sm:w-8 text-slate-300 shrink-0" />
                </div>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-300/80 font-normal">
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