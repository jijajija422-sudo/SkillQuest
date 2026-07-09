"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  BookOpen,
  Compass,
  Map,
  Trophy,
  Award,
  Heart,
  MessageSquare,
  PenLine,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  User,
  Medal,
  Scroll
} from "lucide-react";

export default function GuidePage() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: "enlist",
      title: "1. Enlist & Inscribe Your Hero Dossier",
      subtitle: "Join the registry, claim your Hero Name, and choose your class specialization.",
      icon: User,
      badge: "Novice Initiate",
      content: (
        <div className="space-y-4 text-[#2b2118] text-sm sm:text-base leading-relaxed">
          <p>
            Welcome, newcomer! When you first step through the oaken doors of the Adventurer&apos;s Guild, you begin as a <strong>Novice Initiate (Level 1)</strong>. Your first duty is to formalize your identity within our registry.
          </p>
          <div className="rounded-lg border border-[#8c6239] bg-[#fff8ea] p-4 shadow-inner space-y-2 text-xs sm:text-sm">
            <h4 className="font-guild font-bold text-[#4a2e18] flex items-center gap-1.5">
              <Scroll className="h-4 w-4 text-[#8c6239]" />
              <span>How to Customize Your Dossier:</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-[#5c3a1a]">
              <li>Click your <strong>Hero Pill (Level badge)</strong> in the upper right header to open your personal <strong>Guild Dossier</strong>.</li>
              <li>Switch to the <strong>Edit Dossier</strong> tab to update your <strong>Adventurer Name</strong> and write your personal <strong>Chronicle Bio</strong>.</li>
              <li>Select your preferred <strong>Class Specialization</strong> (e.g., <em>Fullstack Developer, AI Engineer, Systems Architect, Creative Explorer</em>).</li>
              <li>Upload a portrait illustration or sign in with Google via <strong>Enter Guild</strong> to permanently seal your progress across realms.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "bounties",
      title: "2. Inspect Open Bounties & The Quest Board",
      subtitle: "Browse contracts from Novice to Legendary and track your mastery.",
      icon: Map,
      badge: "Bounty Hunter",
      content: (
        <div className="space-y-4 text-[#2b2118] text-sm sm:text-base leading-relaxed">
          <p>
            The <strong>Bounty Board</strong> is where self-learners and builders discover actionable challenges. Quests are classified into five distinct difficulty tiers, each awarding prestige and experience points (`XP`):
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="rounded-lg border border-[#8c6239] bg-[#fff8ea] p-3 shadow-sm">
              <p className="font-guild font-bold text-[#4a2e18] text-xs">Novice Contract</p>
              <p className="text-xs text-[#6e5338] mt-0.5">+50 XP &middot; Quick foundational wins & setup tasks.</p>
            </div>
            <div className="rounded-lg border border-[#8c6239] bg-[#fff8ea] p-3 shadow-sm">
              <p className="font-guild font-bold text-[#4a2e18] text-xs">Journeyman Contract</p>
              <p className="text-xs text-[#6e5338] mt-0.5">+100 XP &middot; Intermediate build & deployment deeds.</p>
            </div>
            <div className="rounded-lg border border-[#8c6239] bg-[#fff8ea] p-3 shadow-sm">
              <p className="font-guild font-bold text-[#4a2e18] text-xs">Adventurer Contract</p>
              <p className="text-xs text-[#6e5338] mt-0.5">+200 XP &middot; Full feature implementation & architecture.</p>
            </div>
            <div className="rounded-lg border border-[#8c6239] bg-[#fff8ea] p-3 shadow-sm">
              <p className="font-guild font-bold text-[#4a2e18] text-xs">Epic / Legendary Bounties</p>
              <p className="text-xs text-[#6e5338] mt-0.5">+300 to +500 XP &middot; Master-level system overhauls & live launches.</p>
            </div>
          </div>
          <div className="rounded-lg border border-[#8c6239] bg-[#ebdcc0]/60 p-4 mt-3 text-xs sm:text-sm text-[#4a2e18]">
            <p><strong>Note on 0% Progress:</strong> When you browse the board, any quest that you have not started yet accurately displays <strong>0% Mastered</strong>. Click any bounty card to inspect its exact requirements checklist and track your sub-tasks step by step!</p>
          </div>
        </div>
      ),
    },
    {
      id: "proof",
      title: "3. Sealing Deeds & Inscribing Custom Bounties",
      subtitle: "Submit visual proof and pen your Adventurer Reflection.",
      icon: PenLine,
      badge: "Deed Sealer",
      content: (
        <div className="space-y-4 text-[#2b2118] text-sm sm:text-base leading-relaxed">
          <p>
            In our guild, a deed is not merely checked off—it must be proven and reflected upon so that all comrades may learn from your journey.
          </p>
          <div className="space-y-3">
            <div className="rounded-lg border border-[#8c6239] bg-[#fff8ea] p-4 shadow-inner text-xs sm:text-sm space-y-2">
              <h4 className="font-guild font-bold text-[#4a2e18]">Sealing a Pre-Existing Bounty:</h4>
              <p className="text-[#5c3a1a]">
                Once you finish a quest from the board, click <strong>Upload Proof & Complete Quest</strong> inside the inspection scroll. Attach a screenshot of your work and fill in the <strong>Adventurer Reflection & Chronicle Story</strong> (&quot;What did you learn? What obstacles arose and how did you overcome them?&quot;).
              </p>
            </div>

            <div className="rounded-lg border-2 border-[#8c6239] bg-[#fdfaf3] p-4 shadow-md text-xs sm:text-sm space-y-2">
              <h4 className="font-guild font-bold text-[#8c6239] flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#d4af37]" />
                <span>Posting Your Own Custom Deed (+ Post Custom Deed):</span>
              </h4>
              <p className="text-[#5c3a1a]">
                Don&apos;t want to do a pre-existing quest on the board because you already accomplished a personal project or milestone? No problem! Click the <strong>+ Post Custom Deed</strong> button at the top of the header anytime. You can name your custom deed, choose its category and medal rank (Bronze, Silver, Gold, Platinum, or Legendary), and pen your reflection right to the guild registry!
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "chronicle",
      title: "4. The Activity Chronicle & Missives (Comments)",
      subtitle: "Witness triumphs, award Prestige Applause, and write congratulations.",
      icon: BookOpen,
      badge: "Guild Chronicler",
      content: (
        <div className="space-y-4 text-[#2b2118] text-sm sm:text-base leading-relaxed">
          <p>
            The <strong>Activity Chronicle</strong> (`Chronicle Feed` tab) is a live, shared parchment where all completed deeds and custom triumphs are published in real time.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="rounded-lg border border-[#8c6239] bg-[#fff8ea] p-4 shadow-sm space-y-1.5">
              <h4 className="font-guild font-bold text-[#4a2e18] flex items-center gap-1.5 text-xs sm:text-sm">
                <Heart className="h-4 w-4 fill-[#8c6239] text-[#8c6239]" />
                <span>Prestige Applause:</span>
              </h4>
              <p className="text-xs text-[#5c3a1a] leading-relaxed">
                Click the heart seal on any post to bestow <strong>Prestige Applause</strong> (+1 Like). Every round of applause boosts the author&apos;s standing across the guild!
              </p>
            </div>
            <div className="rounded-lg border border-[#8c6239] bg-[#fff8ea] p-4 shadow-sm space-y-1.5">
              <h4 className="font-guild font-bold text-[#4a2e18] flex items-center gap-1.5 text-xs sm:text-sm">
                <MessageSquare className="h-4 w-4 text-[#8c6239]" />
                <span>Inscribed Missives (Comments):</span>
              </h4>
              <p className="text-xs text-[#5c3a1a] leading-relaxed">
                Click the missives row on any post—whether on the live feed OR right inside an adventurer&apos;s <strong>Dossier Profile</strong>—to read comments, ask questions about their code/build, and post your congratulations!
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "progression",
      title: "5. Rank Progression & Prestige Ranks",
      subtitle: "Rise from Novice Initiate to Legendary Grandmaster.",
      icon: Trophy,
      badge: "Grandmaster",
      content: (
        <div className="space-y-4 text-[#2b2118] text-sm sm:text-base leading-relaxed">
          <p>
            As your `XP` accumulates from completed bounties and custom accomplishments, your character automatically ascends through the hierarchy of guild prestige ranks:
          </p>
          <div className="rounded-lg border border-[#8c6239] bg-[#fff8ea] p-4 shadow-inner space-y-2.5 text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b border-[#c1b087]/60 pb-2">
              <span className="font-guild font-bold text-[#4a2e18]">Level 1 - 2 (0 - 300 XP)</span>
              <span className="font-guild font-bold text-[#8c6239]">Novice Initiate</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#c1b087]/60 pb-2">
              <span className="font-guild font-bold text-[#4a2e18]">Level 3 - 4 (300 - 1,000 XP)</span>
              <span className="font-guild font-bold text-[#8c6239]">Apprentice Adventurer</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#c1b087]/60 pb-2">
              <span className="font-guild font-bold text-[#4a2e18]">Level 5 - 6 (1,000 - 2,200 XP)</span>
              <span className="font-guild font-bold text-[#8c6239]">Journeyman Scholar</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#c1b087]/60 pb-2">
              <span className="font-guild font-bold text-[#4a2e18]">Level 7 - 8 (2,200 - 4,000 XP)</span>
              <span className="font-guild font-bold text-[#8c6239]">Master of Deeds</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-guild font-bold text-[#4a2e18]">Level 9+ (4,000+ XP)</span>
              <span className="font-guild font-bold text-gold-stamped">Legendary Grandmaster</span>
            </div>
          </div>
          <p className="text-xs text-[#6e5338] italic text-center pt-1">
            &ldquo;Every master was once a beginner who refused to leave the quest incomplete.&rdquo;
          </p>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#122017] text-[#f4ecd8] px-4 py-8 sm:px-6 md:px-10 pb-24">
      <div className="mx-auto w-full max-w-5xl">
        {/* Top return navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-[#d4af37]/40 bg-[#1c3829] px-4 py-2 text-xs sm:text-sm font-guild font-bold text-[#eddcc4] hover:bg-[#234935] hover:text-[#f4ecd8] transition shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 text-[#d4af37]" />
            <span>Return to Quest Registry</span>
          </Link>
          <span className="text-xs font-guild font-bold uppercase tracking-wider text-gold-etched hidden sm:inline-block">
            Official Guild Compendium
          </span>
        </div>

        {/* Hero Title Banner (Wood Container) */}
        <div className="rounded-xl border-4 border-[#4a2e18] bg-wood p-6 sm:p-10 shadow-[0_12px_32px_rgba(0,0,0,0.8)] text-[#f4ecd8] mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#8c6239]/60 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#f5d77f] via-[#d4af37] to-[#8c6239] border-2 border-[#fff1aa] shadow-[0_4px_12px_rgba(0,0,0,0.7)] shrink-0">
                <BookOpen className="h-8 w-8 text-[#122017]" />
              </div>
              <div>
                <p className="text-xs font-guild font-bold uppercase tracking-widest text-gold-etched">Adventurer&apos;s Handbook</p>
                <h1 className="text-2xl sm:text-4xl font-bold font-guild text-[#fff8ea] tracking-wide mt-0.5">
                  Newcomer&apos;s Guide to the Guild
                </h1>
              </div>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d4af37] bg-[#162a1e] px-4 py-1.5 text-xs font-guild font-bold text-[#f5d77f] shadow-inner">
                <Shield className="h-3.5 w-3.5 fill-[#f5d77f]" />
                <span>Guild Orientation V0.1</span>
              </span>
            </div>
          </div>
          <p className="mt-4 text-sm sm:text-base text-[#eddcc4] leading-relaxed max-w-3xl font-serif italic">
            &ldquo;Whether you come to forge new code, master artificial intelligence, or craft complex systems, this registry is your sanctuary. Follow these five tenets to track your deeds and rise among fellow guild adventurers.&rdquo;
          </p>
        </div>

        {/* Interactive Step Navigator + Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
          {/* Step Selector Sidebar (Parchment Container) */}
          <div className="rounded-xl border-2 border-[#8c6239] bg-parchment p-4 sm:p-5 shadow-[0_8px_24px_rgba(0,0,0,0.6)] text-[#2b2118]">
            <p className="text-xs font-guild font-bold uppercase tracking-wider text-gold-stamped mb-3 px-2">
              Walkthrough Chapters
            </p>
            <div className="space-y-2">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = activeStep === idx;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`w-full flex items-center justify-between gap-3 rounded-lg px-3.5 py-3 text-left transition font-guild text-xs sm:text-sm shadow-sm ${
                      isActive
                        ? "btn-enamel text-[#eafee8] font-bold"
                        : "border border-[#c1b087]/60 bg-[#fff8ea] text-[#4a2e18] hover:bg-[#ebdcc0] hover:border-[#8c6239]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#f5d77f]" : "text-[#8c6239]"}`} />
                      <span className="truncate">{step.title}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 ${isActive ? "text-[#f5d77f]" : "text-[#8c6239]"}`} />
                  </button>
                );
              })}
            </div>

            {/* Quick Tip Box */}
            <div className="mt-6 pt-5 border-t border-[#c1b087] text-xs text-[#6e5338] space-y-1.5 px-1">
              <p className="font-guild font-bold text-[#4a2e18] flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-[#8c6239]" />
                <span>Need immediate assistance?</span>
              </p>
              <p>Click <strong>Dispatch</strong> in the top header to send a courier missive directly to our guildmasters!</p>
            </div>
          </div>

          {/* Active Chapter Display Card (Parchment Container) */}
          <div className="rounded-xl border-2 border-[#8c6239] bg-parchment p-6 sm:p-8 shadow-[0_12px_32px_rgba(0,0,0,0.8)] text-[#2b2118] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c1b087] pb-5">
              <div>
                <span className="rounded border border-[#8c6239] bg-[#ebdcc0] px-2.5 py-0.5 text-xs font-guild font-bold text-[#5c3a1a]">
                  Chapter {activeStep + 1} of {steps.length} &middot; {steps[activeStep].badge}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-guild text-[#4a2e18] mt-2">
                  {steps[activeStep].title}
                </h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className="rounded-lg border border-[#8c6239] bg-[#fff8ea] px-3 py-1.5 text-xs font-guild font-bold text-[#4a2e18] hover:bg-[#ebdcc0] disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                  className="rounded-lg btn-bronze px-4 py-1.5 text-xs font-guild font-bold disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next Chapter
                </button>
              </div>
            </div>

            {/* Chapter Subtitle Banner */}
            <p className="text-sm font-semibold text-[#8c6239] italic border-l-4 border-[#8c6239] pl-3 py-0.5 bg-[#fff8ea] rounded-r">
              {steps[activeStep].subtitle}
            </p>

            {/* Main Chapter Content */}
            <div className="pt-2">
              {steps[activeStep].content}
            </div>

            {/* Chapter Footer Navigation */}
            <div className="pt-6 border-t border-[#c1b087] flex items-center justify-between gap-4">
              <span className="text-xs text-[#6e5338] font-semibold">
                You can return to any chapter from the left menu.
              </span>
              {activeStep === steps.length - 1 ? (
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-lg btn-bronze px-6 py-2.5 text-sm font-guild font-bold shadow-md hover:scale-105 transition"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#10b981]" />
                  <span>Start Your Guild Journey</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => prev + 1)}
                  className="inline-flex items-center gap-2 rounded-lg btn-bronze px-5 py-2 text-xs sm:text-sm font-guild font-bold transition"
                >
                  <span>Continue to Next Chapter</span>
                  <ChevronRight className="h-4 w-4 text-[#f5d77f]" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-12 rounded-xl border-2 border-[#d4af37]/60 bg-[#162a1e] p-8 text-center space-y-4 shadow-lg">
          <h3 className="text-xl sm:text-2xl font-bold font-guild text-gold-etched">
            Ready to Inscribe Your First Accomplishment?
          </h3>
          <p className="text-xs sm:text-sm text-[#c2b59b] max-w-xl mx-auto leading-relaxed">
            Whether you choose a Novice contract from the Bounty Board or click <strong>+ Post Custom Deed</strong> to chronicle what you built today, your guild awaits your contribution!
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg btn-enamel px-8 py-3 font-guild font-bold text-sm tracking-wide shadow-md hover:scale-105 transition"
            >
              <Shield className="h-4 w-4 text-[#f5d77f]" />
              <span>Enter the Registry & Begin</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
