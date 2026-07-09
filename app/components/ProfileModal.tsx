"use client";

import React, { useState, useEffect } from "react";
import {
  X, Trophy, UserCheck, UserPlus, Edit3,
  Image as ImageIcon, Check, Loader2, Trash2, AlertTriangle,
  Camera, BookOpen, ChevronRight, User, Award, Heart, MessageSquare, Shield
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { uploadImage } from "@/lib/upload";
import { subscribeToFeed, isFirebaseConfigured, deleteCompletion } from "@/lib/firebase";
import { subscribeLocalFeed, deleteLocalCompletion } from "@/lib/feed-storage";
import type { UserProfile, GuildCompletion } from "@/lib/types";
import { titleForLevel, xpForLevel } from "@/lib/user";
import { CommentsSection } from "./GuildFeed";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfile?: UserProfile | null;
}

const CLASS_PRESETS = [
  "Fullstack Developer",
  "AI Engineer",
  "Systems Architect",
  "Frontend Developer",
  "Cloud Engineer",
  "UI/UX Designer",
  "Software Engineer",
  "Creative Explorer",
  "Fitness Enthusiast",
  "Self Learner",
];

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ProfileModal({ isOpen, onClose, targetProfile }: ProfileModalProps) {
  const { user, profile: myProfile, updateProfileDetails, followUser, unfollowUser, login } = useAuth();
  const isOwnProfile = !targetProfile || targetProfile.id === myProfile.id || targetProfile.id === "guest";
  const displayedProfile = isOwnProfile ? myProfile : targetProfile!;

  const [activeTab, setActiveTab] = useState<"overview" | "quests" | "edit">("overview");
  const [feed, setFeed] = useState<GuildCompletion[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Edit state
  const [name, setName] = useState(displayedProfile?.name || "");
  const [bio, setBio] = useState(displayedProfile?.bio || "");
  const [classTitle, setClassTitle] = useState(displayedProfile?.classTitle || CLASS_PRESETS[0]);
  const [avatarUrl, setAvatarUrl] = useState(displayedProfile?.avatarUrl || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setActiveTab("overview");
  }, [isOpen, targetProfile]);

  useEffect(() => {
    if (displayedProfile) {
      setName(displayedProfile.name || "");
      setBio(displayedProfile.bio || "");
      setClassTitle(displayedProfile.classTitle || CLASS_PRESETS[0]);
      setAvatarUrl(displayedProfile.avatarUrl || "");
    }
  }, [displayedProfile, isOpen]);

  useEffect(() => {
    if (!isOpen || !displayedProfile) return;
    const filterCompletions = (all: GuildCompletion[]) => {
      setFeed(all.filter((c) => c.userName === displayedProfile.name || c.userId === displayedProfile.id));
    };
    if (isFirebaseConfigured()) return subscribeToFeed(filterCompletions);
    return subscribeLocalFeed(filterCompletions);
  }, [isOpen, displayedProfile]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !displayedProfile) return null;

  const isFollowing = (myProfile.following || []).includes(displayedProfile.id);
  const followersCount = (displayedProfile.followers || []).length + (isFollowing && !isOwnProfile && !(displayedProfile.followers || []).includes(myProfile.id) ? 1 : 0);
  const followingCount = (displayedProfile.following || []).length;
  const xpNeeded = xpForLevel(displayedProfile.level);
  const xpPct = Math.min(100, Math.round((displayedProfile.xp / xpNeeded) * 100));
  const completedCount = displayedProfile.completedQuests?.length ?? 0;
  const totalXP = displayedProfile.xp ?? 0;

  async function handleDelete(item: GuildCompletion) {
    setDeletingId(item.id);
    setFeed((c) => c.filter((i) => i.id !== item.id));
    try {
      if (isFirebaseConfigured()) await deleteCompletion(item.id);
      else deleteLocalCompletion(item.id);
    } catch { /* ignore */ } finally {
      setDeletingId(null); setConfirmDeleteId(null);
    }
  }

  async function handleApplaud(item: GuildCompletion) {
    if (isFirebaseConfigured() && !user) {
      alert("Please sign in with Google to applaud achievements!");
      await login();
      return;
    }
    const userId = user?.uid ?? myProfile.id;
    setFeed((cur) =>
      cur.map((f) =>
        f.id === item.id
          ? { ...f, applause: f.applause + 1, applaudedBy: [...(f.applaudedBy || []), userId] }
          : f
      )
    );
    try {
      if (isFirebaseConfigured()) {
        const { applaudCompletion } = await import("@/lib/firebase");
        await applaudCompletion(item.id, userId);
      } else {
        const { applaudLocal } = await import("@/lib/feed-storage");
        await applaudLocal(item.id, userId);
      }
    } catch { /* ignore */ }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try { const url = await uploadImage(file); setAvatarUrl(url); }
    catch { /* ignore */ } finally { setUploading(false); }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await updateProfileDetails({ name: name.trim() || "Adventurer", bio: bio.trim(), classTitle, avatarUrl });
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  }

  async function handleFollowToggle() {
    if (isFollowing) await unfollowUser(displayedProfile.id);
    else await followUser(displayedProfile.id);
  }

  type TabId = "overview" | "quests" | "edit";
  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview Dossier", icon: User },
    { id: "quests", label: `Inscribed Chronicles (${feed.length})`, icon: Trophy },
    ...(isOwnProfile ? [{ id: "edit" as TabId, label: "Modify Dossier", icon: Edit3 }] : []),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4 transition"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex max-h-[95vh] sm:max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl border-4 border-[#4a2e18] bg-parchment shadow-[0_16px_40px_rgba(0,0,0,0.85)] text-[#2b2118]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative shrink-0 border-b-2 border-[#8c6239] bg-[#fcf8ed] px-6 pt-6 pb-5 shadow-md">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-lg border border-[#8c6239] p-2 text-[#6e5338] hover:bg-[#ebdcc0] hover:text-[#2b2118] transition"
            aria-label="Close dossier"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4 min-w-0">
              <div className="relative shrink-0">
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 border-[#8c6239] bg-[#ebdcc0] overflow-hidden flex items-center justify-center font-guild font-bold text-xl sm:text-2xl text-[#4a2e18] shadow-inner">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayedProfile.name} className="h-full w-full object-cover" />
                  ) : (
                    <span>{displayedProfile.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                {isOwnProfile && (
                  <label className="absolute -bottom-1 -right-1 cursor-pointer rounded-full btn-enamel border-2 border-[#8c6239] p-1.5 shadow-sm">
                    <Camera className="h-3.5 w-3.5 text-[#eafee8]" />
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded border border-[#8c6239] bg-[#ebdcc0] px-2 py-0.5 text-[10px] font-guild font-bold text-[#5c3a1a] uppercase tracking-wider">
                    Guild Rank {displayedProfile.level}
                  </span>
                  <span className="text-xs text-[#8c6239] font-guild font-bold truncate">
                    {titleForLevel(displayedProfile.level)}
                  </span>
                </div>
                <h2 className="mt-1 text-xl sm:text-2xl font-bold font-guild text-[#2b2118] truncate flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#8c6239] shrink-0" />
                  <span>{displayedProfile.name}</span>
                </h2>
                <p className="text-xs font-semibold text-[#6e5338] mt-0.5">
                  {displayedProfile.classTitle || CLASS_PRESETS[0]}
                </p>
              </div>
            </div>

            {/* Action buttons & Stats */}
            <div className="flex flex-col sm:items-end gap-3 shrink-0">
              {!isOwnProfile && (
                <button
                  onClick={handleFollowToggle}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-xs font-guild font-bold transition shadow-sm ${
                    isFollowing
                      ? "border border-[#8c6239] bg-[#ebdcc0] text-[#5c3a1a] hover:bg-[#decda8]"
                      : "btn-enamel"
                  }`}
                >
                  {isFollowing ? <UserCheck className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                  <span>{isFollowing ? "Comrade Followed" : "Form Alliance"}</span>
                </button>
              )}

              <div className="flex items-center gap-2">
                <div className="rounded-lg border border-[#8c6239] bg-[#fff8ea] px-3 py-1.5 text-center min-w-[75px] shadow-inner">
                  <p className="text-sm font-bold font-guild text-[#4a2e18]">{followersCount}</p>
                  <p className="text-[10px] text-[#8c6239] font-guild font-bold uppercase">Comrades</p>
                </div>
                <div className="rounded-lg border border-[#8c6239] bg-[#fff8ea] px-3 py-1.5 text-center min-w-[75px] shadow-inner">
                  <p className="text-sm font-bold font-guild text-[#4a2e18]">{followingCount}</p>
                  <p className="text-[10px] text-[#8c6239] font-guild font-bold uppercase">Following</p>
                </div>
                <div className="rounded-lg border border-[#8c6239] bg-[#fff8ea] px-3 py-1.5 text-center min-w-[75px] shadow-inner">
                  <p className="text-sm font-bold font-guild text-[#4a2e18]">{completedCount}</p>
                  <p className="text-[10px] text-[#8c6239] font-guild font-bold uppercase">Deeds</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="shrink-0 flex items-center gap-1 border-b-2 border-[#8c6239] px-6 bg-[#fff8ea] overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-1.5 py-3 px-3 text-xs sm:text-sm font-guild font-bold border-b-2 transition whitespace-nowrap ${
                activeTab === id
                  ? "border-[#4a2e18] text-[#4a2e18]"
                  : "border-transparent text-[#9e886d] hover:text-[#5c3a1a]"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Bio */}
              <div className="rounded-xl border-2 border-[#8c6239] bg-[#fff8ea] p-5 shadow-inner">
                <div className="flex items-center gap-1.5 text-xs font-guild font-bold uppercase tracking-wider text-gold-stamped mb-2">
                  <BookOpen className="h-4 w-4 text-[#8c6239]" />
                  <span>Adventurer Biography</span>
                </div>
                <p className="text-sm text-[#2b2118] leading-relaxed font-serif italic">
                  {displayedProfile.bio || "No biography inscribed yet."}
                </p>
              </div>

              {/* XP Bar */}
              <div className="rounded-xl border-2 border-[#8c6239] bg-[#fff8ea] p-5 shadow-inner">
                <div className="flex items-center justify-between mb-3 text-xs font-guild font-bold">
                  <span className="uppercase tracking-wider text-gold-stamped">Rank Progression</span>
                  <span className="text-[#4a2e18]">
                    {totalXP.toLocaleString()} / {xpNeeded.toLocaleString()} XP
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full border border-[#8c6239] bg-[#ebdcc0] p-0.5 shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#235338] via-[#1b432d] to-[#10b981] transition-all duration-700"
                    style={{ width: `${xpPct}%` }}
                  />
                </div>
                <p className="mt-2 text-right text-xs text-[#6e5338] font-guild font-semibold">{xpPct}% advancement toward Level {displayedProfile.level + 1}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border-2 border-[#8c6239] bg-[#fff8ea] p-5 flex items-center gap-4 shadow-sm">
                  <div className="h-12 w-12 rounded-lg bg-[#ebdcc0] border border-[#8c6239] flex items-center justify-center shrink-0 shadow-inner">
                    <Award className="h-6 w-6 text-[#8c6239]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold font-guild text-[#4a2e18]">{completedCount}</p>
                    <p className="text-xs text-[#6e5338] font-guild font-bold uppercase">Sealed Quests</p>
                  </div>
                </div>
                <div className="rounded-xl border-2 border-[#8c6239] bg-[#fff8ea] p-5 flex items-center gap-4 shadow-sm">
                  <div className="h-12 w-12 rounded-lg bg-[#ebdcc0] border border-[#8c6239] flex items-center justify-center shrink-0 shadow-inner">
                    <Trophy className="h-6 w-6 text-[#8c6239]" />
                  </div>
                  <div>
                    <p className="text-xl font-bold font-guild text-[#4a2e18]">{totalXP.toLocaleString()}</p>
                    <p className="text-xs text-[#6e5338] font-guild font-bold uppercase">Lifetime XP</p>
                  </div>
                </div>
              </div>

              {/* Recent posts preview */}
              {feed.length > 0 && (
                <div className="rounded-xl border-2 border-[#8c6239] overflow-hidden bg-[#fff8ea] shadow-sm">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#c1b087] bg-[#fdfaf3]">
                    <span className="text-xs font-guild font-bold uppercase tracking-wider text-gold-stamped flex items-center gap-1.5">
                      <Trophy className="h-4 w-4 text-[#8c6239]" /> Recent Chronicles
                    </span>
                    <button
                      onClick={() => setActiveTab("quests")}
                      className="inline-flex items-center gap-1 text-xs text-[#8c6239] hover:text-[#4a2e18] font-guild font-bold transition"
                    >
                      <span>Inspect all ({feed.length})</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="divide-y divide-[#d8caa8]">
                    {feed.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#fdfaf3] transition">
                        <div className="h-12 w-12 rounded-lg overflow-hidden bg-[#ebdcc0] border border-[#8c6239] shrink-0">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.questTitle} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Trophy className="h-5 w-5 text-[#8c6239]" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold font-guild text-[#4a2e18] truncate">{item.questTitle}</p>
                          <p className="text-xs text-[#8c6239]">{timeAgo(item.createdAt)}</p>
                        </div>
                        <span className="rounded border border-[#8c6239] bg-[#ebdcc0] px-2 py-0.5 text-xs font-guild font-bold text-[#5c3a1a] shrink-0">
                          {item.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* POSTS TAB */}
          {activeTab === "quests" && (
            <div className="space-y-4">
              {feed.length === 0 ? (
                <div className="py-16 text-center border-2 border-dashed border-[#8c6239] rounded-xl space-y-2 bg-[#fff8ea]/60">
                  <Trophy className="mx-auto h-8 w-8 text-[#8c6239]" />
                  <p className="font-bold font-guild text-[#4a2e18] text-base">No achievements inscribed yet</p>
                  <p className="text-xs text-[#6e5338] max-w-xs mx-auto">
                    Sealed quest proof illustrations will appear here upon completion.
                  </p>
                </div>
              ) : (
                feed.map((item) => (
                  <div key={item.id} className="rounded-xl border-2 border-[#8c6239] bg-[#fff8ea] overflow-hidden shadow-md">
                    {/* Card header */}
                    <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-[#c1b087] bg-[#fdfaf3]">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="rounded border border-[#8c6239] bg-[#ebdcc0] px-2 py-0.5 text-xs font-guild font-bold text-[#5c3a1a] shrink-0">
                          {item.badge}
                        </span>
                        <p className="font-bold font-guild text-[#4a2e18] text-sm truncate">{item.questTitle}</p>
                        {item.isCustom && (
                          <span className="rounded border border-[#c1b087] bg-[#ebdcc0] px-2 py-0.5 text-[10px] font-guild font-semibold text-[#6e5338] shrink-0">
                            Custom Deed
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-[#8c6239]">{timeAgo(item.createdAt)}</span>
                        {isOwnProfile && (
                          confirmDeleteId === item.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDelete(item)}
                                disabled={deletingId === item.id}
                                className="inline-flex items-center gap-1 rounded bg-red-800 border border-red-600 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-red-700 transition"
                              >
                                {deletingId === item.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <AlertTriangle className="h-3 w-3" />}
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="rounded border border-[#8c6239] bg-[#ebdcc0] px-2 py-0.5 text-[11px] text-[#5c3a1a] hover:bg-[#dcd0b3] transition"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(item.id)}
                              className="rounded p-1 text-[#8c6239] hover:text-red-700 hover:bg-[#ebdcc0] transition"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Image */}
                    {item.imageUrl && (
                      <div className="border-b border-[#c1b087] bg-[#24160d]">
                        <img src={item.imageUrl} alt={item.questTitle} className="w-full h-56 object-cover" />
                      </div>
                    )}

                    {/* Caption/reflection */}
                    {item.caption && (
                      <div className="px-4 py-3 border-b border-[#c1b087] bg-[#fdfaf3]">
                        <p className="text-[10px] font-guild font-bold uppercase tracking-wider text-[#8c6239] mb-1">Adventurer&apos;s Reflection</p>
                        <p className="text-sm text-[#2b2118] leading-relaxed font-serif italic">&ldquo;{item.caption}&rdquo;</p>
                      </div>
                    )}

                    {/* Applause & Missives row */}
                    <div className="px-4 py-3 flex items-center justify-between border-t border-[#c1b087] bg-[#fdfaf3]">
                      <button
                        type="button"
                        onClick={() => handleApplaud(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#8c6239] bg-[#fff8ea] px-3 py-1.5 text-xs font-guild font-bold text-[#4a2e18] hover:bg-[#ebdcc0] hover:scale-105 transition shadow-sm"
                      >
                        <Heart className="h-4 w-4 fill-[#8c6239] text-[#8c6239]" />
                        <span>{item.applause} Prestige Applause</span>
                      </button>
                      <span className="text-xs font-guild font-bold text-[#6e5338]">
                        {(item.comments ?? []).length} Missives Inscribed
                      </span>
                    </div>

                    {/* Interactive Comments Section */}
                    <CommentsSection item={item} myProfile={myProfile} user={user} />
                  </div>
                ))
              )}
            </div>
          )}

          {/* EDIT TAB */}
          {activeTab === "edit" && isOwnProfile && (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Avatar */}
              <div className="space-y-2">
                <label className="text-xs font-guild font-bold uppercase tracking-wider text-gold-stamped">Dossier Portrait</label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl border-2 border-[#8c6239] bg-[#ebdcc0] overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <Camera className="h-6 w-6 text-[#8c6239]" />
                    )}
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-2 rounded-lg btn-bronze px-4 py-2.5 text-sm font-guild font-bold">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                    <span>{uploading ? "Inscribing Portrait..." : "Upload Portrait"}</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Hero Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-guild font-bold uppercase tracking-wider text-gold-stamped">Adventurer Title / Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-[#8c6239] bg-[#fff8ea] px-4 py-2.5 text-sm text-[#2b2118] focus:outline-none focus:ring-2 focus:ring-[#4a2e18] transition shadow-inner font-guild font-bold"
                  required
                />
              </div>

              {/* Class preset chips */}
              <div className="space-y-2">
                <label className="text-xs font-guild font-bold uppercase tracking-wider text-gold-stamped">Guild Class Specialty</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {CLASS_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setClassTitle(preset)}
                      className={`rounded-md px-3 py-1.5 text-xs font-guild font-bold transition border ${
                        classTitle === preset
                          ? "btn-enamel text-[#eafee8]"
                          : "bg-[#fff8ea] border-[#8c6239] text-[#5c3a1a] hover:bg-[#ebdcc0]"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={classTitle}
                  onChange={(e) => setClassTitle(e.target.value)}
                  placeholder="Or enter a custom guild class title..."
                  className="w-full rounded-lg border border-[#8c6239] bg-[#fff8ea] px-4 py-2.5 text-sm text-[#2b2118] focus:outline-none focus:ring-2 focus:ring-[#4a2e18] transition shadow-inner font-semibold"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="text-xs font-guild font-bold uppercase tracking-wider text-gold-stamped">Adventurer Philosophy / Biography</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={300}
                  placeholder="Inscribe your personal creed or lifetime ambition..."
                  className="w-full resize-none rounded-lg border border-[#8c6239] bg-[#fff8ea] px-4 py-3 text-sm text-[#2b2118] focus:outline-none focus:ring-2 focus:ring-[#4a2e18] transition leading-relaxed shadow-inner"
                />
                <p className="text-right text-[11px] text-[#8c6239] font-guild">{bio.length}/300</p>
              </div>

              {/* Save button */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#c1b087]">
                {saveSuccess && (
                  <span className="text-xs font-guild font-bold text-[#235338] flex items-center gap-1.5">
                    <Check className="h-4 w-4 text-[#235338]" /> Dossier updated
                  </span>
                )}
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="inline-flex items-center gap-2 rounded-lg btn-bronze px-6 py-2.5 text-sm font-guild font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  <span>{saving ? "Inscribing..." : "Save Dossier Changes"}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
