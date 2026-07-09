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
    <div className="border-t border-[#d8caa8] bg-[#fdfaf3]/80 rounded-b-xl">
      <button
        type="button"
        onClick={() => { setOpen((o) => !o); setTimeout(() => inputRef.current?.focus(), 100); }}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-[#6e5338] hover:text-[#3d2f21] transition"
      >
        <span className="flex items-center gap-1.5">
          <MessageSquare className="h-3.5 w-3.5 text-[#8c6239]" />
          {comments.length === 0 ? "Add Missive / Comment..." : `${comments.length} missive${comments.length !== 1 ? "s" : ""}`}
        </span>
        {open ? <ChevronUp className="h-3.5 w-3.5 text-[#8c6239]" /> : <ChevronDown className="h-3.5 w-3.5 text-[#8c6239]" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3">
          {comments.length > 0 && (
            <div className="space-y-2">
              {comments.map((c) => (
                <div key={c.id} className="flex items-start gap-2.5 group">
                  <div className="h-6 w-6 rounded-full shrink-0 bg-[#ebdcc0] border border-[#c1b087] flex items-center justify-center text-[10px] font-bold text-[#5c3a1a] overflow-hidden">
                    {c.avatarUrl ? (
                      <img src={c.avatarUrl} alt={c.userName} className="h-full w-full object-cover" />
                    ) : (
                      c.userName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0 rounded-lg bg-[#f4ecd8] border border-[#c1b087] px-3 py-2 shadow-sm">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-xs font-bold font-guild text-[#4a2e18]">{c.userName}</p>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-[#8c6239]">{timeAgo(c.createdAt)}</span>
                        {canDeleteComment(c) && (
                          <button
                            type="button"
                            onClick={() => handleDeleteComment(c.id)}
                            disabled={deletingCommentId === c.id}
                            className="opacity-0 group-hover:opacity-100 text-[#a87440] hover:text-red-700 transition"
                          >
                            {deletingCommentId === c.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-[#2b2118] leading-relaxed">{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2 pt-1">
            <div className="h-6 w-6 rounded-full shrink-0 bg-[#ebdcc0] border border-[#c1b087] flex items-center justify-center text-[10px] font-bold text-[#5c3a1a] overflow-hidden">
              {myProfile.avatarUrl ? (
                <img src={myProfile.avatarUrl} alt={myProfile.name} className="h-full w-full object-cover" />
              ) : (
                (myProfile.name || "A").charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 flex items-end gap-2 rounded-lg border border-[#8c6239] bg-[#fff8ea] px-3 py-2 focus-within:border-[#4a2e18] focus-within:ring-1 focus-within:ring-[#4a2e18] transition shadow-inner">
              <textarea
                ref={inputRef}
                rows={1}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
                }}
                maxLength={300}
                placeholder="Pen your thoughts or congratulations..."
                className="flex-1 resize-none bg-transparent text-sm text-[#2b2118] placeholder:text-[#9e886d] focus:outline-none leading-relaxed min-w-0"
                style={{ minHeight: 22 }}
              />
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!text.trim() || submitting}
                className="shrink-0 rounded p-1 text-[#8c6239] hover:text-[#4a2e18] disabled:text-[#d8caa8] transition"
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
      <div className="flex flex-col items-center justify-center py-12 text-[#c2b59b]">
        <Loader2 className="h-7 w-7 animate-spin mb-3 text-[#f5d77f]" />
        <p className="text-sm font-guild tracking-wider">Unrolling parchment scrolls...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border-2 border-[#8c6239] bg-parchment p-8 text-center shadow-lg text-[#2b2118]">
        <Users className="mx-auto h-8 w-8 text-[#8c6239]" />
        <p className="mt-3 text-base font-guild font-bold text-[#5c3a1a]">The Guild Chronicle is Quiet</p>
        <p className="mt-1 text-xs text-[#6e5338]">Be the first adventurer to complete a quest and etch your name into history.</p>
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
          <div className="rounded-xl border-2 border-[#8c6239] bg-parchment p-5 shadow-[0_6px_16px_rgba(0,0,0,0.5)] text-[#2b2118]">
            <p className="text-xs font-guild font-bold uppercase tracking-wider text-gold-stamped mb-3">Active Guild Heroes</p>
            <div className="flex items-center gap-3 overflow-x-auto pb-1.5 scrollbar-none">
              {communityHeroes.map((hero) => (
                <div
                  key={hero.id}
                  onClick={() => { setSelectedProfile(hero); setModalOpen(true); }}
                  className="cursor-pointer shrink-0 rounded-lg border border-[#c1b087] bg-[#fdfaf3] p-3 flex items-center gap-3 hover:bg-[#fff8ea] hover:border-[#8c6239] transition shadow-sm w-52"
                >
                  <div className="h-10 w-10 rounded-full border border-[#8c6239] bg-[#ebdcc0] overflow-hidden shrink-0 flex items-center justify-center font-guild font-bold text-sm text-[#4a2e18]">
                    {hero.avatarUrl ? (
                      <img src={hero.avatarUrl} alt={hero.name} className="h-full w-full object-cover" />
                    ) : (
                      hero.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold font-guild text-[#4a2e18] text-xs truncate">{hero.name}</p>
                    <p className="text-[10px] font-medium text-[#6e5338] truncate">{hero.classTitle || "Explorer"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feed parchment chronicles */}
        {displayItems.map((item) => {
          const hasApplauded = item.applaudedBy.includes(userId);
          const canDelete =
            (item.userId && (item.userId === myProfile.id || (user && item.userId === user.uid))) ||
            (!item.userId && item.userName === myProfile.name);

          // Resolve badge asset path
          const badgeFile = item.badge === "Platinum" ? "badge-platinum.svg" :
                            item.badge === "Gold" ? "badge-gold.svg" :
                            item.badge === "Silver" ? "badge-silver.svg" :
                            item.badge === "Bronze" ? "badge-bronze.svg" :
                            "badge-legendary.svg";

          return (
            <article
              key={item.id}
              className="overflow-hidden rounded-xl border-2 border-[#8c6239] bg-parchment shadow-[0_8px_20px_rgba(0,0,0,0.6)] text-[#2b2118] transition"
            >
              {/* Post header */}
              <div className="p-4 sm:p-5 flex items-start justify-between gap-3 border-b border-[#d8caa8]/60 bg-[#fcf8ed]/50">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="shrink-0 mt-0.5">
                    <img src={`/assets/${badgeFile}`} alt={item.badge} className="h-10 w-10 sm:h-12 sm:w-12 object-contain drop-shadow" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => handleOpenUser(item.userName, item.userId)}
                        className="font-guild font-bold text-base text-[#4a2e18] hover:text-[#8c6239] transition underline decoration-[#c1b087] underline-offset-4 truncate"
                      >
                        {item.userName}
                      </button>
                      <span className="text-xs text-[#6e5338]">completed quest</span>
                    </div>
                    <p className="text-sm sm:text-base font-bold font-guild text-[#1c3829] mt-0.5">
                      {item.questTitle}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-[#8c6239]">
                      <Clock className="h-3 w-3" />
                      {timeAgo(item.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.isCustom && (
                    <span className="rounded border border-[#c1b087] bg-[#ebdcc0] px-2 py-0.5 text-[10px] font-guild font-semibold text-[#5c3a1a]">
                      Custom Quest
                    </span>
                  )}
                  <span className="rounded border border-[#8c6239] bg-[#fff8ea] px-2.5 py-1 text-xs font-guild font-bold text-[#6d4620] shadow-sm">
                    {item.badge}
                  </span>
                  {canDelete && (
                    confirmDeleteId === item.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDelete(item)}
                          disabled={deletingId === item.id}
                          className="rounded bg-red-800 border border-red-600 px-2 py-0.5 text-[11px] font-semibold text-white hover:bg-red-700 transition shadow-sm"
                        >
                          {deletingId === item.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="rounded border border-[#c1b087] bg-[#ebdcc0] px-2 py-0.5 text-[11px] font-semibold text-[#5c3a1a] hover:bg-[#dcd0b3] transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(item.id)}
                        className="rounded p-1 text-[#a87440] hover:text-red-700 hover:bg-[#ebdcc0] transition"
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
                <div className="mx-4 sm:mx-5 my-4 rounded-lg bg-[#fdfaf3] border border-[#c1b087] px-4 py-3 shadow-inner">
                  <p className="text-[10px] font-guild font-bold uppercase tracking-wider text-[#8c6239] mb-1">Adventurer&apos;s Reflection</p>
                  <p className="text-sm text-[#2b2118] leading-relaxed font-serif italic">&ldquo;{item.caption}&rdquo;</p>
                </div>
              )}

              {/* Proof image */}
              <div className="mx-4 sm:mx-5 mb-4 overflow-hidden rounded-lg border-2 border-[#8c6239] bg-[#24160d] shadow-md">
                <img
                  src={item.imageUrl}
                  alt={`${item.userName}'s proof`}
                  className="h-56 sm:h-64 w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'><rect width='400' height='240' fill='#24160d'/><text x='200' y='120' font-family='Cinzel,serif' font-size='14' fill='#c1b087' text-anchor='middle' dominant-baseline='middle'>Illustration lost in transit</text></svg>`;
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
                  className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs sm:text-sm font-guild font-bold transition shadow-sm ${
                    hasApplauded
                      ? "btn-enamel"
                      : "border border-[#8c6239] bg-[#ebdcc0] text-[#4a2e18] hover:bg-[#decda8]"
                  }`}
                >
                  {applauding === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Heart className={`h-4 w-4 ${hasApplauded ? "fill-[#eafee8] text-[#eafee8]" : "text-[#8c6239]"}`} />
                  )}
                  <span>{item.applause} Prestige Applause</span>
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