"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  X, Send, MessageSquare, ChevronLeft, User, Circle,
} from "lucide-react";
import type { MessageThread, PrivateMessage } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";

interface PrivateChatProps {
  isOpen: boolean;
  onClose: () => void;
  /** If provided, open directly to a thread with this peer */
  initialPeer?: { id: string; name: string; avatarUrl?: string } | null;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Local message store (in-memory, survives modal open/close) ──────────────
// In a production app this would be backed by Firebase / WebSockets
const threadStore: Record<string, MessageThread> = {};

function getOrCreateThread(
  peerId: string,
  peerName: string,
  peerAvatar?: string,
): MessageThread {
  if (!threadStore[peerId]) {
    threadStore[peerId] = { peerId, peerName, peerAvatar, messages: [] };
  }
  return threadStore[peerId];
}

// ─── Avatar helper ────────────────────────────────────────────────────────────
function Avatar({
  name,
  avatarUrl,
  size = "md",
}: {
  name: string;
  avatarUrl?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dims =
    size === "sm" ? "h-8 w-8 text-xs" : size === "lg" ? "h-12 w-12 text-lg" : "h-10 w-10 text-sm";
  return (
    <div
      className={`${dims} rounded-xl border border-slate-200/80 bg-[#e6ecf2] overflow-hidden flex items-center justify-center font-bold text-slate-800 shadow-neu-inset-sm shrink-0`}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{name?.charAt(0).toUpperCase() || "?"}</span>
      )}
    </div>
  );
}

// ─── Single message bubble ────────────────────────────────────────────────────
function MessageBubble({ msg, isMine }: { msg: PrivateMessage; isMine: boolean }) {
  return (
    <div className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
      <Avatar name={msg.fromName} avatarUrl={msg.fromAvatar} size="sm" />
      <div className={`max-w-[72%] space-y-1 ${isMine ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm font-medium leading-relaxed ${
            isMine
              ? "bg-teal-600 text-white rounded-br-sm shadow-md"
              : "bg-[#f0f4f8] border border-slate-200/80 text-slate-800 shadow-neu-raised-sm rounded-bl-sm"
          }`}
        >
          {msg.text}
        </div>
        <span className="text-[10px] text-slate-400 font-medium px-1">{timeAgo(msg.createdAt)}</span>
      </div>
    </div>
  );
}

// ─── Thread view ──────────────────────────────────────────────────────────────
function ThreadView({
  thread,
  myId,
  myName,
  myAvatar,
  onBack,
}: {
  thread: MessageThread;
  myId: string;
  myName: string;
  myAvatar?: string;
  onBack: () => void;
}) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<PrivateMessage[]>(thread.messages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    const msg: PrivateMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      fromId: myId,
      fromName: myName,
      fromAvatar: myAvatar,
      text: trimmed,
      createdAt: Date.now(),
    };
    threadStore[thread.peerId].messages.push(msg);
    setMessages([...threadStore[thread.peerId].messages]);
    setText("");
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Thread header */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3.5 border-b border-slate-200/80 bg-[#f0f4f8]">
        <button
          onClick={onBack}
          className="rounded-xl border border-slate-200/80 p-1.5 text-slate-500 hover:bg-[#e6ecf2] hover:text-slate-800 transition shadow-neu-raised-sm"
          aria-label="Back to inbox"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <Avatar name={thread.peerName} avatarUrl={thread.peerAvatar} size="sm" />
        <div className="min-w-0">
          <p className="font-bold text-slate-800 text-sm truncate">{thread.peerName}</p>
          <div className="flex items-center gap-1">
            <Circle className="h-2 w-2 fill-teal-500 text-teal-500" />
            <span className="text-[10px] text-teal-600 font-bold">Active</span>
          </div>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-[#e6ecf2]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-12">
            <div className="h-14 w-14 rounded-2xl bg-[#f0f4f8] border border-slate-200/80 flex items-center justify-center shadow-neu-inset-sm">
              <MessageSquare className="h-6 w-6 text-teal-600" />
            </div>
            <p className="font-bold text-slate-800 text-sm">Start the conversation!</p>
            <p className="text-xs text-slate-500 max-w-xs font-medium">
              Introduce yourself, ask about their hobbies, or propose a skill exchange.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} isMine={msg.fromId === myId} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="shrink-0 px-4 py-3 border-t border-slate-200/80 bg-[#f0f4f8]">
        <div className="flex items-end gap-2.5">
          <textarea
            ref={inputRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send)"
            className="flex-1 resize-none rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition shadow-neu-inset-sm font-medium leading-relaxed"
            style={{ maxHeight: 96 }}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="shrink-0 rounded-xl btn-bronze p-2.5 font-bold shadow-neu-raised-sm transition hover:scale-[1.04] disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 font-medium text-center">
          Shift+Enter for a new line · Enter to send
        </p>
      </div>
    </div>
  );
}

