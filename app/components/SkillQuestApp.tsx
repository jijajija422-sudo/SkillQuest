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
  Novice: 1,
  Journeyman: 2,
  Adventurer: 3,
  Epic: 4,
  Legendary: 5,
};

export default function SkillQuestApp() {
  const [activeTab, setActiveTab] = useState<"feed" | "quests" | "profile">("feed");
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [customQuestOpen, setCustomQuestOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Completed">("All");
  const [levelFilter, setLevelFilter] = useState<string>("All Levels");
  const [sortBy, setSortBy] = useState<"recommended" | "xp-desc" | "level-asc" | "progress-desc">("recommended");
  const [toast, setToast] = useState<string | null>(null);

  const { profile, updateHeroName, awardXp } = useAuth();
  const userName = profile.name || "Adventurer";
  const completedQuests = profile.completedQuests || [];

  useEffect(() => {
    const handler = () => setCustomQuestOpen(true);
    window.addEventListener("open-custom-quest-modal", handler);
    return () => window.removeEventListener("open-custom-quest-modal", handler);
  }, []);

  const categories = useMemo(() => ["All", ...new Set(QUESTS.map((q) => q.category))], []);
  const levels = ["All Levels", "Novice", "Journeyman", "Adventurer", "Epic", "Legendary"];

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
    { id: "feed", label: "Chronicle Feed", icon: Compass },
    { id: "quests", label: "Bounty Board", icon: Map },
    { id: "profile", label: "Guild Dossier", icon: User },
  ] as const;

  return (
    <>
      <UserNameModal onSave={updateHeroName} />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-[55px] bottom-0 w-64 flex-col justify-between border-r-2 border-[#d4af37]/40 bg-[#162a1e] p-6 z-30 shadow-lg">
        <div className="space-y-6">
          <p className="text-xs font-guild font-bold text-gold-etched uppercase tracking-wider">Guild Registry Navigation</p>
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 font-guild font-bold transition text-left text-sm shadow-sm ${
                    isActive
                      ? "btn-enamel text-[#eafee8]"
                      : "border border-[#d4af37]/20 bg-[#1b3626]/80 text-[#c2b59b] hover:bg-[#234935] hover:text-[#f4ecd8] hover:border-[#d4af37]/60"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#f5d77f]" : "text-[#d4af37]"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Mini Profile Scroll */}
        <div className="rounded-xl border-2 border-[#8c6239] bg-parchment p-4 text-xs text-[#2b2118] shadow-md">
          <div className="flex items-center gap-2 pb-2 border-b border-[#c1b087]">
            <Shield className="h-4 w-4 text-[#8c6239] shrink-0" />
            <p className="font-guild font-bold text-[#4a2e18] truncate text-sm">{profile.name}</p>
          </div>
          <p className="text-[#6e5338] font-semibold mt-2">Guild Rank Level {profile.level}</p>
          <div className="mt-2 flex items-center justify-between text-[11px] pt-1">
            <span className="font-medium text-[#6e5338]">Quests Mastered</span>
            <span className="font-guild font-bold text-[#4a2e18]">{completedQuests.length} of {QUESTS.length}</span>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden items-center justify-around border-t-2 border-[#d4af37]/60 bg-[#162a1e] px-2 py-2 shadow-[0_-4px_12px_rgba(0,0,0,0.6)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 rounded-lg px-4 py-2 font-guild font-bold transition text-xs ${
                isActive ? "text-[#f5d77f] bg-[#1c3829] border border-[#d4af37]" : "text-[#c2b59b] hover:text-[#f4ecd8]"
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-[#f5d77f]" : "text-[#c2b59b]"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="min-h-screen w-full overflow-x-hidden px-4 py-8 pb-28 sm:px-6 md:px-10 lg:pl-72 lg:pr-12 lg:pb-12 bg-[#122017] text-[#f4ecd8]">
        <section className="mx-auto w-full max-w-5xl min-w-0">

          {/* Page heading */}
          <div className="mb-8 w-full min-w-0 border-b-2 border-[#d4af37]/30 pb-4">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-guild text-gold-etched">
              {activeTab === "feed" && "Activity Chronicle"}
              {activeTab === "quests" && "Guild Quest Board"}
              {activeTab === "profile" && "Adventurer Dossier"}
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-[#eddcc4]">
              {activeTab === "feed" && "Witness the triumphs and proof of deed shared by fellow guild adventurers."}
              {activeTab === "quests" && "Inspect open bounties, track your requirements, and submit proof of completion."}
              {activeTab === "profile" && "Your character statistics, prestige titles, and lifetime deeds."}
            </p>
          </div>

          {/* TAB 1: Feed */}
          {activeTab === "feed" && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr] items-start w-full min-w-0">
              <div className="space-y-6 w-full min-w-0">
                <div className="rounded-xl border-2 border-[#8c6239] bg-parchment p-5 sm:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-[#2b2118] w-full min-w-0 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#c1b087] pb-4 mb-5">
                    <h2 className="text-lg font-guild font-bold text-[#4a2e18] flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-[#8c6239]" />
                      <span>Guild Activity Chronicle</span>
                    </h2>
                    <span className="rounded border border-[#8c6239] bg-[#ebdcc0] px-2.5 py-0.5 text-xs font-guild font-bold text-[#5c3a1a]">Live Missives</span>
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
              <div className="rounded-xl border-2 border-[#8c6239] bg-parchment p-6 sm:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-[#2b2118] w-full min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#c1b087] pb-6">
                  <div>
                    <p className="text-xs font-guild font-bold uppercase tracking-wider text-gold-stamped">Mastery Progress</p>
                    <h2 className="mt-1 text-2xl font-bold font-guild text-[#4a2e18]">Journey Map & Bounties</h2>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCustomQuestOpen(true)}
                      className="inline-flex items-center gap-2 rounded-lg btn-bronze px-5 py-2.5 text-sm font-guild font-bold"
                    >
                      <PenLine className="h-4 w-4" />
                      <span>Inscribe Custom Deed</span>
                    </button>
                    <div className="flex items-center gap-3 border border-[#8c6239] bg-[#fff8ea] rounded-lg px-4 py-2.5 shadow-inner">
                      <div className="text-right">
                        <p className="text-xs text-[#8c6239] font-guild font-bold">Total Mastery</p>
                        <p className="text-sm font-bold text-[#4a2e18]">{completedQuests.length} / {QUESTS.length}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full border-2 border-[#8c6239] bg-[#ebdcc0] flex items-center justify-center text-[#4a2e18] font-guild font-bold text-xs shadow-sm">
                        {totalProgressPercent}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-xs font-guild font-bold text-[#6e5338]">
                    <span>Guild Ranking Progression</span>
                    <span className="text-[#4a2e18]">{QUESTS.length - completedQuests.length} deeds remaining</span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full border border-[#8c6239] bg-[#ebdcc0] p-0.5 shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#235338] via-[#1b432d] to-[#10b981] transition-all duration-1000"
                      style={{ width: `${totalProgressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Recommended Next */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-xs font-guild font-bold uppercase tracking-wider text-gold-stamped">
                    Recommended Bounties
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 w-full min-w-0">
                    {recommendedNext.map((q) => (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setSelectedQuest(q)}
                        className="group rounded-xl border-2 border-[#8c6239] bg-[#fff8ea] p-5 text-left transition hover:bg-[#fdfaf3] hover:border-[#4a2e18] hover:shadow-md w-full min-w-0 flex flex-col justify-between shadow-sm"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-guild font-bold uppercase tracking-wider text-[#8c6239] truncate">
                              {q.category}
                            </span>
                            <span className="text-[10px] font-guild font-bold text-[#4a2e18] px-2 py-0.5 bg-[#ebdcc0] border border-[#c1b087] rounded shrink-0">
                              +{q.xpReward} XP
                            </span>
                          </div>
                          <p className="font-bold font-guild text-[#4a2e18] text-base group-hover:text-[#8c6239] transition line-clamp-1">{q.title}</p>
                          <p className="mt-1 text-xs text-[#5c3a1a] line-clamp-2 leading-relaxed">{q.description}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-[#d8caa8] flex items-center justify-between text-xs font-guild font-bold text-[#8c6239]">
                          <span>{q.level}</span>
                          <span className="flex items-center gap-1 group-hover:translate-x-1 transition">Inspect <Play className="h-3 w-3 fill-[#8c6239]" /></span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quest Board Wood Container */}
              <div className="rounded-xl border-4 border-[#4a2e18] bg-wood p-5 sm:p-8 shadow-[0_12px_32px_rgba(0,0,0,0.8)] text-[#f4ecd8] w-full min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#8c6239]/60 pb-6">
                  <div>
                    <p className="text-xs font-guild font-bold uppercase tracking-wider text-gold-etched">Open Contracts</p>
                    <h2 className="text-xl sm:text-2xl font-bold font-guild text-[#fff8ea]">Available Quests</h2>
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-2 border border-[#d4af37]/60 bg-[#1c3829] px-3.5 py-2 rounded-lg text-xs font-guild font-semibold shadow-inner">
                    <ArrowUpDown className="h-3.5 w-3.5 text-[#f5d77f] shrink-0" />
                    <span className="text-[#c2b59b] shrink-0">Sort Bounties:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent text-[#f5d77f] font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="recommended" className="bg-[#162a1e] text-[#f4ecd8]">Recommended</option>
                      <option value="xp-desc" className="bg-[#162a1e] text-[#f4ecd8]">Highest XP Reward</option>
                      <option value="level-asc" className="bg-[#162a1e] text-[#f4ecd8]">Novice to Legendary</option>
                      <option value="progress-desc" className="bg-[#162a1e] text-[#f4ecd8]">Most Progress</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-4 w-full mt-6">
                  {/* Status & Level Filters */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#160d07]/80 p-2.5 rounded-xl border border-[#8c6239]/60 w-full shadow-inner">
                    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full max-w-full">
                      {["All", "Active", "Completed"].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setStatusFilter(status as any)}
                          className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-guild font-bold transition ${
                            statusFilter === status
                              ? "btn-bronze"
                              : "text-[#c2b59b] hover:bg-[#2e1d11] hover:text-[#f4ecd8]"
                          }`}
                        >
                          {status === "Active" ? "Open Bounties" : status === "Completed" ? "Mastered" : "All Scrolls"}
                        </button>
                      ))}
                      <div className="w-px h-5 bg-[#8c6239]/60 mx-1 hidden sm:block"></div>
                      {levels.map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => setLevelFilter(lvl)}
                          className={`shrink-0 rounded-lg px-3 py-1.5 text-[11px] sm:text-xs font-guild font-semibold transition ${
                            levelFilter === lvl
                              ? "btn-enamel text-[#eafee8]"
                              : "text-[#bba78c] hover:bg-[#2e1d11] hover:text-[#f4ecd8]"
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
                      <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#d4af37]" />
                      <input
                        type="search"
                        placeholder="Search quest scrolls..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-lg border border-[#8c6239] bg-[#160d07] py-2.5 pl-10 pr-10 text-sm text-[#f4ecd8] placeholder:text-[#8c6239] focus:outline-none focus:ring-2 focus:ring-[#d4af37] transition shadow-inner"
                      />
                      {search && (
                        <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#c2b59b] hover:text-[#f5d77f] p-1 rounded transition">
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
                            className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-guild font-semibold transition flex items-center gap-1.5 ${
                              isActive
                                ? "btn-enamel text-[#eafee8]"
                                : "bg-[#160d07] border border-[#8c6239]/60 text-[#c2b59b] hover:bg-[#2e1d11] hover:text-[#f4ecd8]"
                            }`}
                          >
                            <span>{cat}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${isActive ? "bg-[#10301d] text-[#f5d77f]" : "bg-[#2d1b10] text-[#bba78c]"}`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Filter Counter */}
                <div className="mt-6 flex items-center justify-between text-xs text-[#c2b59b] border-b border-[#8c6239]/60 pb-3 font-guild">
                  <span>Displaying <strong className="text-[#f5d77f]">{filteredQuests.length}</strong> of {QUESTS.length} guild scrolls</span>
                  {(search || category !== "All" || statusFilter !== "All" || levelFilter !== "All Levels") && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex items-center gap-1.5 text-[#f5d77f] hover:text-white font-bold transition"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>

                {/* Quests Grid */}
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 w-full min-w-0">
                  {filteredQuests.length === 0 ? (
                    <div className="col-span-full rounded-xl border-2 border-[#8c6239] bg-parchment p-12 text-center space-y-3 text-[#2b2118]">
                      <Search className="mx-auto h-8 w-8 text-[#8c6239]" />
                      <h3 className="text-base font-guild font-bold text-[#4a2e18]">No scrolls match your inquiry</h3>
                      <p className="text-sm text-[#6e5338] max-w-md mx-auto">
                        Adjust your filter criteria or search phrase to reveal hidden deeds.
                      </p>
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center gap-2 rounded-lg btn-bronze px-5 py-2.5 text-sm font-guild font-bold"
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