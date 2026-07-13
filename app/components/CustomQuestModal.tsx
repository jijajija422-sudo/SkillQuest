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
  { label: "Foundational Badge — Beginner", value: "Foundational" },
  { label: "Journeyman Badge — Intermediate", value: "Journeyman" },
  { label: "Adventurer Badge — Experienced", value: "Adventurer" },
  { label: "Advanced Badge — Expert", value: "Advanced" },
  { label: "Masterclass Badge — Master", value: "Masterclass" },
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
  const [badge, setBadge] = useState("Adventurer");
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
    setBadge("Adventurer");
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
      setError("Please enter a title for your skill verification.");
      return;
    }
    if (!selectedFile) {
      setError("Please attach a verification image.");
      return;
    }

    if (isFirebaseConfigured() && !user) {
      alert("Please sign in with Google to share your skill!");
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

      const activeName = profile.name || "Member";

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
      setError("Something went wrong. Please check your image size and network connection.");
    } finally {
      setUploading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-2 sm:p-4 sm:items-center transition backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-quest-modal-title"
    >
      <div
        className="max-h-[95vh] w-full max-w-xl overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-slate-200/80 bg-[#f0f4f8] shadow-neu-raised-lg text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200/80 bg-[#f0f4f8]/95 backdrop-blur-md p-5 sm:p-6 shadow-neu-raised-sm">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200/80 bg-[#e6ecf2] text-blue-600 shrink-0 shadow-neu-inset-sm">
              <PenLine className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600">Post a New Skill Verification</p>
              <h2 id="custom-quest-modal-title" className="text-base sm:text-xl font-bold text-slate-800 leading-tight">
                Share Your Skill &amp; Project
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-xl border border-slate-200/80 p-2 text-slate-500 hover:text-red-600 transition shrink-0 shadow-neu-raised-sm"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 p-5 sm:p-6">
          {success ? (
            <div className="rounded-2xl border border-slate-200/80 bg-[#e6ecf2] p-8 text-center space-y-3 shadow-neu-inset-sm">
              <Check className="mx-auto h-12 w-12 text-teal-600" />
              <p className="text-xl font-bold text-slate-800">Verification Shared to Activity Feed</p>
              <p className="text-sm text-slate-600 font-semibold">+50 Progress Steps awarded for verifying your skill project.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-600 leading-relaxed">
                Completed a personal project or mastered a skill outside our featured explorations? Share your verification here and inspire the community.
              </p>

              {/* XP note */}
              <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-3.5 py-2 text-xs font-bold text-teal-700 shadow-neu-inset-sm">
                <Trophy className="h-4 w-4 text-teal-600" />
                <span>+50 Progress Steps awarded upon verification</span>
              </div>

              {/* Title */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Trophy className="h-3.5 w-3.5 text-teal-600" />
                  <span>Project / Skill Title <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={80}
                  placeholder="e.g. Built a Next.js SaaS app, Designed a UI kit, Mastered Python..."
                  className="w-full rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition font-semibold shadow-neu-inset-sm"
                />
                <p className="text-right text-[11px] text-slate-400">{title.length}/80</p>
              </div>

              {/* Category & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Tag className="h-3.5 w-3.5 text-teal-600" />
                    <span>Category</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-4 py-3 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 transition cursor-pointer shadow-neu-inset-sm"
                  >
                    {CUSTOM_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    <Trophy className="h-3.5 w-3.5 text-teal-600" />
                    <span>Badge Level</span>
                  </label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className="w-full rounded-xl border border-slate-200/80 bg-[#e6ecf2] px-4 py-3 text-sm text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 transition cursor-pointer shadow-neu-inset-sm"
                  >
                    {BADGE_OPTIONS.map((b) => (
                      <option key={b.value} value={b.value}>{b.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <MessageSquare className="h-3.5 w-3.5 text-teal-600" />
                  <span>Project Summary &amp; Learnings <span className="text-slate-400 font-normal">(optional)</span></span>
                </label>
                <textarea
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={500}
                  placeholder="Share details: What did you build? What obstacles arose and how did you solve them?"
                  className="w-full resize-none rounded-xl border border-slate-200/80 bg-[#e6ecf2] p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition leading-relaxed font-semibold shadow-neu-inset-sm"
                />
                <p className="text-right text-[11px] text-slate-400">{caption.length}/500</p>
              </div>

              {/* Image upload */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Camera className="h-3.5 w-3.5 text-teal-600" />
                  <span>Verification Image <span className="text-red-500">*</span></span>
                </label>
                <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />

                {!preview ? (
                  <div
                    onDrop={onDrop}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onClick={() => inputRef.current?.click()}
                    className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition ${
                      dragOver ? "border-teal-500 bg-teal-50/40" : "border-slate-300 bg-[#e6ecf2]/60 hover:border-slate-400 hover:bg-[#e6ecf2]"
                    }`}
                  >
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200/80 transition shadow-neu-raised-sm ${dragOver ? "bg-teal-100 text-teal-700" : "bg-[#f0f4f8] text-slate-600"}`}>
                      <Upload className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{dragOver ? "Drop image here" : "Drag & drop verification image"}</p>
                      <p className="text-xs text-slate-500 mt-1">or <span className="text-teal-600 font-bold underline underline-offset-2">browse files from device</span></p>
                      <p className="text-[11px] text-slate-400 mt-1.5">PNG, JPG, GIF, WebP</p>
                    </div>
                  </div>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 shadow-neu-raised-sm">
                    <img src={preview} alt="Upload preview" className="h-48 w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setPreview(null); setSelectedFile(null); }}
                      className="absolute top-3 right-3 rounded-xl bg-slate-900/80 border border-slate-700 p-1.5 text-white hover:bg-slate-900 transition shadow-sm"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-3">
                      <p className="text-xs text-white font-bold">Verification image ready for upload</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 shadow-neu-inset-sm">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={uploading || !title.trim() || !selectedFile}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition shadow-neu-raised-sm ${
                  !title.trim() || !selectedFile
                    ? "bg-slate-200 border border-slate-300 text-slate-400 cursor-not-allowed"
                    : uploading
                    ? "btn-bronze cursor-wait"
                    : "btn-bronze hover:scale-[1.01]"
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Publishing to Activity Feed...</span>
                  </>
                ) : (
                  <>
                    <PenLine className="h-4 w-4" />
                    <span>Publish &amp; Verify (+50 Progress Steps)</span>
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

