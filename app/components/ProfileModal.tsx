"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X, Sparkles, Trophy, Users, UserCheck, UserPlus, Edit3,
  Image as ImageIcon, Check, Loader2, Trash2, AlertTriangle,
  Camera, MessageSquare, Send, Star, Zap, Award, BookOpen, ChevronRight
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { uploadImage } from "@/lib/upload";
import { subscribeToFeed, isFirebaseConfigured, deleteCompletion } from "@/lib/firebase";
import { subscribeLocalFeed, deleteLocalCompletion } from "@/lib/feed-storage";
import type { UserProfile, GuildCompletion } from "@/lib/types";
import { titleForLevel, xpForLevel } from "@/lib/user";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProfile?: UserProfile | null;
}

const CLASS_PRESETS = [
  "Fullstack Paladin",
  "AI Sorcerer",
  "Cyber Samurai",
  "Frontend Illusionist",
  "Cloud Architect",
  "UI Wizard",
  "Code Alchemist",
  "Creative Explorer",
  "Fitness Warrior",
  "Culinary Artist",
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

const badgeColors: Record<string, string> = {
  Bronze: "bg-amber-900/60 border-amber-500/40 text-amber-300",
  Silver: "bg-slate-700/60 border-slate-400/40 text-slate-300",
  Gold: "bg-yellow-900/60 border-yellow-500/40 text-yellow-300",
  Platinum: "bg-cyan-900/60 border-cyan-500/40 text-cyan-300",
  Legendary: "bg-fuchsia-900/60 border-fuchsia-500/40 text-fuchsia-300",
};

export default function ProfileModal({ isOpen, onClose, targetProfile }: ProfileModalProps) {
  const { profile: myProfile, updateProfileDetails, followUser, unfollowUser } = useAuth();
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

  // --- Gradient based on level ---
  const levelGrad =
    displayedProfile.level >= 5
      ? "from-amber-600 via-orange-700 to-rose-900"
      : displayedProfile.level >= 3
      ? "from-fuchsia-700 via-indigo-800 to-slate-900"
      : "from-cyan-700 via-indigo-800 to-slate-900";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex max-h-[96vh] sm:max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-white/10 bg-slate-950 shadow-[0_0_80px_rgba(6,182,212,0.15)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Hero Banner ─── */}
        <div className={`relative shrink-0 bg-gradient-to-br ${levelGrad} overflow-hidden`} style={{ minHeight: 140 }}>
          {/* Decorative blobs */}
          <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-black/20 blur-xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full bg-black/40 border border-white/15 p-2 text-white/80 hover:bg-black/60 hover:text-white transition z-10"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Level badge */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/50 border border-white/20 px-3 py-1.5 backdrop-blur-sm">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-black text-white">Level {displayedProfile.level}</span>
          </div>

          {/* Avatar + Name overlay at bottom of banner */}
          <div className="absolute bottom-0 left-0 right-0 px-5 sm:px-8 pb-0 flex items-end gap-5">
            <div className="relative shrink-0 translate-y-8 sm:translate-y-10">
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl border-4 border-slate-950 bg-slate-800 overflow-hidden flex items-center justify-center text-3xl font-black bg-gradient-to-br from-cyan-600 to-indigo-800 shadow-2xl">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayedProfile.name} className="h-full w-full object-cover" />
                ) : (
                  <span>{displayedProfile.name?.charAt(0).toUpperCase()}</span>
                )}
              </div>
              {isOwnProfile && (
                <label className="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-cyan-500 border-2 border-slate-950 p-1.5 hover:bg-cyan-400 transition shadow-lg">
                  <Camera className="h-3 w-3 text-white" />
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>
            <div className="pb-3 sm:pb-4 translate-y-0 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 mb-0.5">
                {titleForLevel(displayedProfile.level)}
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight truncate">
                {displayedProfile.name}
              </h2>
              <span className="inline-block mt-1 rounded-full bg-black/40 border border-white/20 px-3 py-0.5 text-[11px] font-bold text-cyan-300 backdrop-blur-sm">
                {displayedProfile.classTitle || CLASS_PRESETS[0]}
              </span>
            </div>
          </div>
        </div>

        {/* ─── Action row (below banner) ─── */}
        <div className="shrink-0 flex items-center justify-end gap-3 px-5 sm:px-8 pt-12 sm:pt-14 pb-4 border-b border-white/10">
          {!isOwnProfile && (
            <button
              onClick={handleFollowToggle}
              className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition-all duration-200 ${
                isFollowing
                  ? "border border-white/20 bg-white/5 text-slate-300 hover:bg-white/10"
                  : "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:scale-[1.02]"
              }`}
            >
              {isFollowing ? <UserCheck className="h-4 w-4 text-emerald-400" /> : <UserPlus className="h-4 w-4" />}
              <span>{isFollowing ? "Following" : "Follow"}</span>
            </button>
          )}

          {/* Stats pills */}
          <div className="flex items-center gap-2 ml-auto">
            <div className="rounded-2xl bg-black/40 border border-white/10 px-4 py-2 text-center">
              <p className="text-base font-black text-cyan-400">{followersCount}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Followers</p>
            </div>
            <div className="rounded-2xl bg-black/40 border border-white/10 px-4 py-2 text-center">
              <p className="text-base font-black text-fuchsia-400">{followingCount}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Following</p>
            </div>
            <div className="rounded-2xl bg-black/40 border border-white/10 px-4 py-2 text-center">
              <p className="text-base font-black text-emerald-400">{completedCount}</p>
              <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Quests</p>
            </div>
          </div>
        </div>

        {/* ─── Tabs ─── */}
        <div className="shrink-0 flex items-center gap-1 border-b border-white/10 px-5 sm:px-8 bg-black/20 overflow-x-auto">
          {([
            { id: "overview", label: "Overview", icon: Sparkles },
            { id: "quests", label: `Posts (${feed.length})`, icon: Trophy },
            ...(isOwnProfile ? [{ id: "edit", label: "Edit Profile", icon: Edit3 }] : []),
          ] as { id: typeof activeTab; label: string; icon: React.ElementType }[]).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-1.5 py-3 px-3 text-xs sm:text-sm font-bold whitespace-nowrap border-b-2 transition-colors shrink-0 ${
                activeTab === id
                  ? "border-cyan-400 text-cyan-300"
                  : "border-transparent text-slate-500 hover:text-slate-300"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* ─── Tab Body ─── */}
        <div className="flex-1 overflow-y-auto">

          {/* ═══ OVERVIEW TAB ═══ */}
          {activeTab === "overview" && (
            <div className="p-5 sm:p-8 space-y-5">
              {/* Bio card */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-slate-950 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400 mb-2.5 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" /> About
                </p>
                <p className="text-sm leading-relaxed text-slate-300">
                  {displayedProfile.bio || "This adventurer prefers to let their quest completions speak for themselves."}
                </p>
              </div>

              {/* XP bar */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 to-indigo-950/40 p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-fuchsia-400 flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5" /> XP Progression
                  </p>
                  <span className="text-xs font-bold text-slate-300">
                    {totalXP.toLocaleString()} / {xpNeeded.toLocaleString()} XP
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-800 border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 transition-all duration-700"
                    style={{ width: `${xpPct}%` }}
                  />
                </div>
                <p className="mt-2 text-right text-[11px] text-slate-500 font-medium">{xpPct}% to Level {displayedProfile.level + 1}</p>
              </div>

              {/* Achievement stats grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-950/50 to-slate-950 p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <Award className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">{completedCount}</p>
                    <p className="text-[11px] text-emerald-400 font-bold uppercase tracking-wider">Quests Won</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-950/50 to-slate-950 p-5 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-amber-900/50 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <Sparkles className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-black text-white">{totalXP.toLocaleString()}</p>
                    <p className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">Total XP</p>
                  </div>
                </div>
              </div>

              {/* Recent posts preview */}
              {feed.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400 flex items-center gap-1.5">
                      <Trophy className="h-3.5 w-3.5" /> Recent Achievements
                    </p>
                    <button onClick={() => setActiveTab("quests")} className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white font-semibold transition">
                      See all <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="divide-y divide-white/5">
                    {feed.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/5 transition">
                        <div className="h-10 w-10 rounded-xl overflow-hidden bg-slate-800 border border-white/10 shrink-0">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.questTitle} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Trophy className="h-4 w-4 text-slate-500" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{item.questTitle}</p>
                          <p className="text-[11px] text-slate-500">{timeAgo(item.createdAt)}</p>
                        </div>
                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold shrink-0 ${badgeColors[item.badge] ?? "bg-slate-800 border-slate-600 text-slate-300"}`}>
                          {item.badge}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ POSTS TAB ═══ */}
          {activeTab === "quests" && (
            <div className="p-5 sm:p-8 space-y-4">
              {feed.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-white/10 rounded-3xl space-y-3">
                  <Trophy className="mx-auto h-10 w-10 text-slate-700" />
                  <p className="font-bold text-white">No achievements posted yet.</p>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    Completed quests with proof photos will appear here for the guild to celebrate!
                  </p>
                </div>
              ) : (
                feed.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-slate-900/60 overflow-hidden">
                    {/* Card header */}
                    <div className="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-white/5">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-black shrink-0 ${badgeColors[item.badge] ?? "bg-slate-800 border-slate-600 text-slate-300"}`}>
                          {item.badge}
                        </span>
                        <p className="font-bold text-white text-sm truncate">{item.questTitle}</p>
                        {item.isCustom && (
                          <span className="rounded-full bg-fuchsia-900/60 border border-fuchsia-500/40 px-2 py-0.5 text-[10px] font-black text-fuchsia-300 shrink-0">
                            ✨ Custom
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-500">{timeAgo(item.createdAt)}</span>
                        {isOwnProfile && (
                          confirmDeleteId === item.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDelete(item)}
                                disabled={deletingId === item.id}
                                className="inline-flex items-center gap-1 rounded-full bg-rose-600/90 border border-rose-400 px-2 py-0.5 text-[10px] font-bold text-white hover:bg-rose-500 transition"
                              >
                                {deletingId === item.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <AlertTriangle className="h-3 w-3" />}
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="rounded-full bg-white/10 border border-white/15 px-2 py-0.5 text-[10px] font-medium text-slate-300 hover:bg-white/20 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(item.id)}
                              className="rounded-full bg-white/5 border border-white/10 p-1.5 text-slate-500 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40 transition"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Image */}
                    {item.imageUrl && (
                      <div className="border-b border-white/5">
                        <img src={item.imageUrl} alt={item.questTitle} className="w-full h-44 object-cover" />
                      </div>
                    )}

                    {/* Caption/reflection */}
                    {item.caption && (
                      <div className="px-4 py-3 border-b border-white/5 bg-black/20">
                        <p className="text-[10px] font-black uppercase tracking-widest text-fuchsia-400 mb-1">💬 Reflection</p>
                        <p className="text-sm text-slate-300 leading-relaxed italic">&ldquo;{item.caption}&rdquo;</p>
                      </div>
                    )}

                    {/* Applause row */}
                    <div className="px-4 py-2.5 flex items-center gap-3 text-xs text-slate-400 border-b border-white/5">
                      <span className="font-semibold text-fuchsia-400">👏 {item.applause} Applause</span>
                      <span>·</span>
                      <span>{(item.comments ?? []).length} Comments</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ═══ EDIT TAB ═══ */}
          {activeTab === "edit" && isOwnProfile && (
            <form onSubmit={handleSave} className="p-5 sm:p-8 space-y-6">
              {/* Avatar */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">Profile Picture</label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl border border-cyan-500/40 bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <Camera className="h-6 w-6 text-slate-500" />
                    )}
                  </div>
                  <label className="cursor-pointer inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-white/10 transition">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin text-cyan-400" /> : <ImageIcon className="h-4 w-4 text-cyan-400" />}
                    <span>{uploading ? "Uploading…" : "Upload New Photo"}</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Hero Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">Hero Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition"
                  required
                />
              </div>

              {/* Class preset chips */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">Class Specialty</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {CLASS_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setClassTitle(preset)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-bold transition border ${
                        classTitle === preset
                          ? "bg-cyan-600/40 border-cyan-400 text-white"
                          : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
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
                  placeholder="Or type a custom class…"
                  className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan-400">Adventurer Bio</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  maxLength={300}
                  placeholder="Tell the guild about your questing philosophy, passions, or goals…"
                  className="w-full resize-none rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition leading-relaxed"
                />
                <p className="text-right text-[11px] text-slate-500">{bio.length}/300</p>
              </div>

              {/* Save button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Check className="h-4 w-4" /> Saved!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  <span>{saving ? "Saving…" : "Save Changes"}</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