// ─── Inbox list view ──────────────────────────────────────────────────────────
function InboxView({
  threads,
  myId,
  onSelectThread,
}: {
  threads: MessageThread[];
  myId: string;
  onSelectThread: (t: MessageThread) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 px-5 py-4 border-b border-slate-200/80 bg-[#f0f4f8]">
        <p className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-0.5">Messages</p>
        <h3 className="text-lg font-bold text-slate-800">Inbox</h3>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#e6ecf2]">
        {threads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-3 py-12 px-6">
            <div className="h-14 w-14 rounded-2xl bg-[#f0f4f8] border border-slate-200/80 flex items-center justify-center shadow-neu-inset-sm">
              <User className="h-6 w-6 text-teal-600" />
            </div>
            <p className="font-bold text-slate-800 text-sm">No messages yet</p>
            <p className="text-xs text-slate-500 max-w-xs font-medium leading-relaxed">
              Visit a member&apos;s profile and hit <strong>Send Message</strong> to start a conversation about hobbies or skill exchange!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/80">
            {threads.map((thread) => {
              const last = thread.messages[thread.messages.length - 1];
              return (
                <button
                  key={thread.peerId}
                  onClick={() => onSelectThread(thread)}
                  className="w-full flex items-center gap-3.5 px-5 py-4 hover:bg-[#f0f4f8] transition text-left"
                >
                  <Avatar name={thread.peerName} avatarUrl={thread.peerAvatar} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{thread.peerName}</p>
                    <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
                      {last
                        ? `${last.fromId === myId ? "You: " : ""}${last.text}`
                        : "Start the conversation…"}
                    </p>
                  </div>
                  {last && (
                    <span className="text-[10px] text-slate-400 font-medium shrink-0">
                      {timeAgo(last.createdAt)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main PrivateChat modal ───────────────────────────────────────────────────
export default function PrivateChat({ isOpen, onClose, initialPeer }: PrivateChatProps) {
  const { profile: myProfile } = useAuth();
  const [activeThread, setActiveThread] = useState<MessageThread | null>(null);
  const [, forceUpdate] = useState(0);

  // When a peer is passed in (via Send Message button), jump straight to that thread
  useEffect(() => {
    if (!isOpen) return;
    if (initialPeer) {
      const thread = getOrCreateThread(initialPeer.id, initialPeer.name, initialPeer.avatarUrl);
      setActiveThread(thread);
    } else {
      setActiveThread(null);
    }
  }, [isOpen, initialPeer]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (activeThread) setActiveThread(null);
        else onClose();
      }
    }
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, activeThread, onClose]);

  if (!isOpen) return null;

  const threads = Object.values(threadStore);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Slide-out panel from the right */}
      <aside
        className="fixed right-0 top-0 bottom-0 z-[70] flex flex-col w-full max-w-sm border-l border-slate-200/80 bg-[#e6ecf2] shadow-neu-raised-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Private messages"
      >
        {/* Panel header */}
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-slate-200/80 bg-[#f0f4f8] shadow-neu-inset-sm">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-teal-600" />
            <span className="text-sm font-bold text-slate-800">Private Messages</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200/80 p-1.5 text-slate-500 hover:bg-[#e6ecf2] hover:text-slate-800 transition shadow-neu-raised-sm"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body: inbox or thread */}
        <div className="flex-1 overflow-hidden">
          {activeThread ? (
            <ThreadView
              thread={activeThread}
              myId={myProfile.id}
              myName={myProfile.name || "Member"}
              myAvatar={myProfile.avatarUrl}
              onBack={() => {
                setActiveThread(null);
                forceUpdate((n) => n + 1);
              }}
            />
          ) : (
            <InboxView
              threads={threads}
              myId={myProfile.id}
              onSelectThread={(t) => setActiveThread(t)}
            />
          )}
        </div>
      </aside>
    </>
  );
}

// Export the helper so ProfileModal can create/open a thread directly
export { getOrCreateThread };
