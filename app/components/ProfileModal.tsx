"use client";

import React, { useState, useEffect } from "react";
import { X, Camera, Sparkles, Trophy, Users, UserCheck, UserPlus, Shield, Edit3, Image as ImageIcon, Check, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { uploadImage } from "@/lib/upload";
import { subscribeToFeed } from "@/lib/firebase";
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
];

export default function ProfileModal({ isOpen, onClose, targetProfile }: ProfileModalProps) {
  const { profile: myProfile, updateProfileDetails, followUser, unfollowUser } = useAuth();
  
  const isOwnProfile = !targetProfile || targetProfile.id === myProfile.id || targetProfile.id === "guest";
  const displayedProfile = isOwnProfile ? myProfile : targetProfile;

  const [activeTab, setActiveTab] = useState<"overview" | "edit" | "feed">("overview");
  const [feed, setFeed] = useState<GuildCompletion[]>([]);

  // Editing state
  const [name, setName] = useState(displayedProfile.name || "");
  const [bio, setBio] = useState(displayedProfile.bio || "");
  const [classTitle, setClassTitle] = useState(displayedProfile.classTitle || "Fullstack Paladin");
  const [avatarUrl, setAvatarUrl] = useState(displayedProfile.avatarUrl || "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (displayedProfile) {
      setName(displayedProfile.name || "");
      setBio(displayedProfile.bio || "Exploring the digital realm and mastering new quests.");
      setClassTitle(displayedProfile.classTitle || "Fullstack Paladin");
      setAvatarUrl(displayedProfile.avatarUrl || "");
    }
  }, [displayedProfile, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const unsub = subscribeToFeed((allCompletions) => {
      const userCompletions = allCompletions.filter(
        (c) => c.userName === displayedProfile.name || (c as any).userId === displayedProfile.id
      );
      setFeed(userCompletions);
    });
    return () => unsub();
  }, [isOpen, displayedProfile]);

  if (!isOpen || !displayedProfile) return null;

  const isFollowing = (myProfile.following || []).includes(displayedProfile.id);
  const followersCount = (displayedProfile.followers || []).length + (isFollowing && !isOwnProfile && !(displayedProfile.followers || []).includes(myProfile.id) ? 1 : 0);
  const followingCount = (displayedProfile.following || []).length;
  const xpNeeded = xpForLevel(displayedProfile.level);
  const xpPct = Math.min(100, Math.round((displayedProfile.xp / xpNeeded) * 100));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setAvatarUrl(url);
    } catch (err) {
      console.error("Failed to upload avatar:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfileDetails({
      name: name.trim() || "Adventurer",
      bio: bio.trim(),
      classTitle,
      avatarUrl,
    });
    setSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleFollowToggle = async () => {
    if (isFollowing) {
      await unfollowUser(displayedProfile.id);
    } else {
      await followUser(displayedProfile.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2.5rem] border border-cyan-500/30 bg-slate-900 shadow-[0_0_50px_rgba(6,182,212,0.2)] text-white">
        
        {/* Header Banner */}
        <div className="relative h-32 bg-gradient-to-r from-cyan-900 via-indigo-950 to-fuchsia-950 p-6 flex items-end justify-between border-b border-white/10">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-full bg-black/40 p-2 text-slate-300 hover:bg-black/60 hover:text-white transition border border-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Avatar & Title Row */}
        <div className="px-4 sm:px-8 -mt-10 sm:-mt-12 flex flex-wrap items-end justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-5">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-3xl border-2 border-cyan-400/80 bg-slate-800 shadow-xl overflow-hidden flex items-center justify-center text-2xl sm:text-3xl font-bold bg-gradient-to-br from-cyan-600 to-indigo-800 shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt={displayedProfile.name} className="h-full w-full object-cover" />
              ) : (
                <span>{displayedProfile.name.charAt(0).toUpperCase()}</span>
              )}
              <span className="absolute bottom-1 right-1 rounded-lg bg-black/80 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-black text-cyan-300 border border-cyan-500/40">
                Lvl {displayedProfile.level}
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">{displayedProfile.name}</h2>
                <span className="rounded-full bg-cyan-950/80 border border-cyan-500/30 px-2.5 sm:px-3 py-0.5 text-xs font-semibold text-cyan-300">
                  {displayedProfile.classTitle || "Fullstack Paladin"}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">{titleForLevel(displayedProfile.level)}</p>
            </div>
          </div>

          {!isOwnProfile && (
            <button
              onClick={handleFollowToggle}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold transition shadow-md shrink-0 ${
                isFollowing
                  ? "border border-white/20 bg-white/5 text-slate-300 hover:bg-white/10"
                  : "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500 shadow-cyan-500/25"
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="h-4 w-4 text-emerald-400" />
                  <span>Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4" />
                  <span>Follow</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto scrollbar-none border-b border-white/10 px-3 sm:px-8 bg-slate-950/40">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition ${
              activeTab === "overview" ? "border-cyan-400 text-cyan-300" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("feed")}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition ${
              activeTab === "feed" ? "border-cyan-400 text-cyan-300" : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            Personal Feed ({feed.length})
          </button>
          {isOwnProfile && (
            <button
              onClick={() => setActiveTab("edit")}
              className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition flex items-center gap-1.5 sm:gap-2 ${
                activeTab === "edit" ? "border-cyan-400 text-cyan-300" : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Bio Card */}
              <div className="rounded-2xl border border-white/5 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80 mb-2">About Hero</p>
                <p className="text-sm leading-relaxed text-slate-300 italic">
                  &ldquo;{displayedProfile.bio || "Exploring the digital realm and mastering new quests."}&rdquo;
                </p>
              </div>

              {/* Social Stats Row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl border border-white/5 bg-black/30 p-4 text-center">
                  <p className="text-2xl font-black text-cyan-400">{followersCount}</p>
                  <p className="text-xs uppercase tracking-wider text-slate-400 mt-1">Followers</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-black/30 p-4 text-center">
                  <p className="text-2xl font-black text-fuchsia-400">{followingCount}</p>
                  <p className="text-xs uppercase tracking-wider text-slate-400 mt-1">Following</p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-black/30 p-4 text-center">
                  <p className="text-2xl font-black text-emerald-400">{displayedProfile.completedQuests.length}</p>
                  <p className="text-xs uppercase tracking-wider text-slate-400 mt-1">Quests Won</p>
                </div>
              </div>

              {/* XP Progress Card */}
              <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 to-indigo-950/40 p-6">
                <div className="flex items-center justify-between text-sm font-semibold mb-3">
                  <span className="text-slate-300 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    <span>Level {displayedProfile.level} Progression</span>
                  </span>
                  <span className="text-cyan-300">
                    {displayedProfile.xp.toLocaleString()} / {xpNeeded.toLocaleString()} XP
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-800 border border-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 transition-all duration-700"
                    style={{ width: `${xpPct}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "feed" && (
            <div className="space-y-4">
              {feed.length === 0 ? (
                <div className="py-12 text-center text-slate-400 border border-dashed border-white/10 rounded-3xl">
                  <Trophy className="mx-auto h-8 w-8 text-slate-600 mb-3" />
                  <p className="font-semibold text-white">No quests broadcasted yet.</p>
                  <p className="text-xs text-slate-500 mt-1">Completed quests with proof pictures will appear right here!</p>
                </div>
              ) : (
                feed.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-white/10 bg-black/40 p-4 flex items-start gap-4">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.questTitle} className="h-16 w-16 rounded-xl object-cover border border-white/10 shrink-0" />
                    ) : (
                      <div className="h-16 w-16 rounded-xl bg-cyan-950/50 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                        <Trophy className="h-6 w-6" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-white text-sm truncate">{item.questTitle}</p>
                        <span className="rounded-full bg-cyan-950 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                          +{item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Completed by {item.userName}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-fuchsia-400 font-semibold">
                        <span>👏 {item.applause || 0} Applause</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "edit" && isOwnProfile && (
            <form onSubmit={handleSave} className="space-y-6">
              {/* Avatar Upload Field */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl border border-cyan-500/40 bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <Camera className="h-6 w-6 text-slate-500" />
                    )}
                  </div>
                  <label className="cursor-pointer rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 transition flex items-center gap-2">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin text-cyan-400" /> : <ImageIcon className="h-4 w-4 text-cyan-400" />}
                    <span>{uploading ? "Uploading to Cloudinary…" : "Upload New Picture"}</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Hero Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Hero Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              {/* Class Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Class Specialty
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                  {CLASS_PRESETS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setClassTitle(preset)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition border ${
                        classTitle === preset
                          ? "bg-cyan-600/40 border-cyan-400 text-white"
                          : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
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
                  placeholder="Custom title…"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Adventurer Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell the guild about your questing philosophy…"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>

              {/* Save Controls */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {saveSuccess && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <Check className="h-4 w-4" /> Saved!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:from-cyan-400 hover:to-indigo-500 transition shadow-lg shadow-cyan-500/25 disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
