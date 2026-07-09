"use client";

import { useState } from "react";
import Link from "next/link";
import ProfileModal from "./ProfileModal";
import ShareModal from "./ShareModal";
import { Mail, LogIn, LogOut, User as UserIcon, Shield, PenLine, BookOpen, Share2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const { user, profile, login, logout } = useAuth();

  function submitContact(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const name = fd.get("name");
    const email = fd.get("email");
    const message = fd.get("message");
    try {
      localStorage.setItem("lastContact", JSON.stringify({ name, email, message }));
    } catch (err) {}
    setOpen(false);
    alert("Thanks! Missive saved locally.");
  }

  const displayAvatar = profile.avatarUrl || user?.photoURL;

  function triggerCustomQuestModal() {
    window.dispatchEvent(new CustomEvent("open-custom-quest-modal"));
  }

  return (
    <>
      <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />
      <header className="sticky top-0 z-40 w-full border-b-2 border-[#d4af37]/40 bg-[#162a1e] shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
        <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 md:px-8 lg:px-12">
          <div className="flex w-full items-center justify-between gap-3 sm:gap-4">
            <Link href="/" className="flex items-center gap-3 shrink-0 min-w-0 hover:opacity-95 transition">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#f5d77f] via-[#d4af37] to-[#8c6239] border border-[#fff1aa] text-[#122017] font-guild font-black text-sm shadow-[0_2px_4px_rgba(0,0,0,0.6)] shrink-0">
                <Shield className="h-5 w-5 fill-[#122017] text-[#122017]" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-bold tracking-wide text-gold-etched leading-tight truncate">SkillQuest</p>
                <p className="text-[11px] font-medium text-[#c2b59b] hidden xs:block truncate">Adventurer&apos;s Guild Registry</p>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Link
                href="/guide"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#d4af37]/60 bg-[#1c3829] px-3.5 py-1.5 text-xs sm:text-sm font-guild font-bold text-[#f5d77f] hover:bg-[#234935] hover:scale-[1.02] transition shrink-0 shadow-sm"
                title="Newcomer's Walkthrough & Guild Handbook"
              >
                <BookOpen className="h-4 w-4 text-[#f5d77f]" />
                <span>Handbook</span>
              </Link>

              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#d4af37]/60 bg-[#1b3626] px-3.5 py-1.5 text-xs sm:text-sm font-guild font-bold text-[#eafee8] hover:bg-[#234935] hover:scale-[1.02] transition shrink-0 shadow-sm"
                title="Share Guild Registry & Invite Comrades"
              >
                <Share2 className="h-4 w-4 text-[#f5d77f]" />
                <span>Share</span>
              </button>

              <div className="hidden md:block">
                <button
                  type="button"
                  onClick={triggerCustomQuestModal}
                  className="inline-flex items-center gap-2 rounded-lg btn-bronze px-4 py-1.5 text-xs sm:text-sm font-guild font-bold shadow-md hover:scale-[1.02] transition"
                  title="Post your own accomplishment with bio & reflection"
                >
                  <PenLine className="h-4 w-4 text-[#f5d77f]" />
                  <span>Post Custom Deed</span>
                </button>
              </div>

              {/* Profile Pill */}
              <div className="flex items-center gap-1.5 sm:gap-2 border border-[#d4af37]/40 bg-[#1b3626] rounded-full pl-2 pr-1.5 py-1 sm:pl-3 sm:pr-2 sm:py-1.5 shrink-0 max-w-[170px] sm:max-w-none shadow-inner">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(true)}
                  className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition text-left min-w-0"
                >
                  {displayAvatar ? (
                    <img src={displayAvatar} alt={profile.name} className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-cover border border-[#d4af37] shrink-0" />
                  ) : (
                    <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-[#8c6239] border border-[#f5d77f] flex items-center justify-center text-[10px] sm:text-xs font-bold text-[#fff8ea] shrink-0">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline text-sm font-semibold text-[#f4ecd8] max-w-[100px] truncate">{profile.name}</span>
                  <span className="text-[10px] sm:text-xs bg-gradient-to-b from-[#d4af37] to-[#8c6239] text-[#122017] px-2 py-0.5 rounded-full font-guild font-bold shrink-0 shadow-sm">Lvl {profile.level}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(true)}
                  title="View / Edit Profile"
                  className="rounded-full p-1 text-[#c2b59b] hover:text-[#f5d77f] transition shrink-0"
                >
                  <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              {/* Log In / Log Out */}
              {user ? (
                <button
                  type="button"
                  onClick={logout}
                  title="Sign Out"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#d4af37]/40 bg-[#1c3829] px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-sm font-semibold text-[#c2b59b] hover:bg-[#234935] hover:text-[#f4ecd8] transition shrink-0"
                >
                  <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#d4af37]" />
                  <span className="hidden sm:inline">Depart</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={login}
                  className="inline-flex items-center gap-1.5 rounded-lg btn-enamel px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-guild tracking-wide shrink-0"
                >
                  <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span>Enter Guild</span>
                </button>
              )}

              <button
                onClick={() => setOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-[#d4af37]/40 bg-[#1c3829] px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#eddcc4] hover:bg-[#234935] transition shrink-0"
              >
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-[#d4af37]" />
                <span>Dispatch</span>
              </button>
            </div>
          </div>

          {/* Mobile bottom action bar */}
          <div className="flex md:hidden w-full items-center justify-between gap-1.5 mt-2.5 pt-2.5 border-t border-[#d4af37]/20">
            <Link
              href="/guide"
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#d4af37]/60 bg-[#1c3829] px-2.5 py-2 text-xs font-guild font-bold text-[#f5d77f] hover:bg-[#234935] shrink-0 shadow-sm"
              title="Guild Handbook"
            >
              <BookOpen className="h-3.5 w-3.5 text-[#f5d77f]" />
              <span className="hidden xs:inline">Guide</span>
            </Link>
            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#d4af37]/60 bg-[#1b3626] px-2.5 py-2 text-xs font-guild font-bold text-[#eafee8] hover:bg-[#234935] shrink-0 shadow-sm"
              title="Share Registry"
            >
              <Share2 className="h-3.5 w-3.5 text-[#f5d77f]" />
              <span>Share</span>
            </button>
            <button
              type="button"
              onClick={triggerCustomQuestModal}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg btn-bronze px-3 py-2 text-xs font-guild font-bold shadow-sm"
            >
              <PenLine className="h-4 w-4 text-[#f5d77f]" />
              <span>Post Custom Deed & Reflection</span>
            </button>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#d4af37]/40 bg-[#1c3829] px-3.5 py-2 text-xs font-semibold text-[#eddcc4] hover:bg-[#234935] transition shrink-0"
            >
              <Mail className="h-3.5 w-3.5 shrink-0 text-[#d4af37]" />
              <span>Dispatch</span>
            </button>
          </div>
        </div>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="mx-4 w-full max-w-md rounded-xl bg-parchment border-2 border-[#8c6239] p-8 shadow-[0_12px_32px_rgba(0,0,0,0.8)] text-[#2b2118]">
              <h3 className="text-xl font-bold font-guild text-[#5c3a1a]">Dispatch Courier to Guildmasters</h3>
              <p className="text-xs text-[#6e5338] mt-1">Send a missive or inquiry to the guild administrative council.</p>
              <form onSubmit={submitContact} className="mt-6 grid gap-4">
                <input
                  name="name"
                  placeholder="Your Adventurer Name"
                  className="w-full rounded-lg border border-[#c1b087] bg-[#fdfaf3] px-4 py-3 text-[#2b2118] placeholder:text-[#9e886d] focus:outline-none focus:ring-2 focus:ring-[#8c6239]"
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Pigeon / Email Address"
                  className="w-full rounded-lg border border-[#c1b087] bg-[#fdfaf3] px-4 py-3 text-[#2b2118] placeholder:text-[#9e886d] focus:outline-none focus:ring-2 focus:ring-[#8c6239]"
                  required
                />
                <textarea
                  name="message"
                  placeholder="State your business..."
                  className="w-full rounded-lg border border-[#c1b087] bg-[#fdfaf3] px-4 py-3 text-[#2b2118] placeholder:text-[#9e886d] focus:outline-none focus:ring-2 focus:ring-[#8c6239]"
                  rows={4}
                  required
                />
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-5 py-2 text-[#6e5338] hover:bg-[#ebdcc0] font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg btn-bronze px-6 py-2 font-guild text-sm"
                  >
                    Send Missive
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </header>
    </>
  );
}