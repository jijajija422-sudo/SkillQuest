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
    return "https://skillquest.app";
  };

  const shareTitle = "SkillQuest - Adventurer's Guild & RPG Quest Registry";
  const shareText = "Join me inside the Adventurer's Guild! Track actionable self-learning quests from Novice to Legendary, seal visual proof of your deeds, and earn guild prestige.";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-2xl border-4 border-[#8c6239] bg-parchment p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-[#2b2118] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full border border-[#8c6239] bg-[#fff8ea] p-2 text-[#6e5338] hover:bg-[#ebdcc0] hover:text-[#4a2e18] transition shadow-sm"
          title="Close Dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 border-b-2 border-[#c1b087] pb-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#f5d77f] via-[#d4af37] to-[#8c6239] border-2 border-[#fff1aa] shadow-md shrink-0">
            <Share2 className="h-6 w-6 text-[#122017]" />
          </div>
          <div>
            <p className="text-xs font-guild font-bold uppercase tracking-widest text-gold-stamped">Inscribe Invitation</p>
            <h3 className="text-xl sm:text-2xl font-bold font-guild text-[#4a2e18]">
              Share Guild Registry
            </h3>
          </div>
        </div>

        {/* Open Graph / Social Embed Preview Card */}
        <div className="mt-6 space-y-2">
          <label className="text-xs font-guild font-bold uppercase tracking-wider text-[#6e5338] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#8c6239]" />
            <span>Open Graph Link Preview Card</span>
          </label>
          
          <div className="overflow-hidden rounded-xl border-2 border-[#8c6239] bg-[#162a1e] shadow-lg">
            {/* Graphic Banner Display */}
            <div className="relative aspect-[1.91/1] w-full bg-[#122017] border-b border-[#d4af37]/40 overflow-hidden flex items-center justify-center">
              <img
                src="/og-image.svg"
                alt="SkillQuest Open Graph Banner"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-[#fff1aa] bg-[#1b3626]/90 px-3 py-1 text-[11px] font-guild font-bold text-[#f5d77f] shadow">
                <Shield className="h-3.5 w-3.5 fill-[#f5d77f]" />
                <span>Verified Guild Link</span>
              </div>
            </div>

            {/* Embed Text Preview */}
            <div className="p-4 text-[#f4ecd8] space-y-1 bg-gradient-to-b from-[#1b3626] to-[#122017]">
              <div className="flex items-center gap-2">
                <img src="/icon.svg" alt="SkillQuest Logo" className="h-5 w-5 rounded object-cover border border-[#d4af37]" />
                <span className="text-xs font-guild font-bold text-[#f5d77f] uppercase tracking-wide">skillquest.app</span>
              </div>
              <h4 className="font-bold text-sm sm:text-base text-[#fff8ea] font-serif leading-snug">
                SkillQuest - Adventurer&apos;s Guild &amp; RPG Quest Registry
              </h4>
              <p className="text-xs text-[#c2b59b] line-clamp-2 leading-relaxed">
                Level up your real-world skills with an RPG-style quest board. Track Novice to Legendary bounties, seal visual proof of deeds, and earn guild prestige.
              </p>
            </div>
          </div>
        </div>

        {/* Primary Share Action Buttons */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 rounded-lg btn-bronze px-4 py-3 font-guild font-bold text-sm shadow-md hover:scale-[1.02] transition"
          >
            <Share2 className="h-4 w-4 text-[#f5d77f]" />
            <span>Share via Device...</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className={`flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 font-guild font-bold text-sm transition shadow-sm ${
              copied
                ? "border-[#10b981] bg-[#dcfce7] text-[#166534]"
                : "border-[#8c6239] bg-[#fff8ea] text-[#4a2e18] hover:bg-[#ebdcc0]"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-[#10b981]" />
                <span>Link Inscribed! (Copied)</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-[#8c6239]" />
                <span>Copy Guild URL</span>
              </>
            )}
          </button>
        </div>

        {/* Social Dispatch Shortcuts */}
        <div className="mt-6 pt-5 border-t border-[#c1b087] space-y-3">
          <p className="text-xs font-guild font-bold uppercase tracking-wider text-[#6e5338] text-center">
            Dispatch Directly via Courier Networks
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => openSocialShare("twitter")}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[#8c6239]/80 bg-[#fff8ea] p-2.5 text-xs font-semibold text-[#4a2e18] hover:bg-[#ebdcc0] hover:border-[#8c6239] transition shadow-sm"
            >
              <Send className="h-3.5 w-3.5 text-[#1da1f2]" />
              <span>Twitter / X</span>
            </button>

            <button
              type="button"
              onClick={() => openSocialShare("whatsapp")}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[#8c6239]/80 bg-[#fff8ea] p-2.5 text-xs font-semibold text-[#4a2e18] hover:bg-[#ebdcc0] hover:border-[#8c6239] transition shadow-sm"
            >
              <Send className="h-3.5 w-3.5 text-[#25d366]" />
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => openSocialShare("linkedin")}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[#8c6239]/80 bg-[#fff8ea] p-2.5 text-xs font-semibold text-[#4a2e18] hover:bg-[#ebdcc0] hover:border-[#8c6239] transition shadow-sm"
            >
              <ExternalLink className="h-3.5 w-3.5 text-[#0a66c2]" />
              <span>LinkedIn</span>
            </button>

            <button
              type="button"
              onClick={() => openSocialShare("telegram")}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-[#8c6239]/80 bg-[#fff8ea] p-2.5 text-xs font-semibold text-[#4a2e18] hover:bg-[#ebdcc0] hover:border-[#8c6239] transition shadow-sm"
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
