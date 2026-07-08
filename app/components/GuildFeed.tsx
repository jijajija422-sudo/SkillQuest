"use client";

import { useEffect, useState } from "react";
import { HandHeart, Clock, Loader2, Users, UserPlus, UserCheck, Trash2, AlertTriangle } from "lucide-react";
import type { GuildCompletion, UserProfile } from "@/lib/types";
import { isFirebaseConfigured, subscribeToFeed, applaudCompletion, fetchUserProfileDb, fetchPublicProfilesDb, deleteCompletion } from "@/lib/firebase";
import { subscribeLocalFeed, applaudLocal, deleteLocalCompletion } from "@/lib/feed-storage";
import { useAuth } from "@/lib/auth-context";
import ProfileModal from "./ProfileModal";

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface GuildFeedProps {
  compact?: boolean;
}

export default function GuildFeed({ compact = false }: GuildFeedProps) {
  const [items, setItems] = useState<GuildCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [applauding, setApplauding] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  const [communityHeroes, setCommunityHeroes] = useState<UserProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { user, profile: myProfile, login, followUser, unfollowUser } = useAuth();
  const userId = user ? user.uid : "guest";

  useEffect(() => {
    setLoading(true);
    if (isFirebaseConfigured()) {
      const unsub = subscribeToFeed((feed) => {
        setItems(feed);
        setLoading(false);
      });
      fetchPublicProfilesDb(8).then(profiles => {
        setCommunityHeroes(profiles);
      });
      return unsub;
    }
    const unsub = subscribeLocalFeed((feed) => {
      setItems(feed);
      setLoading(false);
    });
    return unsub;
  }, []);

  async function handleApplaud(item: GuildCompletion) {
    if (isFirebaseConfigured() && !user) {
      alert("Please sign in with Google to applaud achievements!");
      await login();
      return;
    }

    setApplauding(item.id);
    
    setItems((currentItems) =>
      currentItems.map((feedItem) =>
        feedItem.id === item.id
          ? {
              ...feedItem,
              applause: feedItem.applause + 1,
              applaudedBy: [...feedItem.applaudedBy, userId],
            }
          : feedItem
      )
    );

    try {
      if (isFirebaseConfigured()) {
        await applaudCompletion(item.id, userId);
      } else {
        await applaudLocal(item.id, userId);
      }
    } catch (error) {
      console.error("Failed to applaud completion:", error);
    } finally {
      setApplauding(null);
    }
  }

  async function handleDelete(item: GuildCompletion) {
    setDeletingId(item.id);
    setItems((currentItems) => currentItems.filter((feedItem) => feedItem.id !== item.id));
    try {
      if (isFirebaseConfigured()) {
        await deleteCompletion(item.id);
      } else {
        deleteLocalCompletion(item.id);
      }
    } catch (error) {
      console.error("Failed to delete completion:", error);
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  }

  async function handleOpenUser(itemUserName: string, itemUserId?: string) {
    let target: UserProfile | null = null;
    if (itemUserId && isFirebaseConfigured()) {
      target = await fetchUserProfileDb(itemUserId);
    }
    if (!target) {
      target = communityHeroes.find(p => p.name === itemUserName || p.id === itemUserId) || {
        id: itemUserId || `hero-${itemUserName}`,
        name: itemUserName,
        xp: 120,
        level: 2,
        completedQuests: [],
        bio: "Dedicated SkillQuest adventurer.",
        classTitle: "Guild Hero",
      };
    }
    setSelectedProfile(target);
    setModalOpen(true);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mb-3" />
        <p className="text-sm">Syncing live network feed…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-white/5 bg-white/5 p-6 text-center backdrop-blur-sm">
        <Users className="mx-auto h-8 w-8 text-slate-500" />
        <p className="mt-2 text-sm text-slate-400">No telemetry found. Be the first to verify a quest!</p>
      </div>
    );
  }

  const displayItems = compact ? items.slice(0, 3) : items;

  return (
    <>
      <ProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        targetProfile={selectedProfile}
      />
      <div className="space-y-6">
        {!compact && communityHeroes.length > 0 && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Users className="h-4 w-4" /> Discover Community Heroes
              </span>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {communityHeroes.map((hero) => {
                const isMe = hero.id === myProfile.id;
                const isFollowing = (myProfile.following || []).includes(hero.id);
                return (
                  <div
                    key={hero.id}
                    onClick={() => {
                      setSelectedProfile(hero);
                      setModalOpen(true);
                    }}
                    className="cursor-pointer shrink-0 rounded-2xl border border-white/10 bg-black/40 p-3 flex items-center gap-3 hover:border-cyan-500/50 transition w-52"
                  >
                    <div className="h-10 w-10 rounded-xl bg-slate-800 border border-cyan-400/50 overflow-hidden shrink-0 flex items-center justify-center font-bold text-sm bg-gradient-to-br from-cyan-600 to-indigo-800 text-white">
                      {hero.avatarUrl ? (
                        <img src={hero.avatarUrl} alt={hero.name} className="h-full w-full object-cover" />
                      ) : (
                        hero.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-white text-xs truncate">{hero.name}</p>
                      <p className="text-[10px] text-cyan-300 truncate">{hero.classTitle || "Paladin"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!compact && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium tracking-wide uppercase">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
            </span>
            Live Network Feed
          </div>
        )}

        {displayItems.map((item) => {
          const hasApplauded = item.applaudedBy.includes(userId);
          const canDelete =
            (item.userId && (item.userId === myProfile.id || (user && item.userId === user.uid))) ||
            (!item.userId && item.userName === myProfile.name);
          return (
            <article
              key={item.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl transition hover:bg-slate-800/40 shadow-[0_4px_20px_0_rgba(0,0,0,0.2)]"
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <button
                      type="button"
                      onClick={() => handleOpenUser(item.userName, item.userId)}
                      className="font-bold text-white hover:text-cyan-400 transition underline decoration-cyan-500/40 underline-offset-4"
                    >
                      {item.userName}
                    </button>
                    <p className="text-sm text-slate-300 mt-0.5">
                      completed <span className="font-semibold text-cyan-300">{item.questTitle}</span>
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <Clock className="h-3 w-3" />
                      {timeAgo(item.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="rounded-full bg-cyan-900/50 border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-300">
                      {item.badge}
                    </span>
                    {canDelete && (
                      confirmDeleteId === item.id ? (
                        <div className="flex items-center gap-1.5 animate-fadeIn">
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item.id}
                            className="inline-flex items-center gap-1 rounded-full bg-rose-600/90 border border-rose-400 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-rose-500 transition shadow-[0_0_12px_rgba(244,63,94,0.4)]"
                          >
                            {deletingId === item.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <AlertTriangle className="h-3 w-3" />}
                            <span>Confirm</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="rounded-full bg-white/10 border border-white/15 px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-white/20 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(item.id)}
                          title="Delete your post"
                          className="rounded-full bg-white/5 border border-white/10 p-1.5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/5 bg-slate-950">
                  <img
                    src={item.imageUrl}
                    alt={`${item.userName}'s proof`}
                    className="h-40 w-full object-cover opacity-90 transition hover:opacity-100"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      const fallbackSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'><rect width='400' height='240' fill='#020617'/><text x='200' y='120' font-family='ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace' font-size='18' fill='#22d3ee' text-anchor='middle' dominant-baseline='middle'>Proof unavailable</text></svg>`;
                      e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(fallbackSvg)}`;
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleApplaud(item)}
                  disabled={applauding === item.id}
                  className={`mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                    hasApplauded
                      ? "bg-fuchsia-900/40 border border-fuchsia-500/50 text-fuchsia-300 shadow-[0_0_10px_rgba(217,70,239,0.2)]"
                      : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {applauding === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin text-fuchsia-400" />
                  ) : (
                    <HandHeart className={`h-4 w-4 ${hasApplauded ? "fill-fuchsia-400" : ""}`} />
                  )}
                  {hasApplauded ? "Applauded" : "Applaud"} · {item.applause}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}