"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
  X, Upload, Camera, Loader2, Check,
  MessageSquare, Tag, Trophy, PenLine
} from "lucide-react";
import { isCloudinaryConfigured, uploadToCloudinary } from "@/lib/upload";
import { isFirebaseConfigured, postCompletion } from "@/lib/firebase";
import { addLocalCompletion } from "@/lib/feed-storage";
import { useAuth } from "@/lib/auth-context";

const CUSTOM_CATEGORIES = [
  "Coding & Tech",
  "Culinary & Baking",
  "Arts & Crafts",
  "Music & Audio",
  "Fitness & Outdoors",
  "Mindfulness & Reading",
  "Community & Gaming",
  "Design & Career",
  "Learning & Education",
  "Travel & Adventure",
  "Sports & Athletics",
  "Personal Growth",
  "DIY & Making",
  "Other Achievement",
];

const BADGE_OPTIONS = [
  { label: "Bronze Medal — Getting Started", value: "Bronze" },
  { label: "Silver Medal — Building Momentum", value: "Silver" },
  { label: "Gold Medal — Impressive Work", value: "Gold" },
  { label: "Platinum Medal — Elite Level", value: "Platinum" },
  { label: "Legendary Medal — Extraordinary", value: "Legendary" },
];

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

interface CustomQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CustomQuestModal({ isOpen, onClose }: CustomQuestModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CUSTOM_CATEGORIES[0]);
  const [badge, setBadge] = useState("Gold");
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { user, profile, login, awardXp } = useAuth();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    return () => {
      if (preview && !preview.startsWith("data:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function reset() {
    setTitle("");
    setCategory(CUSTOM_CATEGORIES[0]);
    setBadge("Gold");
    setCaption("");
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    setSuccess(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function selectFile(file: File) {
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setSelectedFile(file);
    setError(null);
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) selectFile(file);
    e.target.value = "";
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) selectFile(file);
  }

  async function handleSubmit() {
    if (!title.trim()) {
      setError("Please enter a title for your custom deed.");
      return;
    }
    if (!selectedFile) {
      setError("Please attach a proof illustration.");
      return;
    }

    if (isFirebaseConfigured() && !user) {
      alert("Please sign in with Google to post your deed!");
      await login();
      return;
    }

    setError(null);
    setUploading(true);

    try {
      let finalImageUrl = "";
      try {
        if (isCloudinaryConfigured()) {
          finalImageUrl = await uploadToCloudinary(selectedFile);
        } else {
          throw new Error("No Cloudinary");
        }
      } catch {
        finalImageUrl = await fileToBase64(selectedFile);
      }

      const activeName = profile.name || "Adventurer";

      const payload = {
        userName: activeName,
        userId: profile.id,
        questId: `custom-${Date.now()}`,
        questTitle: title.trim(),
        badge,
        imageUrl: finalImageUrl,
        caption: caption.trim() || undefined,
        isCustom: true,
      };

      if (isFirebaseConfigured()) {
        await postCompletion(payload);
      } else {
        addLocalCompletion(payload);
      }

      await awardXp(50, `custom-${Date.now()}`);

      setSuccess(true);
      setTimeout(() => {
        reset();
        onClose();
      }, 2500);
    } catch {
      setError("Something went wrong. Please try a smaller image or check your guild connection.");
    } finally {
      setUploading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-2 sm:p-4 sm:items-center transition"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-quest-modal-title"
    >
      <div
        className="max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-t-2xl sm:rounded-2xl border-4 border-[#4a2e18] bg-parchment shadow-[0_16px_40px_rgba(0,0,0,0.85)] text-[#2b2118]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b-2 border-[#8c6239] bg-[#fcf8ed] p-5 sm:p-6 shadow-md">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[#8c6239] bg-[#fff8ea] text-[#4a2e18] shrink-0 shadow-inner">
              <PenLine className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-guild font-bold uppercase tracking-wider text-[#8c6239]">Inscribe New Bounty Deed</p>
              <h2 id="custom-quest-modal-title" className="text-base sm:text-xl font-bold font-guild text-[#2b2118] leading-tight">
                Share Custom Deed & Proof
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-[#8c6239] p-2 text-[#6e5338] hover:bg-[#ebdcc0] hover:text-[#2b2118] transition shrink-0"
            aria-label="Close scroll"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-5 sm:p-6">
          {success ? (
            <div className="rounded-xl border-2 border-[#8c6239] bg-[#ebdcc0] p-8 text-center space-y-3 shadow-inner">
              <Check className="mx-auto h-12 w-12 text-[#235338]" />
              <p className="text-xl font-bold font-guild text-[#4a2e18]">Deed Inscribed into the Chronicle</p>
              <p className="text-sm text-[#6e5338] font-guild font-semibold">+50 Prestige XP awarded for sharing your independent deed.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-[#5c3a1a] leading-relaxed font-serif">
                Mastered an independent trial not listed on the Guild Bounty Board? Inscribe your deed here and inspire fellow adventurers.
              </p>

              {/* XP note */}
              <div className="inline-flex items-center gap-2 rounded-lg border border-[#8c6239] bg-[#fff8ea] px-3.5 py-2 text-xs font-guild font-bold text-[#5c3a1a] shadow-sm">
                <Trophy className="h-4 w-4 text-[#8c6239]" />
                <span>+50 Prestige XP awarded upon inscription</span>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-guild font-bold text-[#5c3a1a]">
                  <Trophy className="h-3.5 w-3.5 text-[#8c6239]" />
                  <span>Title of Your Accomplishment <span className="text-red-700">*</span></span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={80}
                  placeholder="e.g. Crafted a walnut shield, Ran a 10K marathon, Mastered Python..."
                  className="w-full rounded-lg border border-[#8c6239] bg-[#fff8ea] px-4 py-3 text-sm text-[#2b2118] placeholder:text-[#9e886d] focus:outline-none focus:ring-2 focus:ring-[#4a2e18] transition shadow-inner"
                />
                <p className="text-right text-[11px] text-[#8c6239] font-guild">{title.length}/80</p>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-guild font-bold text-[#5c3a1a]">
                    <Tag className="h-3.5 w-3.5 text-[#8c6239]" />
                    <span>Deed Category</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-lg border border-[#8c6239] bg-[#fff8ea] px-4 py-3 text-sm text-[#2b2118] font-semibold focus:outline-none focus:ring-2 focus:ring-[#4a2e18] transition cursor-pointer shadow-inner"
                  >
                    {CUSTOM_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-guild font-bold text-[#5c3a1a]">
                    <Trophy className="h-3.5 w-3.5 text-[#8c6239]" />
                    <span>Medal Rank</span>
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full rounded-lg border border-[#8c6239] bg-[#fff8ea] px-4 py-3 text-sm text-[#2b2118] font-semibold focus:outline-none focus:ring-2 focus:ring-[#4a2e18] transition cursor-pointer shadow-inner"
                  >
                    {BADGE_OPTIONS.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-guild font-bold text-[#5c3a1a]">
                  <MessageSquare className="h-3.5 w-3.5 text-[#8c6239]" />
                  <span>Chronicle Story <span className="text-[#8c6239] font-normal">(optional)</span></span>
                </label>
                <textarea
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={500}
                  placeholder="Pen your tale: What obstacles arose? How did you overcome them?"
                  className="w-full resize-none rounded-lg border border-[#8c6239] bg-[#fff8ea] p-4 text-sm text-[#2b2118] placeholder:text-[#9e886d] focus:outline-none focus:ring-2 focus:ring-[#4a2e18] transition leading-relaxed shadow-inner"
                />
                <p className="text-right text-[11px] text-[#8c6239] font-guild">{caption.length}/500</p>
              </div>

              {/* Image upload */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-guild font-bold text-[#5c3a1a]">
                  <Camera className="h-3.5 w-3.5 text-[#8c6239]" />
                  <span>Visual Proof Illustration <span className="text-red-700">*</span></span>
                </label>
                <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />

                {!preview ? (
                  <div
                    onDrop={onDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onClick={() => inputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition ${
                      dragOver ? "border-[#4a2e18] bg-[#ebdcc0]" : "border-[#8c6239] bg-[#fff8ea] hover:border-[#4a2e18] hover:bg-[#fdfaf3]"
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 transition ${dragOver ? "border-[#4a2e18] bg-[#d8caa8] text-[#4a2e18]" : "border-[#8c6239] bg-[#ebdcc0] text-[#5c3a1a]"}`}>
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold font-guild text-[#4a2e18] text-sm">{dragOver ? "Unfurl illustration here" : "Drag & drop visual proof"}</p>
                      <p className="text-xs text-[#6e5338] mt-1">or <span className="text-[#4a2e18] font-bold underline underline-offset-2">inspect parchment scrolls</span></p>
                      <p className="text-[11px] text-[#8c6239] mt-1.5">PNG, JPG, GIF, WebP</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-xl border-2 border-[#8c6239] shadow-md">
                    <img src={preview} alt="Upload preview" className="h-48 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setPreview(null); setSelectedFile(null); }}
                      className="absolute top-3 right-3 rounded-lg bg-[#fff8ea]/90 border border-[#8c6239] p-1.5 text-[#5c3a1a] hover:bg-[#fff8ea] transition shadow-sm"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#24160d]/80 to-transparent p-3">
                      <p className="text-xs text-[#f4ecd8] font-guild font-bold">Proof ready for inscription</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-lg border border-red-700 bg-red-100 px-4 py-3 text-sm font-semibold text-red-900 shadow-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={uploading || !title.trim() || !selectedFile}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-guild font-bold transition shadow-md ${
                  !title.trim() || !selectedFile
                    ? "bg-[#ebdcc0] border border-[#c1b087] text-[#9e886d] cursor-not-allowed"
                    : uploading
                    ? "btn-bronze cursor-wait"
                    : "btn-bronze"
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Inscribing into Chronicle...</span>
                  </>
                ) : (
                  <>
                    <PenLine className="h-4 w-4" />
                    <span>Seal & Share Deed (+50 XP)</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
