"use client";

import React, { useState } from "react";
import { X, Share2, Copy, Check, Shield, Send, ExternalLink, Sparkles } from "lucide-react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "https://skillhub.app";
  };

  const shareTitle = "SkillHub - Universal Skill-Sharing & Project Verification Platform";
  const shareText = "Join me on SkillHub! Track structured skill verifications from Beginner to Master, share visual proof of your projects, and build your professional portfolio.";

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: getShareUrl(),
        });
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const openSocialShare = (platform: "twitter" | "whatsapp" | "linkedin" | "telegram") => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(`${shareText}\n\n`);

    let shareLink = "";
    if (platform === "twitter") {
      shareLink = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    } else if (platform === "whatsapp") {
      shareLink = `https://api.whatsapp.com/send?text=${text}${url}`;
    } else if (platform === "linkedin") {
      shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    } else if (platform === "telegram") {
      shareLink = `https://t.me/share/url?url=${url}&text=${text}`;
    }

    if (shareLink) {
      window.open(shareLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm transition animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-200/80 bg-[#f0f4f8] p-6 sm:p-8 shadow-neu-raised-lg text-slate-800 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl border border-slate-200/80 bg-[#e6ecf2] p-2 text-slate-500 hover:text-red-600 transition shadow-neu-raised-sm"
          title="Close Dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 border-b border-slate-200/80 pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e6ecf2] border border-slate-200/80 shadow-neu-inset-sm text-blue-600 shrink-0">
            <Share2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-teal-600">Share Platform</p>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">
              Invite &amp; Share SkillHub
            </h3>
          </div>
        </div>

        {/* Open Graph / Social Embed Preview Card */}
        <div className="mt-6 space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-teal-600" />
            <span>Link Preview Card</span>
          </label>
          
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-900 shadow-neu-inset-sm">
            {/* Graphic Banner Display */}
            <div className="relative aspect-[1.91/1] w-full bg-slate-900 border-b border-slate-800 overflow-hidden flex items-center justify-center">
              <img
                src="/og-image.svg"
                alt="SkillHub Open Graph Banner"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-teal-500/40 bg-slate-900/90 px-3 py-1 text-[11px] font-bold text-teal-400 shadow">
                <Shield className="h-3.5 w-3.5 fill-teal-400 text-teal-400" />
                <span>Verified SkillHub Link</span>
              </div>
            </div>

            {/* Embed Text Preview */}
            <div className="p-4 text-white space-y-1 bg-slate-900">
              <div className="flex items-center gap-2">
                <img src="/icon.svg" alt="SkillHub Logo" className="h-5 w-5 rounded object-cover border border-slate-700" />
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wide">skillhub.app</span>
              </div>
              <h4 className="font-bold text-sm sm:text-base text-white leading-snug">
                SkillHub - Universal Skill-Sharing &amp; Project Verification Platform
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                Expand your real-world skills with a universal verification platform. Track structured explorations from Foundational to Masterclass, verify your projects, and build your portfolio.
              </p>
            </div>
          </div>
        </div>

        {/* Primary Share Action Buttons */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 rounded-xl btn-bronze px-4 py-3 font-bold text-sm shadow-neu-raised-sm hover:scale-[1.01] transition"
          >
            <Share2 className="h-4 w-4" />
            <span>Share via Device...</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className={`flex items-center justify-center gap-2 rounded-xl border py-3 px-4 font-bold text-sm transition shadow-neu-raised-sm ${
              copied
                ? "border-teal-500 bg-teal-50 text-teal-700 shadow-neu-inset-sm"
                : "border-slate-200/80 bg-[#e6ecf2] text-slate-800 hover:bg-[#f0f4f8]"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-teal-600" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-teal-600" />
                <span>Copy Platform URL</span>
              </>
            )}
          </button>
        </div>

        {/* Social Dispatch Shortcuts */}
        <div className="mt-6 pt-5 border-t border-slate-200/80 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-600 text-center">
            Share Directly to Social Networks
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => openSocialShare("twitter")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-[#e6ecf2] p-2.5 text-xs font-semibold text-slate-700 hover:bg-[#f0f4f8] transition shadow-neu-raised-sm hover:scale-[1.02]"
            >
              <Send className="h-3.5 w-3.5 text-[#1da1f2]" />
              <span>Twitter / X</span>
            </button>

            <button
              type="button"
              onClick={() => openSocialShare("whatsapp")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-[#e6ecf2] p-2.5 text-xs font-semibold text-slate-700 hover:bg-[#f0f4f8] transition shadow-neu-raised-sm hover:scale-[1.02]"
            >
              <Send className="h-3.5 w-3.5 text-[#25d366]" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => openSocialShare("linkedin")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-[#e6ecf2] p-2.5 text-xs font-semibold text-slate-700 hover:bg-[#f0f4f8] transition shadow-neu-raised-sm hover:scale-[1.02]"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#0a66c2]" />
              <span>LinkedIn</span>
            </button>

            <button
              type="button"
              onClick={() => openSocialShare("telegram")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-[#e6ecf2] p-2.5 text-xs font-semibold text-slate-700 hover:bg-[#f0f4f8] transition shadow-neu-raised-sm hover:scale-[1.02]"
            >
              <Send className="h-3.5 w-3.5 text-[#0088cc]" />
              <span>Telegram</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

