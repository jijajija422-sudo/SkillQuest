"use client";

import { useState } from "react";
import Link from "next/link";
import ProfileModal from "./ProfileModal";
import ShareModal from "./ShareModal";
import { Mail, LogIn, LogOut, User as UserIcon, Compass, PenLine, BookOpen, Share2 } from "lucide-react";
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
    alert("Thanks! Message saved.");
  }

  const displayAvatar = profile.avatarUrl || user?.photoURL;

  function triggerCustomQuestModal() {
    window.dispatchEvent(new CustomEvent("open-custom-quest-modal"));
  }

  return (
    <>
      <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-[#f0f4f8]/95 backdrop-blur-md shadow-neu-raised-sm">
        <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 md:px-8 lg:px-12">
          <div className="flex w-full items-center justify-between gap-3 sm:gap-4">
            <Link href="/" className="flex items-center gap-3 shrink-0 min-w-0 hover:opacity-95 transition">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f0f4f8] border border-slate-200/70 text-teal-600 shadow-neu-raised-sm shrink-0">
                <Compass className="h-5 w-5 text-teal-600" />
              </div>
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-extrabold tracking-tight text-slate-800 leading-tight truncate">SkillHub</p>
                <p className="text-[11px] font-semibold text-slate-500 hidden xs:block truncate">Explore Hub &amp; Explorations</p>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Link
                href="/guide"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200/60 bg-[#f0f4f8] px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-teal-600 hover:scale-[1.02] transition shrink-0 shadow-neu-raised-sm"
                title="Platform Guide & Walkthrough"
              >
                <BookOpen className="h-4 w-4 text-teal-600" />
                <span>Guide</span>
              </Link>

              <button
                type="button"
                onClick={() => setShareModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200/60 bg-[#f0f4f8] px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-teal-600 hover:scale-[1.02] transition shrink-0 shadow-neu-raised-sm"
                title="Share Platform & Invite Members"
              >
                <Share2 className="h-4 w-4 text-teal-600" />
                <span>Share</span>
              </button>

              <div className="hidden md:block">
                <button
                  type="button"
                  onClick={triggerCustomQuestModal}
                  className="inline-flex items-center gap-2 rounded-xl btn-bronze px-4 py-1.5 text-xs sm:text-sm font-semibold shadow-neu-raised-sm hover:scale-[1.02] transition"
                  title="Share a new skill or project verification"
                >
                  <PenLine className="h-4 w-4 text-blue-600" />
                  <span>Share a New Skill</span>
                </button>
              </div>

              {/* Profile Pill */}
              <div className="flex items-center gap-1.5 sm:gap-2 border border-slate-200/60 bg-[#f0f4f8] rounded-full pl-2 pr-1.5 py-1 sm:pl-3 sm:pr-2 sm:py-1.5 shrink-0 max-w-[170px] sm:max-w-none shadow-neu-inset-sm">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(true)}
                  className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition text-left min-w-0"
                >
                  {displayAvatar ? (
                    <img src={displayAvatar} alt={profile.name} className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-cover border border-slate-300 shrink-0 shadow-sm" />
                  ) : (
                    <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-teal-600 border border-teal-400 flex items-center justify-center text-[10px] sm:text-xs font-bold text-white shrink-0 shadow-sm">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline text-sm font-bold text-slate-800 max-w-[100px] truncate">{profile.name}</span>
                  <span className="text-[10px] sm:text-xs bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold shrink-0 shadow-sm">Phase {profile.level}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(true)}
                  title="View / Edit Profile"
                  className="rounded-full p-1 text-slate-500 hover:text-teal-600 transition shrink-0"
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
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/60 bg-[#f0f4f8] px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-red-600 transition shrink-0 shadow-neu-raised-sm"
                >
                  <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-slate-400" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={login}
                  className="inline-flex items-center gap-1.5 rounded-xl btn-enamel px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-semibold tracking-wide shrink-0 shadow-neu-raised-sm"
                >
                  <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                  <span>Sign In</span>
                </button>
              )}

              <button
                onClick={() => setOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200/60 bg-[#f0f4f8] px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-teal-600 transition shrink-0 shadow-neu-raised-sm"
              >
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-teal-600" />
                <span>Contact</span>
              </button>
            </div>
          </div>

          {/* Mobile bottom action bar */}
          <div className="flex md:hidden w-full items-center justify-between gap-1.5 mt-2.5 pt-2.5 border-t border-slate-200/60">
            <Link
              href="/guide"
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200/60 bg-[#f0f4f8] px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-teal-600 shrink-0 shadow-neu-raised-sm"
              title="Platform Guide"
            >
              <BookOpen className="h-3.5 w-3.5 text-teal-600" />
              <span className="hidden xs:inline">Guide</span>
            </Link>
            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-slate-200/60 bg-[#f0f4f8] px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-teal-600 shrink-0 shadow-neu-raised-sm"
              title="Share Platform"
            >
              <Share2 className="h-3.5 w-3.5 text-teal-600" />
              <span>Share</span>
            </button>
            <button
              type="button"
              onClick={triggerCustomQuestModal}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl btn-bronze px-3 py-2 text-xs font-semibold shadow-neu-raised-sm"
            >
              <PenLine className="h-4 w-4 text-blue-600" />
              <span>Share a New Skill</span>
            </button>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200/60 bg-[#f0f4f8] px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-teal-600 transition shrink-0 shadow-neu-raised-sm"
            >
              <Mail className="h-3.5 w-3.5 shrink-0 text-teal-600" />
              <span>Contact</span>
            </button>
          </div>
        </div>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md rounded-2xl bg-[#f0f4f8] border border-slate-200/80 p-8 shadow-neu-raised-lg text-slate-800">
              <h3 className="text-xl font-bold text-slate-800">Contact Platform Support</h3>
              <p className="text-xs text-slate-500 mt-1">Send a message or inquiry to our support team.</p>
              <form onSubmit={submitContact} className="mt-6 grid gap-4">
                <input
                  name="name"
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-neu-inset-sm"
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className="w-full rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-neu-inset-sm"
                  required
                />
                <textarea
                  name="message"
                  placeholder="How can we help you?"
                  className="w-full rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-neu-inset-sm"
                  rows={4}
                  required
                />
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-5 py-2 text-slate-600 hover:bg-slate-200/50 font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl btn-bronze px-6 py-2 text-sm font-semibold shadow-neu-raised-sm"
                  >
                    Send Message
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