"use client";

import { useState } from "react";
import ProofUpload from "./ProofUpload";
import ProfileModal from "./ProfileModal";
import { Mail, LogIn, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
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
    alert("Thanks! Message saved locally.");
  }

  const displayAvatar = profile.avatarUrl || user?.photoURL;

  return (
    <>
      <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      <header className="sticky top-0 z-40 backdrop-blur-md border-b border-white/10 bg-slate-950/50 text-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-10 sm:py-4 lg:px-16">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              <div className="rounded-full bg-cyan-900/50 border border-cyan-500/30 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                SQ
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">SkillQuest</p>
                <p className="text-[10px] sm:text-xs text-cyan-400/80 hidden xs:block">Core learning protocol</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden md:block">
                <ProofUpload userName={profile.name} compact />
              </div>

              {/* Profile Pill */}
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 border border-white/10 rounded-full pl-2 pr-1.5 py-1 sm:pl-3 sm:pr-2 sm:py-1.5 shadow-inner shrink-0">
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(true)}
                  className="flex items-center gap-1.5 sm:gap-2 hover:opacity-80 transition text-left"
                >
                  {displayAvatar ? (
                    <img src={displayAvatar} alt={profile.name} className="h-5 w-5 sm:h-6 sm:w-6 rounded-full object-cover border border-cyan-400" />
                  ) : (
                    <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-cyan-600 flex items-center justify-center text-[10px] sm:text-xs font-bold text-white">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline text-sm font-medium text-white max-w-[110px] truncate">{profile.name}</span>
                  <span className="text-[10px] sm:text-xs bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 px-1.5 sm:px-2 py-0.5 rounded-full font-semibold">Lvl {profile.level}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(true)}
                  title="View / Edit Profile"
                  className="rounded-full p-1 text-cyan-400 hover:bg-white/10 hover:text-cyan-300 transition"
                >
                  <UserIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
              </div>

              {/* Log In / Log Out Buttons */}
              {user ? (
                <button
                  type="button"
                  onClick={logout}
                  title="Sign Out"
                  className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-950/50 px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-xs sm:text-sm font-semibold text-rose-300 hover:bg-rose-900/60 transition shadow-sm shrink-0"
                >
                  <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-400" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={login}
                  className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-gradient-to-r from-cyan-600/80 to-indigo-600/80 px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:from-cyan-500 hover:to-indigo-500 transition shrink-0"
                >
                  <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-cyan-200" />
                  <span>Sign In</span>
                </button>
              )}

              <button
                onClick={() => setOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-white shadow-sm hover:bg-white/10 transition shrink-0"
              >
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Contact
              </button>
            </div>
          </div>

          {/* Mobile bottom action bar for small screens (< md) */}
          <div className="flex md:hidden items-center justify-between gap-2 mt-2.5 pt-2.5 border-t border-white/10">
            <div className="flex-1">
              <ProofUpload userName={profile.name} compact />
            </div>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-white shadow-sm hover:bg-white/10 transition shrink-0"
            >
              <Mail className="h-3.5 w-3.5" />
              Contact
            </button>
          </div>
        </div>

        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="mx-4 w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900/90 p-8 shadow-2xl text-white">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                Contact SkillQuest
              </h3>
              <form onSubmit={submitContact} className="mt-6 grid gap-4">
                <input 
                  name="name" 
                  placeholder="Your name" 
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50" 
                  required 
                />
                <input 
                  name="email" 
                  type="email" 
                  placeholder="Email" 
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50" 
                  required 
                />
                <textarea 
                  name="message" 
                  placeholder="Message" 
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50" 
                  rows={4} 
                  required 
                />
                <div className="mt-4 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setOpen(false)} 
                    className="rounded-xl px-5 py-2 text-slate-300 hover:bg-white/5 transition"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="rounded-xl bg-cyan-600/80 border border-cyan-400/50 px-6 py-2 font-medium text-white transition hover:bg-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                  >
                    Send
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