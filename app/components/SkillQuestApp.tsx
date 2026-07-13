"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  PenLine,
  Gift,
  Search,
  Compass,
  Map,
  User,
  Trophy,
  ArrowUpDown,
  RotateCcw,
  CheckCircle2,
  Play,
  X,
  Shield,
  BookOpen
} from "lucide-react";
import { QUESTS } from "@/lib/quests";
import { useAuth } from "@/lib/auth-context";
import QuestCard from "./QuestCard";
import QuestModal from "./QuestModal";
import CustomQuestModal from "./CustomQuestModal";
import GuildFeed from "./GuildFeed";
import CharacterSheet from "./CharacterSheet";
import LiveChallenge from "./LiveChallenge";
import Achievements from "./Achievements";
import Toast from "./Toast";
import UserNameModal from "./UserNameModal";
import type { Quest } from "@/lib/types";

const levelWeights: Record<string, number> = {
  Foundational: 1,
  Novice: 1,
  Journeyman: 2,
  Adventurer: 3,
  Advanced: 4,
  Epic: 4,
  Masterclass: 5,
  Legendary: 5,
};

export default function SkillQuestApp() {
  const [activeTab, setActiveTab] = useState<"feed" | "quests" | "profile">("feed");
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [customQuestOpen, setCustomQuestOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Completed">("All");
  const [levelFilter, setLevelFilter] = useState<string>("All Phases");
  const [sortBy, setSortBy] = useState<"recommended" | "xp-desc" | "level-asc" | "progress-desc">("recommended");
  const [toast, setToast] = useState<string | null>(null);

  const { profile, updateHeroName, awardXp } = useAuth();
  const userName = profile.name || "Member";
  const completedQuests = profile.completedQuests || [];

  useEffect(() => {
    const handler = () => setCustomQuestOpen(true);
    window.addEventListener("open-custom-quest-modal", handler);
    return () => window.removeEventListener("open-custom-quest-modal", handler);
  }, []);

  const categories = useMemo(() => ["All", ...new Set(QUESTS.map((q) => q.category))], []);
  const levels = ["All Phases", "Foundational", "Novice", "Journeyman", "Adventurer", "Advanced", "Masterclass"];

  const filteredQuests = useMemo(() => {
    const list = QUESTS.filter((q) => {
      const isCompleted = completedQuests.includes(q.id);
      const matchStatus =
        statusFilter === "All" ? true :
        statusFilter === "Active" ? !isCompleted :
        isCompleted;
      const matchLevel = levelFilter === "All Phases" || q.level === levelFilter;
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
      setToast(`Exploration complete! +${quest.xpReward} progress steps earned. Shared with the community.`);
      setSelectedQuest(null);
    },
    [completedQuests, awardXp]
  );

  function resetFilters() {
    setSearch("");
    setCategory("All");
    setStatusFilter("All");
    setLevelFilter("All Phases");
    setSortBy("recommended");
  }

  const tabs = [
    { id: "feed", label: "Recent Activity", icon: Compass },
    { id: "quests", label: "Explore Hub", icon: Map },
    { id: "profile", label: "Member Profile", icon: User },
  ] as const;

  return (
    <>
      <UserNameModal onSave={updateHeroName} />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-[65px] bottom-0 w-64 flex-col justify-between border-r border-slate-200/80 bg-[#e6ecf2] p-6 z-30 shadow-neu-inset-sm">
        <div className="space-y-6">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Explore Hub Navigation</p>
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-bold transition text-left text-sm ${
                    isActive
                      ? "btn-bronze shadow-neu-raised"
                      : "border border-slate-200/80 bg-[#f0f4f8] text-slate-600 hover:bg-[#e6ecf2] hover:text-slate-900 shadow-neu-raised-sm"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-teal-600" : "text-slate-500"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Mini Profile Scroll */}
        <div className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-4 text-xs text-slate-800 shadow-neu-raised-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200/80">
            <Compass className="h-4 w-4 text-teal-600 shrink-0" />
            <p className="font-bold text-slate-800 truncate text-sm">{profile.name}</p>
          </div>
          <p className="text-slate-600 font-semibold mt-2">Skill Phase {profile.level}</p>
          <div className="mt-2 flex items-center justify-between text-[11px] pt-1">
            <span className="font-medium text-slate-600">Completed Explorations</span>
            <span className="font-bold text-slate-800">{completedQuests.length} of {QUESTS.length}</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden items-center justify-around border-t border-slate-200/80 bg-[#e6ecf2] px-2 py-2 shadow-neu-raised-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl px-4 py-2 font-bold transition text-xs ${
                isActive ? "text-teal-600 bg-[#f0f4f8] border border-slate-200/80 shadow-neu-inset-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-teal-600" : "text-slate-500"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="min-h-screen w-full overflow-x-hidden px-4 py-8 pb-28 sm:px-6 md:px-10 lg:pl-72 lg:pr-12 lg:pb-12 bg-[#e6ecf2] text-slate-800">
        <section className="mx-auto w-full max-w-5xl min-w-0">

          {/* Page heading */}
          <div className="mb-8 w-full min-w-0 border-b border-slate-200/80 pb-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">
              {activeTab === "feed" && "Recent Activity"}
              {activeTab === "quests" && "Explore Hub"}
              {activeTab === "profile" && "Member Profile"}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-medium">
              {activeTab === "feed" && "Discover new hobbies, find learning partners, and celebrate what the community is building."}
              {activeTab === "quests" && "Browse explorations, track your skills, and submit verifications."}
              {activeTab === "profile" && "Your professional overview, verified badges, and milestone progress."}
            </p>
          </div>

          {/* TAB 1: Feed */}
          {activeTab === "feed" && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start w-full min-w-0">
              <div className="space-y-6 w-full min-w-0">
                <div className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-5 sm:p-6 shadow-neu-raised-lg text-slate-800 w-full min-w-0 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-4 mb-5">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-teal-600" />
                      <span>Hobby Discovery &amp; Skill Exchange</span>
                    </h2>
                    <span className="rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-3 py-1 text-xs font-bold text-teal-600 shadow-neu-inset-sm">Live</span>
                  </div>
                  <div className="w-full min-w-0">
                    <GuildFeed />
                  </div>
                </div>
              </div>

              <div className="space-y-6 w-full min-w-0">
                <LiveChallenge />
              </div>
            </div>
          )}

          {/* TAB 2: Quests */}
          {activeTab === "quests" && (
            <div className="space-y-8 w-full min-w-0">
              {/* Journey Overview Parchment */}
              <div className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-6 sm:p-8 shadow-neu-raised-lg text-slate-800 w-full min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-teal-600">Skill Progress</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-800">Skill Roadmap &amp; Explorations</h2>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCustomQuestOpen(true)}
                      className="inline-flex items-center gap-2 rounded-xl btn-bronze px-5 py-2.5 text-sm font-bold shadow-neu-raised transition hover:scale-[1.01]"
                    >
                      <PenLine className="h-4 w-4" />
                      <span>Create Custom Exploration</span>
                    </button>
                    <div className="flex items-center gap-3 border border-slate-200/80 bg-[#e6ecf2] rounded-xl px-4 py-2.5 shadow-neu-inset-sm">
                      <div className="text-right">
                        <p className="text-xs text-slate-500 font-bold">Completed Skills</p>
                        <p className="text-sm font-bold text-slate-800">{completedQuests.length} / {QUESTS.length}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full border border-slate-200/80 bg-[#f0f4f8] flex items-center justify-center text-teal-600 font-bold text-xs shadow-neu-raised-sm">
                        {totalProgressPercent}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Overall Skill Progression</span>
                    <span className="text-slate-800">{QUESTS.length - completedQuests.length} explorations remaining</span>
                  </div>
                  <div className="h-3.5 w-full overflow-hidden rounded-full border border-slate-200/80 bg-[#e6ecf2] p-0.5 shadow-neu-inset-sm">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-500 transition-all duration-1000"
                      style={{ width: `${totalProgressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Recommended Next */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-600">
                    Recommended Explorations
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 w-full min-w-0">
                    {recommendedNext.map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setSelectedQuest(q)}
                        className="group rounded-2xl border border-slate-200/80 bg-[#e6ecf2] p-5 text-left transition hover:bg-[#f0f4f8] hover:shadow-neu-raised w-full min-w-0 flex flex-col justify-between shadow-neu-inset-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 truncate">
                              {q.category}
                            </span>
                            <span className="text-[10px] font-bold text-slate-800 px-2 py-0.5 bg-[#f0f4f8] border border-slate-200/80 rounded shrink-0 shadow-neu-raised-sm">
                              +{q.xpReward} pts
                            </span>
                          </div>
                          <p className="font-bold text-slate-800 text-base group-hover:text-teal-600 transition line-clamp-1">{q.title}</p>
                          <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">{q.description}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-600">
                          <span>{q.level}</span>
                          <span className="flex items-center gap-1 group-hover:translate-x-1 transition text-teal-600">View <Play className="h-3 w-3 fill-teal-600 text-teal-600" /></span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Available Challenges Container */}
              <div className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-5 sm:p-8 shadow-neu-raised-lg text-slate-800 w-full min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-teal-600">Open Explorations</p>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Available Explorations</h2>
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-2 border border-slate-200/80 bg-[#e6ecf2] px-3.5 py-2 rounded-xl text-xs font-semibold shadow-neu-inset-sm">
                    <ArrowUpDown className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                    <span className="text-slate-600 shrink-0 font-bold">Sort By:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="recommended" className="bg-[#f0f4f8] text-slate-800">Recommended</option>
                      <option value="xp-desc" className="bg-[#f0f4f8] text-slate-800">Highest Progress Steps</option>
                      <option value="level-asc" className="bg-[#f0f4f8] text-slate-800">Foundational to Masterclass</option>
                      <option value="progress-desc" className="bg-[#f0f4f8] text-slate-800">Most Progress</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-4 w-full mt-6">
                  {/* Status & Level Filters */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#e6ecf2] p-2.5 rounded-2xl border border-slate-200/80 w-full shadow-neu-inset-sm">
                    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full max-w-full">
                      {["All", "Active", "Completed"].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setStatusFilter(status as any)}
                          className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-bold transition ${
                            statusFilter === status
                              ? "btn-bronze shadow-neu-raised-sm"
                              : "text-slate-600 hover:bg-[#f0f4f8] hover:text-slate-900"
                          }`}
                        >
                          {status === "Active" ? "Active" : status === "Completed" ? "Completed" : "All Explorations"}
                        </button>
                      ))}
                      <div className="w-px h-5 bg-slate-200/80 mx-1 hidden sm:block"></div>
                      {levels.map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setLevelFilter(lvl)}
                          className={`shrink-0 rounded-xl px-3 py-1.5 text-[11px] sm:text-xs font-semibold transition ${
                            levelFilter === lvl
                              ? "btn-bronze shadow-neu-raised-sm"
                              : "text-slate-600 hover:bg-[#f0f4f8] hover:text-slate-900"
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search & Category */}
                  <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-3 w-full">
                    <div className="relative w-full xl:w-72 shrink-0">
                      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="search"
                        placeholder="Search explorations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-xl border border-slate-200/80 bg-[#e6ecf2] py-2.5 pl-10 pr-10 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition shadow-neu-inset-sm font-medium"
                      />
                      {search && (
                        <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded transition">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none w-full max-w-full">
                      {categories.map((cat) => {
                        const count = cat === "All" ? QUESTS.length : QUESTS.filter((q) => q.category === cat).length;
                        const isActive = category === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`shrink-0 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition flex items-center gap-1.5 ${
                              isActive
                                ? "btn-bronze shadow-neu-raised-sm"
                                : "bg-[#e6ecf2] border border-slate-200/80 text-slate-600 hover:bg-[#f0f4f8] hover:text-slate-900 shadow-neu-inset-sm"
                            }`}
                          >
                            <span>{cat}</span>
                            <span className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold ${isActive ? "bg-teal-700/30 text-white" : "bg-[#f0f4f8] text-slate-600 border border-slate-200/80"}`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Filter Counter */}
                <div className="mt-6 flex items-center justify-between text-xs text-slate-600 border-b border-slate-200/80 pb-3 font-medium">
                  <span>Showing <strong className="text-slate-800 font-bold">{filteredQuests.length}</strong> of {QUESTS.length} explorations</span>
                  {(search || category !== "All" || statusFilter !== "All" || levelFilter !== "All Phases") && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex items-center gap-1.5 text-teal-600 hover:text-teal-700 font-bold transition"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>

                {/* Quests Grid */}
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 w-full min-w-0">
                  {filteredQuests.length === 0 ? (
                    <div className="col-span-full rounded-2xl border border-slate-200/80 bg-[#e6ecf2] p-12 text-center space-y-3 text-slate-800 shadow-neu-inset-sm">
                      <Search className="mx-auto h-8 w-8 text-slate-400" />
                      <h3 className="text-base font-bold text-slate-800">No explorations match your filters</h3>
                      <p className="text-sm text-slate-600 max-w-md mx-auto">
                        Adjust your filter criteria or search phrase to see more explorations.
                      </p>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center gap-2 rounded-xl btn-bronze px-5 py-2.5 text-sm font-bold shadow-neu-raised transition hover:scale-[1.01]"
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
            </div>
          )}

          {/* TAB 3: Profile */}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start w-full min-w-0">
              <div className="space-y-6 w-full min-w-0">
                <CharacterSheet />
              </div>
              <div className="space-y-6 w-full min-w-0">
                <Achievements />
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

      <CustomQuestModal
        isOpen={customQuestOpen}
        onClose={() => setCustomQuestOpen(false)}
      />

      <Toast message={toast ?? ""} visible={!!toast} onClose={() => setToast(null)} />
    </>
  );
}