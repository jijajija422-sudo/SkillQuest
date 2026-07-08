"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
  X, Upload, Camera, Loader2, Check, Sparkles,
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
  { label: "Bronze — Getting Started", value: "Bronze" },
  { label: "Silver — Building Momentum", value: "Silver" },
  { label: "Gold — Impressive Work!", value: "Gold" },
  { label: "Platinum — Elite Level", value: "Platinum" },
  { label: "Legendary — Extraordinary!", value: "Legendary" },
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
      setError("Please enter a title for your achievement.");
      return;
    }
    if (!selectedFile) {
      setError("Please attach a proof image.");
      return;
    }

    if (isFirebaseConfigured() && !user) {
      alert("Please sign in with Google to post your achievement!");
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
      setError("Something went wrong. Please try a smaller image or check your connection.");
    } finally {
      setUploading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md p-2 sm:p-4 sm:items-center animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-quest-modal-title"
    >
      <div
        className="max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-t-[2.5rem] sm:rounded-[2.5rem] border border-fuchsia-500/30 bg-slate-950 shadow-[0_0_60px_rgba(217,70,239,0.2)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-white/10 bg-slate-900/95 p-5 sm:p-6 backdrop-blur-xl">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-fuchsia-500/40 bg-fuchsia-900/40 text-fuchsia-300 shrink-0">
              <PenLine className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-fuchsia-400">Your Story</p>
              <h2 id="custom-quest-modal-title" className="text-lg sm:text-xl font-black text-white leading-tight">
                Share Your Own Achievement
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full bg-white/5 border border-white/10 p-2.5 text-slate-400 hover:bg-white/15 hover:text-white transition shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-5 sm:p-6">
          {success ? (
            <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/40 p-8 text-center space-y-3 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <Check className="mx-auto h-12 w-12 text-emerald-400 animate-bounce" />
              <p className="text-xl font-black text-white">Achievement Posted! 🎉</p>
              <p className="text-sm text-emerald-300">+50 XP bonus awarded for sharing your personal win with the guild!</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-300 leading-relaxed">
                Completed something amazing that&apos;s not in the quest board? Post it here and inspire the guild! Every personal win counts. 🌟
              </p>

              {/* XP Bonus Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-950/60 border border-amber-500/30 px-4 py-2 text-xs font-bold text-amber-300">
                <Sparkles className="h-3.5 w-3.5 fill-amber-300 text-amber-300 animate-pulse" />
                <span>+50 XP bonus for posting a personal achievement</span>
              </div>

              {/* Achievement Title */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-fuchsia-400">
                  <Trophy className="h-3.5 w-3.5" />
                  <span>What did you accomplish? <span className="text-rose-400">*</span></span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={80}
                  placeholder="e.g. Ran my first 10K, Built a guitar from scratch, Learned to surf…"
                  className="w-full rounded-2xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition"
                />
                <p className="text-right text-[11px] text-slate-500">{title.length}/80</p>
              </div>

              {/* Category & Badge Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-fuchsia-400">
                    <Tag className="h-3.5 w-3.5" />
                    <span>Category</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-2xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition cursor-pointer"
                  >
                    {CUSTOM_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-slate-900 text-white">{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-fuchsia-400">
                    <Trophy className="h-3.5 w-3.5" />
                    <span>Difficulty</span>
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full rounded-2xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition cursor-pointer"
                  >
                    {BADGE_OPTIONS.map((b) => (
                      <option key={b.value} value={b.value} className="bg-slate-900 text-white">{b.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reflection/Caption */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-fuchsia-400">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>Tell your story <span className="text-slate-500 normal-case font-normal tracking-normal">(optional but encouraged!)</span></span>
                </label>
                <textarea
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={500}
                  placeholder="How did it feel? What was the hardest part? What would you tell someone just starting? Share your experience with the guild…"
                  className="w-full resize-none rounded-2xl border border-white/15 bg-black/40 p-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition leading-relaxed"
                />
                <p className="text-right text-[11px] text-slate-500">{caption.length}/500</p>
              </div>

              {/* Image Upload Zone */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-fuchsia-400">
                  <Camera className="h-3.5 w-3.5" />
                  <span>Proof image <span className="text-rose-400">*</span></span>
                </label>
                <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />

                {!preview ? (
                  <div
                    onDrop={onDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onClick={() => inputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${
                      dragOver
                        ? "border-fuchsia-400 bg-fuchsia-950/40 scale-[1.01] shadow-[0_0_25px_rgba(217,70,239,0.25)]"
                        : "border-white/20 bg-white/5 hover:border-fuchsia-500/60 hover:bg-fuchsia-950/20"
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition ${dragOver ? "border-fuchsia-400 bg-fuchsia-900/50 text-fuchsia-300" : "border-white/15 bg-white/5 text-slate-400"}`}>
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{dragOver ? "Drop it here!" : "Drag & drop your proof image"}</p>
                      <p className="text-xs text-slate-400 mt-1">or <span className="text-fuchsia-400 font-semibold underline underline-offset-2">click to browse</span></p>
                      <p className="text-[11px] text-slate-500 mt-1.5">PNG, JPG, GIF, WebP — max ~5MB</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/50 shadow-inner">
                    <img src={preview} alt="Upload preview" className="h-44 w-full object-cover opacity-95" />
                    <button
                      type="button"
                      onClick={() => { setPreview(null); setSelectedFile(null); }}
                      className="absolute top-3 right-3 rounded-full bg-black/80 border border-white/20 p-1.5 text-white hover:bg-black/95 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="text-xs text-white/80 font-medium">✅ Image ready to submit!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 px-4 py-3 text-sm text-rose-300 font-medium">
                  ⚠️ {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={uploading || !title.trim() || !selectedFile}
                className={`w-full inline-flex items-center justify-center gap-2.5 rounded-2xl py-3.5 text-sm font-black transition-all duration-200 ${
                  !title.trim() || !selectedFile
                    ? "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"
                    : uploading
                    ? "bg-fuchsia-700/80 border border-fuchsia-500/50 text-white cursor-wait"
                    : "bg-gradient-to-r from-fuchsia-500 to-purple-600 border border-fuchsia-300/30 text-white shadow-[0_0_25px_rgba(217,70,239,0.4)] hover:shadow-[0_0_40px_rgba(217,70,239,0.6)] hover:scale-[1.01] active:scale-[0.99]"
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Posting to Guild…</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Share with the Guild (+50 XP)</span>
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
