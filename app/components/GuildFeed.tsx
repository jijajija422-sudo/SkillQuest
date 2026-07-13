"use client";

import { useEffect, useRef, useState } from "react";
import {
  Heart, Clock, Loader2, Users, Trash2,
  MessageSquare, Send, ChevronDown, ChevronUp, X, ShieldAlert
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

export function CommentsSection({
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

  useEffect(() => { setComments(item.comments ?? []); }, [item.comments]);

  async function handleSubmit() {
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    const comment: GuildComment = {
      id: `cmt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userId: user?.uid ?? myProfile.id,
      userName: myProfile.name || "Member",
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
    <div className="border-t border-slate-200/80 bg-[#f0f4f8]/80 rounded-b-2xl">
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setTimeout(() => inputRef.current?.focus(), 100); }}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-teal-600 transition"
      >
        <span className="flex items-center gap-1.5">
          <MessageSquare className="h-3.5 w-3.5 text-teal-600" />
          {comments.length === 0 ? "Add Comment / Feedback..." : `${comments.length} comment${comments.length !== 1 ? "s" : ""}`}
        </span>
        {open ? <ChevronUp className="h-3.5 w-3.5 text-teal-600" /> : <ChevronDown className="h-3.5 w-3.5 text-teal-600" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {comments.length > 0 && (
            <div className="space-y-2">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2.5 group">
                  <div className="h-6 w-6 rounded-full shrink-0 bg-[#f0f4f8] border border-slate-200/80 flex items-center justify-center text-[10px] font-bold text-teal-600 overflow-hidden shadow-neu-raised-sm">
                    {c.avatarUrl ? (
                      <img src={c.avatarUrl} alt={c.userName} className="h-full w-full object-cover" />
                    ) : (
                      c.userName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0 rounded-xl bg-[#e6ecf2] border border-slate-200/80 px-3 py-2 shadow-neu-inset-sm">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-xs font-bold text-slate-800">{c.userName}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-400">{timeAgo(c.createdAt)}</span>
                        {canDeleteComment(c) && (
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(c.id)}
                            disabled={deletingCommentId === c.id}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition"
                          >
                            {deletingCommentId === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2 pt-1">
            <div className="h-6 w-6 rounded-full shrink-0 bg-[#f0f4f8] border border-slate-200/80 flex items-center justify-center text-[10px] font-bold text-teal-600 overflow-hidden shadow-neu-raised-sm">
              {myProfile.avatarUrl ? (
                <img src={myProfile.avatarUrl} alt={myProfile.name} className="h-full w-full object-cover" />
              ) : (
                (myProfile.name || "M").charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 flex items-end gap-2 rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-3 py-2 focus-within:ring-2 focus-within:ring-teal-500 transition shadow-neu-inset-sm">
              <textarea
                ref={inputRef}
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
                }}
                maxLength={300}
                placeholder="Share your thoughts or feedback..."
                className="flex-1 resize-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none leading-relaxed min-w-0"
                style={{ minHeight: 22 }}
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!text.trim() || submitting}
                className="shrink-0 rounded p-1 text-teal-600 hover:text-teal-700 disabled:text-slate-300 transition"
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

export default function GuildFeed({ compact = false }: GuildFeedProps) {
  const [items, setItems] = useState<GuildCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [applauding, setApplauding] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [communityHeroes, setCommunityHeroes] = useState<import("@/lib/types").UserProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<import("@/lib/types").UserProfile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { user, profile: myProfile, login } = useAuth();
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
      alert("Please sign in with Google to give kudos!");
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
        bio: "Dedicated SkillHub member.",
        classTitle: "SkillHub Pro",
      };
    }
    setSelectedProfile(target);
    setModalOpen(true);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500">
        <Loader2 className="h-7 w-7 animate-spin mb-3 text-teal-600" />
        <p className="text-sm font-semibold tracking-wider">Loading recent activity...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-8 text-center shadow-neu-inset-sm text-slate-800">
        <Users className="mx-auto h-8 w-8 text-teal-600" />
        <p className="mt-3 text-base font-bold text-slate-800">No Recent Activity Yet</p>
        <p className="mt-1 text-xs text-slate-500">Be the first to complete a skill exploration and share your verification.</p>
      </div>
    );
  }

  const displayItems = compact ? items.slice(0, 3) : items;

  return (
    <>
      <ProfileModal isOpen={modalOpen} onClose={() => setModalOpen(false)} targetProfile={selectedProfile} />
      <div className="space-y-6">
        {/* Community Heroes Scroll */}
        {!compact && communityHeroes.length > 0 && (
          <div className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-5 shadow-neu-raised-sm text-slate-800">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-3">Active Community Members</p>
            <div className="flex items-center gap-3 overflow-x-auto pb-1.5 scrollbar-none">
              {communityHeroes.map((hero) => (
                <div
                  key={hero.id}
                  onClick={() => { setSelectedProfile(hero); setModalOpen(true); }}
                  className="cursor-pointer shrink-0 rounded-xl border border-slate-200/80 bg-[#e6ecf2] p-3 flex items-center gap-3 hover:bg-[#f0f4f8] transition shadow-neu-inset-sm w-52"
                >
                  <div className="h-10 w-10 rounded-full border border-slate-200/80 bg-[#f0f4f8] overflow-hidden shrink-0 flex items-center justify-center font-bold text-sm text-teal-600 shadow-neu-raised-sm">
                    {hero.avatarUrl ? (
                      <img src={hero.avatarUrl} alt={hero.name} className="h-full w-full object-cover" />
                    ) : (
                      hero.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 text-xs truncate">{hero.name}</p>
                    <p className="text-[10px] font-medium text-slate-500 truncate">{hero.classTitle || "Member"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feed activity list */}
        {displayItems.map((item) => {
          const hasApplauded = item.applaudedBy.includes(userId);
          const canDelete =
            (item.userId && (item.userId === myProfile.id || (user && item.userId === user.uid))) ||
            (!item.userId && item.userName === myProfile.name);

          // Resolve badge asset path
          const badgeFile = (item.badge === "Masterclass" || item.badge === "Legendary") ? "badge-legendary.svg" :
                            (item.badge === "Advanced" || item.badge === "Platinum" || item.badge === "Epic") ? "badge-platinum.svg" :
                            (item.badge === "Adventurer" || item.badge === "Gold") ? "badge-gold.svg" :
                            (item.badge === "Journeyman" || item.badge === "Silver") ? "badge-silver.svg" :
                            "badge-bronze.svg";

          return (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-[#f0f4f8] shadow-neu-raised text-slate-800 transition"
            >
              {/* Post header */}
              <div className="p-4 sm:p-5 flex items-start justify-between gap-3 border-b border-slate-200/80 bg-[#f0f4f8]/50">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="shrink-0 mt-0.5">
                    <img src={`/assets/${badgeFile}`} alt={item.badge} className="h-10 w-10 sm:h-12 sm:w-12 object-contain drop-shadow" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleOpenUser(item.userName, item.userId)}
                        className="font-bold text-base text-slate-800 hover:text-teal-600 transition underline decoration-slate-300 underline-offset-4 truncate"
                      >
                        {item.userName}
                      </button>
                      <span className="text-xs text-slate-500">completed exploration</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold text-slate-800 mt-0.5">
                      {item.questTitle}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                      <Clock className="h-3 w-3" />
                      {timeAgo(item.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.isCustom && (
                    <span className="rounded-lg border border-slate-200/80 bg-[#e6ecf2] px-2 py-0.5 text-[10px] font-bold text-slate-600 shadow-neu-inset-sm">
                      Custom Skill
                    </span>
                  )}
                  <span className="rounded-lg border border-slate-200/80 bg-[#e6ecf2] px-2.5 py-1 text-xs font-bold text-slate-700 shadow-neu-inset-sm">
                    {item.badge}
                  </span>
                  {canDelete && (
                    confirmDeleteId === item.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={deletingId === item.id}
                          className="rounded-lg bg-red-600 border border-red-500 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-red-700 transition shadow-sm"
                        >
                          {deletingId === item.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="rounded-lg border border-slate-200/80 bg-[#e6ecf2] px-2 py-0.5 text-[11px] font-semibold text-slate-600 hover:bg-slate-200/50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="rounded p-1 text-slate-400 hover:text-red-600 hover:bg-slate-200/50 transition"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Reflection */}
              {item.caption && (
                <div className="mx-4 sm:mx-5 my-4 rounded-xl bg-[#e6ecf2] border border-slate-200/80 px-4 py-3 shadow-neu-inset-sm">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600 mb-1">Member Notes</p>
                  <p className="text-sm text-slate-700 leading-relaxed italic">&ldquo;{item.caption}&rdquo;</p>
                </div>
              )}

              {/* Proof image */}
              <div className="mx-4 sm:mx-5 mb-4 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-900 shadow-neu-inset-sm">
                <img
                  src={item.imageUrl}
                  alt={`${item.userName}'s verification`}
                  className="h-56 sm:h-64 w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'><rect width='400' height='240' fill='#1e293b'/><text x='200' y='120' font-family='sans-serif' font-size='14' fill='#94a3b8' text-anchor='middle' dominant-baseline='middle'>Image unavailable</text></svg>`;
                    e.currentTarget.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
                  }}
                />
              </div>

              {/* Like / Applause button */}
              <div className="px-4 sm:px-5 pb-3">
                <button
                  type="button"
                  onClick={() => handleApplaud(item)}
                  disabled={applauding === item.id}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-bold transition shadow-neu-raised-sm ${
                    hasApplauded
                      ? "btn-enamel"
                      : "border border-slate-200/80 bg-[#e6ecf2] text-slate-700 hover:bg-[#f0f4f8]"
                  }`}
                >
                  {applauding === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Heart className={`h-4 w-4 ${hasApplauded ? "fill-white text-white" : "text-teal-600"}`} />
                  )}
                  <span>{item.applause} Kudos</span>
                </button>
              </div>

              {/* Comments section */}
              <CommentsSection item={item} myProfile={myProfile} user={user} />
            </article>
          );
        })}
      </div>
    </>
  );
}