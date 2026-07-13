"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
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
  Clock
} from "lucide-react";

export default function GuidePage() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: "enlist",
      title: "1. Join & Personalize Your Member Profile",
      subtitle: "Set up your professional overview, claim your name, and choose your focus area.",
      icon: User,
      badge: "Phase 1 Member",
      content: (
        <div className="space-y-4 text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
          <p>
            Welcome to <strong>SkillHub</strong>! When you first join our universal skill-sharing community, you start at <strong>Phase 1 (Foundational)</strong>. Your first step is to personalize your member profile.
          </p>
          <div className="rounded-2xl border border-slate-200/80 bg-[#e6ecf2] p-5 shadow-neu-inset-sm space-y-3 text-xs sm:text-sm">
            <h4 className="font-bold text-slate-800 flex items-center gap-2 text-sm sm:text-base">
              <User className="h-4 w-4 text-teal-600 shrink-0" />
              <span>How to Customize Your Member Profile:</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Click your <strong>Phase badge</strong> in the upper right header to open your personal <strong>Member Profile</strong>.</li>
              <li>Switch to the <strong>Edit Profile</strong> tab to update your <strong>Full Name</strong> and write your professional summary.</li>
              <li>Select your preferred <strong>Focus Specialization</strong> (e.g., <em>Fullstack Developer, AI Engineer, Systems Architect, Creative Explorer</em>).</li>
              <li>Upload a professional photo or sign in with Google to sync your progress across devices.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: "explorations",
      title: "2. Explore Projects & The Roadmap",
      subtitle: "Browse explorations from Foundational to Masterclass and track your mastery.",
      icon: Map,
      badge: "Active Explorer",
      content: (
        <div className="space-y-4 text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
          <p>
            The <strong>Explore Hub</strong> is where self-learners and creators discover actionable projects. Explorations are classified into five distinct skill phases, each awarding prestige and <strong>Progress Steps</strong>:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="rounded-xl border border-slate-200/80 bg-[#e6ecf2] p-4 shadow-neu-inset-sm">
              <p className="font-bold text-slate-800 text-sm">Foundational Exploration</p>
              <p className="text-xs text-slate-600 mt-1">+50 Progress Steps &middot; Quick foundational wins &amp; core setup tasks.</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-[#e6ecf2] p-4 shadow-neu-inset-sm">
              <p className="font-bold text-slate-800 text-sm">Journeyman Exploration</p>
              <p className="text-xs text-slate-600 mt-1">+100 Progress Steps &middot; Intermediate builds &amp; practical projects.</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-[#e6ecf2] p-4 shadow-neu-inset-sm">
              <p className="font-bold text-slate-800 text-sm">Adventurer Exploration</p>
              <p className="text-xs text-slate-600 mt-1">+200 Progress Steps &middot; Full feature implementation &amp; system design.</p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-[#e6ecf2] p-4 shadow-neu-inset-sm">
              <p className="font-bold text-slate-800 text-sm">Advanced / Masterclass Projects</p>
              <p className="text-xs text-slate-600 mt-1">+300 to +500 Progress Steps &middot; Master-level architecture &amp; live deployments.</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200/80 bg-[#f0f4f8] p-4 mt-3 text-xs sm:text-sm text-slate-700 shadow-neu-raised-sm">
            <p><strong>Note on 0% Progress:</strong> When you browse the hub, any project that you have not started yet accurately displays <strong>0% Progress</strong>. Click any exploration card to view its checklist and track sub-tasks step by step!</p>
          </div>
        </div>
      ),
    },
    {
      id: "proof",
      title: "3. Verifying Projects & Creating Custom Explorations",
      subtitle: "Submit visual verifications and share your key takeaways.",
      icon: PenLine,
      badge: "Project Verifier",
      content: (
        <div className="space-y-4 text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
          <p>
            In our platform, a project completion is verified and shared so that fellow members can learn from your journey and technical decisions.
          </p>
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200/80 bg-[#e6ecf2] p-5 shadow-neu-inset-sm text-xs sm:text-sm space-y-2">
              <h4 className="font-bold text-slate-800 text-sm sm:text-base">Verifying a Featured Exploration:</h4>
              <p className="text-slate-700">
                Once you complete a project from the roadmap, click <strong>Verify &amp; Share Exploration</strong> inside the project modal. Attach a screenshot of your work and summarize your learnings (&quot;What did you build? What challenges arose and how did you resolve them?&quot;).
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-5 shadow-neu-raised text-xs sm:text-sm space-y-2">
              <h4 className="font-bold text-teal-700 flex items-center gap-2 text-sm sm:text-base">
                <Sparkles className="h-4 w-4 text-teal-600 shrink-0" />
                <span>Creating Your Own Custom Exploration (+ Create Custom Exploration):</span>
              </h4>
              <p className="text-slate-700">
                Did you accomplish a personal project or milestone outside our featured roadmap? No problem! Click the <strong>+ Create Custom Exploration</strong> button at the top of the header anytime. You can name your custom project, choose its category and tier (Foundational, Journeyman, Adventurer, Advanced, or Masterclass), and publish your verification right to the community!
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "activity",
      title: "4. Recent Activity & Community Discussions",
      subtitle: "Discover community achievements, award recognition, and share feedback.",
      icon: BookOpen,
      badge: "Active Contributor",
      content: (
        <div className="space-y-4 text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
          <p>
            The <strong>Recent Activity</strong> tab is a live community stream where verified projects and custom milestones are published in real time.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="rounded-xl border border-slate-200/80 bg-[#e6ecf2] p-5 shadow-neu-inset-sm space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-2 text-xs sm:text-sm">
                <Heart className="h-4 w-4 fill-teal-600 text-teal-600 shrink-0" />
                <span>Prestige Recognition:</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Click the recognition button on any post to bestow applause (+1 Like). Supporting others highlights great work and fosters an inclusive, growth-oriented culture!
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-[#e6ecf2] p-5 shadow-neu-inset-sm space-y-2">
              <h4 className="font-bold text-slate-800 flex items-center gap-2 text-xs sm:text-sm">
                <MessageSquare className="h-4 w-4 text-teal-600 shrink-0" />
                <span>Constructive Discussions:</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Click the comments section on any activity item—whether on the live feed OR inside a member&apos;s profile—to ask questions about their implementation and post constructive feedback!
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "progression",
      title: "5. Skill Phases & Journey Milestones",
      subtitle: "Grow from Phase 1 to Masterclass expertise.",
      icon: Trophy,
      badge: "Masterclass",
      content: (
        <div className="space-y-4 text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
          <p>
            As your <strong>Progress Steps</strong> accumulate from verified projects and custom accomplishments, your profile automatically advances through skill phases and unlocks <strong>Journey Milestones</strong>:
          </p>
          <div className="rounded-2xl border border-slate-200/80 bg-[#e6ecf2] p-5 shadow-neu-inset-sm space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <span className="font-bold text-slate-700">Phase 1 - 2 (0 - 300 Progress Steps)</span>
              <span className="font-bold text-teal-700">Foundational</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <span className="font-bold text-slate-700">Phase 3 - 4 (300 - 1,000 Progress Steps)</span>
              <span className="font-bold text-teal-700">Journeyman</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <span className="font-bold text-slate-700">Phase 5 - 6 (1,000 - 2,200 Progress Steps)</span>
              <span className="font-bold text-teal-700">Adventurer</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
              <span className="font-bold text-slate-700">Phase 7 - 8 (2,200 - 4,000 Progress Steps)</span>
              <span className="font-bold text-teal-700">Advanced</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-bold text-slate-700">Phase 9+ (4,000+ Progress Steps)</span>
              <span className="font-bold text-teal-600">Masterclass</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 italic text-center pt-1">
            &ldquo;Every master began by completing their first foundational exploration and building consistently.&rdquo;
          </p>
        </div>
      ),
    },
  ];

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#e6ecf2] text-slate-800 px-4 py-8 sm:px-6 md:px-10 pb-24 font-sans">
      <div className="mx-auto w-full max-w-5xl">
        {/* Top return navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-[#f0f4f8] px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-800 hover:bg-[#e6ecf2] transition shadow-neu-raised-sm"
          >
            <ArrowLeft className="h-4 w-4 text-teal-600" />
            <span>Return to Explore Hub</span>
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600 hidden sm:inline-block">
            SkillHub Guidebook
          </span>
        </div>

        {/* Hero Title Banner (Soft Neumorphic Container) */}
        <div className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-6 sm:p-10 shadow-neu-raised-lg text-slate-800 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-[#e6ecf2] border border-slate-200/80 shadow-neu-inset shrink-0">
                <Compass className="h-8 w-8 text-teal-600" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-teal-600">Platform Orientation</p>
                <h1 className="text-2xl sm:text-4xl font-bold text-slate-800 tracking-tight mt-0.5">
                  Welcome to SkillHub
                </h1>
              </div>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-[#e6ecf2] px-4 py-1.5 text-xs font-bold text-teal-700 shadow-neu-inset-sm">
                <BookOpen className="h-3.5 w-3.5 text-teal-600" />
                <span>Guidebook V2.0</span>
              </span>
            </div>
          </div>
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl font-medium">
            &ldquo;Whether you come to learn modern web development, explore artificial intelligence, or build professional projects, SkillHub is your open platform for growth. Follow these guidelines to track your explorations and connect with fellow creators.&rdquo;
          </p>
        </div>

        {/* Interactive Step Navigator + Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
          {/* Step Selector Sidebar */}
          <div className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-5 shadow-neu-raised-lg text-slate-800">
            <p className="text-xs font-bold uppercase tracking-wider text-teal-600 mb-3 px-2">
              Walkthrough Topics
            </p>
            <div className="space-y-2.5">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isActive = activeStep === idx;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveStep(idx)}
                    className={`w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-left transition text-xs sm:text-sm font-bold ${
                      isActive
                        ? "bg-[#e6ecf2] text-teal-700 shadow-neu-inset border border-slate-200/80"
                        : "border border-slate-200/80 bg-[#f0f4f8] text-slate-700 hover:bg-[#e6ecf2] shadow-neu-raised-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-teal-600" : "text-slate-500"}`} />
                      <span className="truncate">{step.title}</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 ${isActive ? "text-teal-600" : "text-slate-400"}`} />
                  </button>
                );
              })}
            </div>

            {/* Quick Tip Box */}
            <div className="mt-6 pt-5 border-t border-slate-200/80 text-xs text-slate-600 space-y-1.5 px-1">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-teal-600" />
                <span>Need support or feedback?</span>
              </p>
              <p className="font-medium">Explore the Recent Activity feed or share a question right inside any exploration discussion!</p>
            </div>
          </div>

          {/* Active Chapter Display Card */}
          <div className="rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-6 sm:p-8 shadow-neu-raised-lg text-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-5">
              <div>
                <span className="rounded-lg border border-slate-200/80 bg-[#e6ecf2] px-3 py-1 text-xs font-bold text-teal-700 shadow-neu-inset-sm">
                  Topic {activeStep + 1} of {steps.length} &middot; {steps[activeStep].badge}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2.5">
                  {steps[activeStep].title}
                </h2>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className="rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-[#f0f4f8] disabled:opacity-40 disabled:cursor-not-allowed transition shadow-neu-raised-sm"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={activeStep === steps.length - 1}
                  onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                  className="rounded-xl btn-bronze px-4 py-2 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed transition shadow-neu-raised-sm"
                >
                  Next Topic
                </button>
              </div>
            </div>

            {/* Chapter Subtitle Banner */}
            <p className="text-sm font-semibold text-teal-700 border-l-4 border-teal-600 pl-3.5 py-1 bg-[#e6ecf2] rounded-r-xl shadow-neu-inset-sm">
              {steps[activeStep].subtitle}
            </p>

            {/* Main Chapter Content */}
            <div className="pt-2">
              {steps[activeStep].content}
            </div>

            {/* Chapter Footer Navigation */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-600 font-semibold text-center sm:text-left">
                You can switch between topics anytime from the left menu.
              </span>
              {activeStep === steps.length - 1 ? (
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-xl btn-bronze px-6 py-3 text-sm font-bold shadow-neu-raised transition hover:scale-[1.01]"
                >
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  <span>Start Exploring Now</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => prev + 1)}
                  className="inline-flex items-center gap-2 rounded-xl btn-bronze px-5 py-2.5 text-xs sm:text-sm font-bold transition shadow-neu-raised"
                >
                  <span>Continue to Next Topic</span>
                  <ChevronRight className="h-4 w-4 text-teal-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-12 rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-8 sm:p-10 text-center space-y-4 shadow-neu-raised-lg">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
            Ready to Verify Your First Exploration?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed font-medium">
            Whether you choose a Foundational project from the roadmap or click <strong>+ Create Custom Exploration</strong> to share what you built today, the community looks forward to your contributions!
          </p>
          <div className="pt-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-xl btn-bronze px-8 py-3.5 font-bold text-sm shadow-neu-raised hover:scale-[1.01] transition"
            >
              <Compass className="h-4.5 w-4.5 text-teal-600" />
              <span>Enter Explore Hub &amp; Begin</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
