"use client";

import React, { useState, useEffect } from "react";
import {
  X, Trophy, UserCheck, UserPlus, Edit3,
  Image as ImageIcon, Check, Loader2, Trash2, AlertTriangle,
  Camera, BookOpen, ChevronRight, User, Award, Heart, MessageSquare,
  Compass, Plus, Tag, Users, Handshake
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { uploadImage } from "@/lib/upload";
import { subscribeToFeed, isFirebaseConfigured, deleteCompletion } from "@/lib/firebase";
import { subscribeLocalFeed, deleteLocalCompletion } from "@/lib/feed-storage";
import type { UserProfile, GuildCompletion } from "@/lib/types";
import { titleForLevel, xpForLevel } from "@/lib/user";
import { CommentsSection } from "./GuildFeed";
import PrivateChat, { getOrCreateThread } from "./PrivateChat";

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

const SKILL_SUGGESTIONS = [
  "Guitar", "Piano", "Watercolor", "Photography", "Python", "JavaScript",
  "Cooking", "Yoga", "Chess", "Sketching", "Spanish", "Japanese",
  "3D Printing", "Woodworking", "Knitting", "Gardening", "Podcasting",
  "Video Editing", "Running", "Rock Climbing",
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

// ─── Skill Tag Pill ────────────────────────────────────────────────────────────
function SkillTag({
  label,
  variant = "neutral",
  onRemove,
}: {
  label: string;
  variant?: "offering" | "seeking" | "neutral";
  onRemove?: () => void;
}) {
  const colors =
    variant === "offering"
      ? "bg-teal-50 border-teal-300 text-teal-800"
      : variant === "seeking"
      ? "bg-amber-50 border-amber-300 text-amber-800"
      : "bg-[#e6ecf2] border-slate-200/80 text-slate-700";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition ${colors}`}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full hover:opacity-70 transition"
          aria-label={`Remove ${label}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}

// ─── Tag editor (used in Edit tab) ────────────────────────────────────────────
function TagEditor({
  label,
  tags,
  onChange,
  variant,
  placeholder,
}: {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  variant: "offering" | "seeking";
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  function add(value: string) {
    const v = value.trim();
    if (!v || tags.includes(v) || tags.length >= 10) return;
    onChange([...tags, v]);
    setInput("");
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold uppercase tracking-wider text-teal-600">{label}</label>
      <div className="flex flex-wrap gap-1.5 min-h-[36px]">
        {tags.map((t) => (
          <SkillTag key={t} label={t} variant={variant} onRemove={() => onChange(tags.filter((x) => x !== t))} />
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); add(input); }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-3.5 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition shadow-neu-inset-sm font-medium placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={() => add(input)}
          disabled={!input.trim()}
          className="rounded-xl btn-bronze px-3.5 py-2 text-sm font-bold shadow-neu-raised-sm transition disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      {/* Quick-add suggestions */}
      <div className="flex flex-wrap gap-1.5">
        {SKILL_SUGGESTIONS.filter((s) => !tags.includes(s)).slice(0, 8).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => add(s)}
            className="rounded-full border border-slate-200/80 bg-[#f0f4f8] px-2.5 py-0.5 text-[11px] font-bold text-slate-600 hover:bg-[#e6ecf2] hover:text-slate-900 transition shadow-neu-raised-sm"
          >
            + {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function ProfileModal({ isOpen, onClose, targetProfile }: ProfileModalProps) {
  const { user, profile: myProfile, updateProfileDetails, followUser, unfollowUser, login } = useAuth();

  // Robust own-profile check
  const isOwnProfile =
    !targetProfile ||
    targetProfile.id === myProfile.id ||
    targetProfile.id === "guest" ||
    (myProfile.id === "guest" && !targetProfile.id);

  const displayedProfile = isOwnProfile ? myProfile : targetProfile!;

  type TabId = "overview" | "quests" | "edit";
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [feed, setFeed] = useState<GuildCompletion[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  // Edit state
  const [name, setName] = useState(displayedProfile?.name || "");
  const [bio, setBio] = useState(displayedProfile?.bio || "");
  const [classTitle, setClassTitle] = useState(displayedProfile?.classTitle || CLASS_PRESETS[0]);
  const [avatarUrl, setAvatarUrl] = useState(displayedProfile?.avatarUrl || "");
  const [offering, setOffering] = useState<string[]>(displayedProfile?.offering || []);
  const [seeking, setSeeking] = useState<string[]>(displayedProfile?.seeking || []);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setActiveTab("overview");
    setChatOpen(false);
  }, [isOpen, targetProfile]);

  useEffect(() => {
    if (displayedProfile) {
      setName(displayedProfile.name || "");
      setBio(displayedProfile.bio || "");
      setClassTitle(displayedProfile.classTitle || CLASS_PRESETS[0]);
      setAvatarUrl(displayedProfile.avatarUrl || "");
      setOffering(displayedProfile.offering || []);
      setSeeking(displayedProfile.seeking || []);
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

  // ── Social counts ────────────────────────────────────────────────────────────
  const isConnected = (myProfile.following || []).includes(displayedProfile.id);
  const connectionsCount = (displayedProfile.followers || []).length +
    (isConnected && !isOwnProfile && !(displayedProfile.followers || []).includes(myProfile.id) ? 1 : 0);
  const mentorsCount = (displayedProfile.mentors || []).length;
  const xpNeeded = xpForLevel(displayedProfile.level);
  const xpPct = Math.min(100, Math.round((displayedProfile.xp / xpNeeded) * 100));
  const completedCount = displayedProfile.completedQuests?.length ?? 0;
  const totalXP = displayedProfile.xp ?? 0;

  // ── Handlers ─────────────────────────────────────────────────────────────────
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
      alert("Please sign in with Google to applaud journey milestones!");
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
    await updateProfileDetails({
      name: name.trim() || "Member",
      bio: bio.trim(),
      classTitle,
      avatarUrl,
      offering,
      seeking,
    });
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  }

  async function handleConnectToggle() {
    if (isConnected) await unfollowUser(displayedProfile.id);
    else await followUser(displayedProfile.id);
  }

  function handleSendMessage() {
    // Ensure the thread exists, then open chat
    getOrCreateThread(displayedProfile.id, displayedProfile.name, displayedProfile.avatarUrl);
    setChatOpen(true);
  }

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: User },
    { id: "quests", label: `Activity (${feed.length})`, icon: Trophy },
    // Only show Edit tab on own profile
    ...(isOwnProfile ? [{ id: "edit" as TabId, label: "Edit Profile", icon: Edit3 }] : []),
  ];

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-sm p-0 sm:p-4 transition"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="flex max-h-[95vh] sm:max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl sm:rounded-2xl border border-slate-200/80 bg-[#e6ecf2] shadow-neu-raised-lg text-slate-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header Banner ─────────────────────────────────────────────── */}
          <div className="relative shrink-0 border-b border-slate-200/80 bg-[#f0f4f8] px-6 pt-6 pb-5 shadow-neu-inset-sm">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-xl border border-slate-200/80 p-2 text-slate-500 hover:bg-[#e6ecf2] hover:text-slate-800 transition shadow-neu-raised-sm"
              aria-label="Close profile"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              {/* Avatar + name */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative shrink-0">
                  <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border border-slate-200/80 bg-[#e6ecf2] overflow-hidden flex items-center justify-center font-bold text-xl sm:text-2xl text-slate-800 shadow-neu-inset-sm">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayedProfile.name} className="h-full w-full object-cover" />
                    ) : (
                      <span>{displayedProfile.name?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  {isOwnProfile && (
                    <label className="absolute -bottom-1 -right-1 cursor-pointer rounded-full btn-bronze border border-slate-200/80 p-1.5 shadow-neu-raised-sm">
                      <Camera className="h-3.5 w-3.5" />
                      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="rounded-lg border border-slate-200/80 bg-[#e6ecf2] px-2.5 py-0.5 text-[10px] font-bold text-teal-600 uppercase tracking-wider shadow-neu-raised-sm">
                      Phase {displayedProfile.level}
                    </span>
                    <span className="text-xs text-slate-600 font-bold truncate">
                      {titleForLevel(displayedProfile.level)}
                    </span>
                  </div>
                  <h2 className="mt-1.5 text-xl sm:text-2xl font-bold text-slate-800 truncate flex items-center gap-2">
                    <Compass className="h-5 w-5 text-teal-600 shrink-0" />
                    <span>{displayedProfile.name}</span>
                  </h2>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">
                    {displayedProfile.classTitle || CLASS_PRESETS[0]}
                  </p>
                </div>
              </div>

              {/* Action buttons & social stats */}
              <div className="flex flex-col sm:items-end gap-3 shrink-0">
                {/* Connect + Message buttons for public profiles */}
                {!isOwnProfile && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleConnectToggle}
                      className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition shadow-neu-raised-sm ${
                        isConnected
                          ? "border border-slate-200/80 bg-[#e6ecf2] text-slate-600 hover:bg-[#f0f4f8]"
                          : "btn-bronze"
                      }`}
                    >
                      {isConnected ? <UserCheck className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                      <span>{isConnected ? "Connected" : "Connect"}</span>
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-4 py-2 text-xs font-bold text-slate-700 hover:bg-[#f0f4f8] transition shadow-neu-raised-sm"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-teal-600" />
                      <span>Message</span>
                    </button>
                  </div>
                )}

                {/* Connections / Mentors / Explorations stats */}
                <div className="flex items-center gap-2">
                  <div className="rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-3 py-1.5 text-center min-w-[75px] shadow-neu-inset-sm">
                    <p className="text-sm font-bold text-slate-800">{connectionsCount}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Connections</p>
                  </div>
                  <div className="rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-3 py-1.5 text-center min-w-[75px] shadow-neu-inset-sm">
                    <p className="text-sm font-bold text-slate-800">{mentorsCount}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Mentors</p>
                  </div>
                  <div className="rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-3 py-1.5 text-center min-w-[75px] shadow-neu-inset-sm">
                    <p className="text-sm font-bold text-slate-800">{completedCount}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Explorations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tabs ──────────────────────────────────────────────────────── */}
          <div className="shrink-0 flex items-center gap-2 border-b border-slate-200/80 px-6 bg-[#f0f4f8] overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`inline-flex items-center gap-1.5 py-3.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition whitespace-nowrap ${
                  activeTab === id
                    ? "border-teal-600 text-teal-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* ── Tab Body ──────────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-6">

            {/* ── OVERVIEW TAB ────────────────────────────────────────────── */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Bio */}
                <div className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-5 shadow-neu-inset-sm">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600 mb-2">
                    <BookOpen className="h-4 w-4 text-teal-600" />
                    <span>About</span>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {displayedProfile.bio || "No biography added yet."}
                  </p>
                </div>

                {/* ── Skill Exchange section ─────────────────────────────── */}
                {((displayedProfile.offering?.length ?? 0) > 0 || (displayedProfile.seeking?.length ?? 0) > 0) && (
                  <div className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-5 shadow-neu-inset-sm space-y-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600">
                      <Handshake className="h-4 w-4 text-teal-600" />
                      <span>Skill Exchange</span>
                    </div>

                    {(displayedProfile.offering?.length ?? 0) > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5 text-teal-600" />
                          <span className="text-xs font-bold text-teal-700 uppercase tracking-wide">Offering</span>
                          <span className="text-[10px] text-slate-500 font-medium">— can teach or share</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {displayedProfile.offering!.map((t) => (
                            <SkillTag key={t} label={t} variant="offering" />
                          ))}
                        </div>
                      </div>
                    )}

                    {(displayedProfile.seeking?.length ?? 0) > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5 text-amber-600" />
                          <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Seeking</span>
                          <span className="text-[10px] text-slate-500 font-medium">— wants to learn</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {displayedProfile.seeking!.map((t) => (
                            <SkillTag key={t} label={t} variant="seeking" />
                          ))}
                        </div>
                      </div>
                    )}

                    {!isOwnProfile && (
                      <button
                        onClick={handleSendMessage}
                        className="mt-2 inline-flex items-center gap-2 rounded-xl btn-bronze px-4 py-2 text-xs font-bold shadow-neu-raised-sm transition hover:scale-[1.01]"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>Propose a Skill Exchange</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Show prompt if own profile and no tags yet */}
                {isOwnProfile && (displayedProfile.offering?.length ?? 0) === 0 && (displayedProfile.seeking?.length ?? 0) === 0 && (
                  <button
                    onClick={() => setActiveTab("edit")}
                    className="w-full rounded-2xl border-2 border-dashed border-slate-200/80 bg-[#f0f4f8] p-5 text-center space-y-2 hover:border-teal-400 hover:bg-[#e6ecf2] transition group"
                  >
                    <Handshake className="mx-auto h-6 w-6 text-slate-400 group-hover:text-teal-600 transition" />
                    <p className="text-sm font-bold text-slate-700">Add your Skill Exchange tags</p>
                    <p className="text-xs text-slate-500 font-medium">
                      Let others know what hobbies you can teach and what you&apos;d love to learn.
                    </p>
                  </button>
                )}

                {/* XP Bar */}
                <div className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-5 shadow-neu-inset-sm">
                  <div className="flex items-center justify-between mb-3 text-xs font-bold">
                    <span className="uppercase tracking-wider text-teal-600">Phase Progress</span>
                    <span className="text-slate-800 font-bold">
                      {totalXP.toLocaleString()} / {xpNeeded.toLocaleString()} Progress Steps
                    </span>
                  </div>
                  <div className="h-3.5 w-full overflow-hidden rounded-full border border-slate-200/80 bg-[#e6ecf2] p-0.5 shadow-neu-inset-sm">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-500 transition-all duration-700"
                      style={{ width: `${xpPct}%` }}
                    />
                  </div>
                  <p className="mt-2 text-right text-xs text-slate-600 font-semibold">{xpPct}% progress toward Phase {displayedProfile.level + 1}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-5 flex items-center gap-4 shadow-neu-raised-sm">
                    <div className="h-12 w-12 rounded-xl bg-[#e6ecf2] border border-slate-200/80 flex items-center justify-center shrink-0 shadow-neu-inset-sm">
                      <Award className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-800">{completedCount}</p>
                      <p className="text-xs text-slate-500 font-bold uppercase">Explorations Done</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-5 flex items-center gap-4 shadow-neu-raised-sm">
                    <div className="h-12 w-12 rounded-xl bg-[#e6ecf2] border border-slate-200/80 flex items-center justify-center shrink-0 shadow-neu-inset-sm">
                      <Users className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-800">{connectionsCount}</p>
                      <p className="text-xs text-slate-500 font-bold uppercase">Connections</p>
                    </div>
                  </div>
                </div>

                {/* Recent posts preview */}
                {feed.length > 0 && (
                  <div className="rounded-2xl border border-slate-200/80 overflow-hidden bg-[#f0f4f8] shadow-neu-raised-sm">
                    <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200/80 bg-[#e6ecf2]">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal-600 flex items-center gap-1.5">
                        <Trophy className="h-4 w-4 text-teal-600" /> Recent Activity
                      </span>
                      <button
                        onClick={() => setActiveTab("quests")}
                        className="inline-flex items-center gap-1 text-xs text-teal-600 hover:text-teal-700 font-bold transition"
                      >
                        <span>View all ({feed.length})</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="divide-y divide-slate-200/80">
                      {feed.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#e6ecf2] transition">
                          <div className="h-12 w-12 rounded-xl overflow-hidden bg-[#e6ecf2] border border-slate-200/80 shrink-0 shadow-neu-inset-sm">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.questTitle} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <Trophy className="h-5 w-5 text-teal-600" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{item.questTitle}</p>
                            <p className="text-xs text-slate-500 font-medium">{timeAgo(item.createdAt)}</p>
                          </div>
                          <span className="rounded-lg border border-slate-200/80 bg-[#e6ecf2] px-2.5 py-0.5 text-xs font-bold text-teal-600 shrink-0 shadow-neu-inset-sm">
                            {item.badge}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── POSTS / ACTIVITY TAB ────────────────────────────────────── */}
            {activeTab === "quests" && (
              <div className="space-y-4">
                {feed.length === 0 ? (
                  <div className="py-16 text-center border-2 border-dashed border-slate-200/80 rounded-2xl space-y-2 bg-[#f0f4f8] shadow-neu-inset-sm">
                    <Trophy className="mx-auto h-8 w-8 text-teal-600" />
                    <p className="font-bold text-slate-800 text-base">No activity posted yet</p>
                    <p className="text-xs text-slate-600 max-w-xs mx-auto">
                      Project verifications and milestone achievements will appear here upon completion.
                    </p>
                  </div>
                ) : (
                  feed.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] overflow-hidden shadow-neu-raised-sm">
                      {/* Card header */}
                      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-slate-200/80 bg-[#e6ecf2]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="rounded-lg border border-slate-200/80 bg-[#f0f4f8] px-2.5 py-0.5 text-xs font-bold text-teal-600 shrink-0 shadow-neu-inset-sm">
                            {item.badge}
                          </span>
                          <p className="font-bold text-slate-800 text-sm truncate">{item.questTitle}</p>
                          {item.isCustom && (
                            <span className="rounded-lg border border-slate-200/80 bg-[#f0f4f8] px-2 py-0.5 text-[10px] font-semibold text-slate-600 shrink-0">
                              Custom Exploration
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-slate-500 font-medium">{timeAgo(item.createdAt)}</span>
                          {isOwnProfile && (
                            confirmDeleteId === item.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleDelete(item)}
                                  disabled={deletingId === item.id}
                                  className="inline-flex items-center gap-1 rounded-lg bg-red-600 border border-red-500 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-red-700 transition shadow-sm"
                                >
                                  {deletingId === item.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <AlertTriangle className="h-3 w-3" />}
                                  Confirm
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="rounded-lg border border-slate-200/80 bg-[#f0f4f8] px-2.5 py-1 text-[11px] text-slate-600 hover:bg-[#e6ecf2] transition shadow-neu-raised-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(item.id)}
                                className="rounded-lg p-1 text-slate-400 hover:text-red-600 hover:bg-[#e6ecf2] transition"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {/* Image */}
                      {item.imageUrl && (
                        <div className="border-b border-slate-200/80 bg-slate-900">
                          <img src={item.imageUrl} alt={item.questTitle} className="w-full h-56 object-cover" />
                        </div>
                      )}

                      {/* Caption/reflection */}
                      {item.caption && (
                        <div className="px-4 py-3 border-b border-slate-200/80 bg-[#e6ecf2]">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600 mb-1">Project Reflection</p>
                          <p className="text-sm text-slate-800 leading-relaxed font-medium">&ldquo;{item.caption}&rdquo;</p>
                        </div>
                      )}

                      {/* Applause & Comments row */}
                      <div className="px-4 py-3 flex items-center justify-between border-t border-slate-200/80 bg-[#e6ecf2]">
                        <button
                          type="button"
                          onClick={() => handleApplaud(item)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-[#f0f4f8] px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-[#e6ecf2] transition shadow-neu-raised-sm"
                        >
                          <Heart className="h-4 w-4 fill-teal-600 text-teal-600" />
                          <span>{item.applause} Appreciations</span>
                        </button>
                        <span className="text-xs font-bold text-slate-600">
                          {(item.comments ?? []).length} Comments
                        </span>
                      </div>

                      {/* Interactive Comments Section */}
                      <CommentsSection item={item} myProfile={myProfile} user={user} />
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── EDIT TAB — only rendered when isOwnProfile ──────────────── */}
            {activeTab === "edit" && isOwnProfile && (
              <form onSubmit={handleSave} className="space-y-6">
                {/* Avatar */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-teal-600">Profile Portrait</label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl border border-slate-200/80 bg-[#e6ecf2] overflow-hidden flex items-center justify-center shrink-0 shadow-neu-inset-sm">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <Camera className="h-6 w-6 text-teal-600" />
                      )}
                    </div>
                    <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl btn-bronze px-4 py-2.5 text-sm font-bold shadow-neu-raised transition hover:scale-[1.01]">
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                      <span>{uploading ? "Uploading Photo..." : "Upload Photo"}</span>
                      <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-teal-600">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition shadow-neu-inset-sm font-bold"
                    required
                  />
                </div>

                {/* Specialty chips */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-teal-600">Professional Specialty</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {CLASS_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setClassTitle(preset)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                          classTitle === preset
                            ? "btn-bronze shadow-neu-raised-sm"
                            : "bg-[#e6ecf2] border border-slate-200/80 text-slate-600 hover:bg-[#f0f4f8] hover:text-slate-900 shadow-neu-inset-sm"
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
                    placeholder="Or enter a custom specialty title..."
                    className="w-full rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition shadow-neu-inset-sm font-medium"
                  />
                </div>

                {/* Bio */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-teal-600">About / Bio</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={300}
                    placeholder="Share your background, key skills, hobbies, and learning goals..."
                    className="w-full resize-none rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500 transition leading-relaxed shadow-neu-inset-sm font-medium"
                  />
                  <p className="text-right text-[11px] text-slate-500 font-medium">{bio.length}/300</p>
                </div>

                {/* ── Skill Exchange section ─────────────────────────────── */}
                <div className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-5 shadow-neu-inset-sm space-y-5">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-600 border-b border-slate-200/80 pb-3">
                    <Handshake className="h-4 w-4 text-teal-600" />
                    <span>Skill Exchange</span>
                    <span className="text-[10px] text-slate-400 font-medium normal-case tracking-normal ml-1">— let others know what you can share or learn</span>
                  </div>

                  <TagEditor
                    label="🟢 Offering — Skills / Hobbies I Can Teach"
                    tags={offering}
                    onChange={setOffering}
                    variant="offering"
                    placeholder="e.g. Guitar, Watercolor, Python…"
                  />

                  <TagEditor
                    label="🟡 Seeking — Skills / Hobbies I Want to Learn"
                    tags={seeking}
                    onChange={setSeeking}
                    variant="seeking"
                    placeholder="e.g. Piano, Spanish, Chess…"
                  />
                </div>

                {/* Save button */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/80">
                  {saveSuccess && (
                    <span className="text-xs font-bold text-teal-600 flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-teal-600" /> Profile updated
                    </span>
                  )}
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="inline-flex items-center gap-2 rounded-xl btn-bronze px-6 py-2.5 text-sm font-bold transition shadow-neu-raised hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    <span>{saving ? "Saving..." : "Save Profile Changes"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Private chat slide-out — layered on top of profile modal */}
      <PrivateChat
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        initialPeer={
          !isOwnProfile
            ? { id: displayedProfile.id, name: displayedProfile.name, avatarUrl: displayedProfile.avatarUrl }
            : null
        }
      />
    </>
  );
}
