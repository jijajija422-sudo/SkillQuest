"use client";

import { useEffect, useRef, useState } from "react";
import {
  HandHeart, Clock, Loader2, Users, Trash2, AlertTriangle,
  MessageSquare, Send, ChevronDown, ChevronUp, X
} from "lucide-react";
import type { GuildCompletion, GuildComment } from "@/lib/types";
import {
  isFirebaseConfigured, subscribeToFeed, applaudCompletion,
  fetchUserProfileDb, fetchPublicProfilesDb, deleteCompletion,
  addComment, deleteComment
} from "@/lib/firebase";
import {
  subscribeLocalFeed, applaudLocal, deleteLocalCompletion,
  addCommentLocal, deleteCommentLocal
} from "@/lib/feed-storage";
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

interface GuildFeedProps { compact?: boolean; }

// ─── Comments section for a single post ───────────────────────────────────────
function CommentsSection({
  item,
  myProfile,
  user,
}: {
  item: GuildCompletion;
  myProfile: { id: string; name: string; avatarUrl?: string };
  user: { uid: string } | null;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [comments, setComments] = useState<GuildComment[]>(item.comments ?? []);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Keep in sync if parent re-renders with updated item
  useEffect(() => { setComments(item.comments ?? []); }, [item.comments]);

  async function handleSubmit() {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    const comment: GuildComment = {
      id: `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userId: user?.uid ?? myProfile.id,
      userName: myProfile.name || "Adventurer",
      avatarUrl: myProfile.avatarUrl,
      text: text.trim(),
      createdAt: Date.now(),
    };
    try {
      if (isFirebaseConfigured()) {
        await addComment(item.id, comment);
      } else {
        addCommentLocal(item.id, comment);
        setComments((c) => [...c, comment]);
      }
      setText("");
    } catch { /* ignore */ } finally { setSubmitting(false); }
  }

  async function handleDeleteComment(commentId: string) {
    setDeletingCommentId(commentId);
    try {
      if (isFirebaseConfigured()) {
        await deleteComment(item.id, commentId);
      } else {
        deleteCommentLocal(item.id, commentId);
        setComments((c) => c.filter((x) => x.id !== commentId));
      }
    } catch { /* ignore */ } finally { setDeletingCommentId(null); }
  }

  const canDeleteComment = (c: GuildComment) =>
    c.userId === (user?.uid ?? myProfile.id) ||
    c.userName === myProfile.name ||
    (item.userId && item.userId === (user?.uid ?? myProfile.id));

  return (
    <div className="border-t border-white/10">
      {/* Toggle bar */}
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setTimeout(() => inputRef.current?.focus(), 100); }}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition group"
      >
        <span className="flex items-center gap-1.5">
          <MessageSquare className="h-3.5 w-3.5 text-cyan-400" />
          {comments.length === 0 ? "Add a comment…" : `${comments.length} Comment${comments.length !== 1 ? "s" : ""}`}
        </span>
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {/* Existing comments */}
          {comments.length > 0 && (
            <div className="space-y-2.5">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-3 group">
                  {/* Avatar */}
                  <div className="h-7 w-7 rounded-xl shrink-0 bg-gradient-to-br from-cyan-600 to-indigo-700 border border-white/15 flex items-center justify-center text-xs font-black text-white overflow-hidden">
                    {c.avatarUrl ? (
                      <img src={c.avatarUrl} alt={c.userName} className="h-full w-full object-cover" />
                    ) : (
                      c.userName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0 rounded-2xl bg-white/5 border border-white/10 px-3.5 py-2.5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-xs font-black text-white">{c.userName}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-500">{timeAgo(c.createdAt)}</span>
                        {canDeleteComment(c) && (
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(c.id)}
                            disabled={deletingCommentId === c.id}
                            className="opacity-0 group-hover:opacity-100 rounded-full p-0.5 text-slate-500 hover:text-rose-400 transition"
                          >
                            {deletingCommentId === c.id
                              ? <Loader2 className="h-3 w-3 animate-spin" />
                              : <X className="h-3 w-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* New comment input */}
          <div className="flex items-end gap-2.5">
            <div className="h-7 w-7 rounded-xl shrink-0 bg-gradient-to-br from-cyan-600 to-indigo-700 border border-white/15 flex items-center justify-center text-xs font-black text-white overflow-hidden">
              {myProfile.avatarUrl ? (
                <img src={myProfile.avatarUrl} alt={myProfile.name} className="h-full w-full object-cover" />
              ) : (
                (myProfile.name || "A").charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 flex items-end gap-2 rounded-2xl border border-white/15 bg-black/40 px-3.5 py-2.5 focus-within:border-cyan-500/60 focus-within:bg-black/60 transition">
              <textarea
                ref={inputRef}
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
                }}
                maxLength={300}
                placeholder="Write a comment… (Enter to send)"
                className="flex-1 resize-none bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none leading-relaxed min-w-0"
                style={{ minHeight: 22 }}
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!text.trim() || submitting}
                className="shrink-0 rounded-full p-1.5 text-cyan-400 hover:text-cyan-300 disabled:text-slate-600 transition"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main GuildFeed ────────────────────────────────────────────────────────────
export default function GuildFeed({ compact = false }: GuildFeedProps) {
  const [items, setItems] = useState<GuildCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [applauding, setApplauding] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [communityHeroes, setCommunityHeroes] = useState<import("@/lib/types").UserProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<import("@/lib/types").UserProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { user, profile: myProfile, login, followUser, unfollowUser } = useAuth();
  const userId = user ? user.uid : "guest";

  useEffect(() => {
    setLoading(true);
    if (isFirebaseConfigured()) {
      const unsub = subscribeToFeed((feed) => { setItems(feed); setLoading(false); });
      fetchPublicProfilesDb(8).then(setCommunityHeroes);
      return unsub;
    }
    const unsub = subscribeLocalFeed((feed) => { setItems(feed); setLoading(false); });
    return unsub;
  }, []);

  async function handleApplaud(item: GuildCompletion) {
    if (isFirebaseConfigured() && !user) {
      alert("Please sign in with Google to applaud achievements!");
      await login();
      return;
    }
    setApplauding(item.id);
    setItems((cur) =>
      cur.map((f) =>
        f.id === item.id
          ? { ...f, applause: f.applause + 1, applaudedBy: [...f.applaudedBy, userId] }
          : f
      )
    );
    try {
      if (isFirebaseConfigured()) await applaudCompletion(item.id, userId);
      else await applaudLocal(item.id, userId);
    } catch { /* ignore */ } finally { setApplauding(null); }
  }

  async function handleDelete(item: GuildCompletion) {
    setDeletingId(item.id);
    setItems((cur) => cur.filter((f) => f.id !== item.id));
    try {
      if (isFirebaseConfigured()) await deleteCompletion(item.id);
      else deleteLocalCompletion(item.id);
    } catch { /* ignore */ } finally {
      setDeletingId(null); setConfirmDeleteId(null);
    }
  }

  async function handleOpenUser(itemUserName: string, itemUserId?: string) {
    let target: import("@/lib/types").UserProfile | null = null;
    if (itemUserId && isFirebaseConfigured()) target = await fetchUserProfileDb(itemUserId);
    if (!target) {
      target = communityHeroes.find((p) => p.name === itemUserName || p.id === itemUserId) || {
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
      <ProfileModal isOpen={modalOpen} onClose={() => setModalOpen(false)} targetProfile={selectedProfile} />
      <div className="space-y-6">
        {/* Community Heroes strip */}
        {!compact && communityHeroes.length > 0 && (
          <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
                <Users className="h-4 w-4" /> Discover Community Heroes
              </span>
            </div>
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {communityHeroes.map((hero) => (
                <div
                  key={hero.id}
                  onClick={() => { setSelectedProfile(hero); setModalOpen(true); }}
                  className="cursor-pointer shrink-0 rounded-2xl border border-white/10 bg-black/40 p-3 flex items-center gap-3 hover:border-cyan-500/50 transition w-52"
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-600 to-indigo-800 border border-cyan-400/50 overflow-hidden shrink-0 flex items-center justify-center font-bold text-sm text-white">
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
              ))}
            </div>
          </div>
        )}

        {/* Live badge */}
        {!compact && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-medium tracking-wide uppercase">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
            </span>
            Live Network Feed
          </div>
        )}

        {/* Feed items */}
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
              {/* Post header */}
              <div className="p-4 flex items-start justify-between gap-3">
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
                <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                  {item.isCustom && (
                    <span className="rounded-full bg-fuchsia-900/60 border border-fuchsia-500/40 px-2.5 py-1 text-[10px] font-black text-fuchsia-300 uppercase tracking-widest">
                      ✨ Custom
                    </span>
                  )}
                  <span className="rounded-full bg-cyan-900/50 border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-300">
                    {item.badge}
                  </span>
                  {canDelete && (
                    confirmDeleteId === item.id ? (
                      <div className="flex items-center gap-1.5">
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
                        className="rounded-full bg-white/5 border border-white/10 p-1.5 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/40 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Caption / reflection */}
              {item.caption && (
                <div className="mx-4 mb-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-fuchsia-400 mb-1">💬 Reflection</p>
                  <p className="text-sm text-slate-300 leading-relaxed italic">&ldquo;{item.caption}&rdquo;</p>
                </div>
              )}

              {/* Proof image */}
              <div className="mx-4 mb-4 relative overflow-hidden rounded-2xl border border-white/5 bg-slate-950">
                <img
                  src={item.imageUrl}
                  alt={`${item.userName}'s proof`}
                  className="h-48 w-full object-cover opacity-90 transition hover:opacity-100"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'><rect width='400' height='240' fill='#020617'/><text x='200' y='120' font-family='monospace' font-size='18' fill='#22d3ee' text-anchor='middle' dominant-baseline='middle'>Proof unavailable</text></svg>`;
                    e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
                  }}
                />
              </div>

              {/* Applaud button */}
              <div className="px-4 pb-1">
                <button
                  type="button"
                  onClick={() => handleApplaud(item)}
                  disabled={applauding === item.id}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-95 ${
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

              {/* ─── Comments section ─── */}
              <div className="mt-2">
                <CommentsSection item={item} myProfile={myProfile} user={user} />
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}