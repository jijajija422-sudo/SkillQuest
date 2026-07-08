"use client";

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Camera, Check, Loader2, Upload, X, MessageSquare } from "lucide-react";
import { isCloudinaryConfigured, uploadToCloudinary } from "@/lib/upload";
import { isFirebaseConfigured, postCompletion } from "@/lib/firebase";
import { addLocalCompletion } from "@/lib/feed-storage";
import { badgeForQuest, QUESTS } from "@/lib/quests";
import { useAuth } from "@/lib/auth-context";

interface ProofUploadProps {
  questId?: string;
  questTitle?: string;
  userName?: string;
  disabled?: boolean;
  disabledReason?: string;
  onSuccess?: (imageUrl: string) => void;
  compact?: boolean;
  // Caption pre-seeded from parent (e.g. reflection textarea in QuestModal)
  externalCaption?: string;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function ProofUpload({
  questId,
  questTitle,
  userName: propUserName,
  disabled = false,
  disabledReason,
  onSuccess,
  compact = false,
  externalCaption,
}: ProofUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState(externalCaption ?? "");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { user, profile, login, awardXp } = useAuth();

  // Sync external caption if parent updates it
  useEffect(() => {
    if (externalCaption !== undefined) setCaption(externalCaption);
  }, [externalCaption]);

  useEffect(() => {
    return () => {
      if (preview && !preview.startsWith("data:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function selectFile(file: File) {
    if (disabled) return;
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setSelectedFile(file);
    setError(null);
    setSuccess(false);
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

  function clearImage() {
    setPreview(null);
    setSelectedFile(null);
  }

  async function handleSubmit() {
    if (disabled || !selectedFile) return;

    if (isFirebaseConfigured() && !user) {
      alert("Please sign in with your Google account to submit evidence and earn XP!");
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

      const quest = questId ? QUESTS.find((q) => q.id === questId) : null;
      const title = questTitle ?? quest?.title ?? "Personal Achievement";
      const badge = quest ? badgeForQuest(quest.level) : "Bronze";
      const activeName = propUserName || profile.name || "Adventurer";

      const payload = {
        userName: activeName,
        userId: profile.id,
        questId: questId ?? "general",
        questTitle: title,
        badge,
        imageUrl: finalImageUrl,
        caption: caption.trim() || undefined,
      };

      if (isFirebaseConfigured()) {
        await postCompletion(payload);
      } else {
        addLocalCompletion(payload);
      }

      await awardXp(quest ? quest.xpReward : 50, questId ?? "general");

      setSuccess(true);
      setSelectedFile(null);
      setPreview(null);
      setCaption("");
      onSuccess?.(finalImageUrl);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      setError("Upload failed. Please try a smaller image or check your connection.");
    } finally {
      setUploading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/40 p-5 text-center space-y-2 shadow-[0_0_25px_rgba(16,185,129,0.2)]">
        <Check className="mx-auto h-8 w-8 text-emerald-400" />
        <p className="font-bold text-emerald-300 text-base">Evidence submitted to the Guild! 🎉</p>
        <p className="text-xs text-emerald-400/80">Your achievement is now live in the feed.</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div>
        <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />
        {preview && (
          <div className="relative mb-3 overflow-hidden rounded-xl border border-white/10 bg-black/40">
            <img src={preview} alt="preview" className="h-32 w-full object-cover opacity-90" />
            <button onClick={clearImage} className="absolute top-2 right-2 rounded-full bg-black/70 p-1 text-white hover:bg-black/90 transition">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        {disabled && disabledReason && (
          <p className="mb-3 text-sm text-amber-400 font-medium">{disabledReason}</p>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-600/80 border border-cyan-400/50 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.3)] disabled:cursor-not-allowed disabled:opacity-50 transition"
        >
          <Camera className="h-4 w-4" />
          <span>Upload</span>
        </button>
        {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />

      {/* Drag-and-drop / click zone */}
      {!preview ? (
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 ${
            disabled
              ? "border-white/10 bg-black/20 cursor-not-allowed opacity-60"
              : dragOver
              ? "border-cyan-400 bg-cyan-950/40 scale-[1.01] shadow-[0_0_25px_rgba(6,182,212,0.25)]"
              : "border-white/20 bg-white/5 hover:border-cyan-500/60 hover:bg-cyan-950/20"
          }`}
        >
          <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition ${dragOver ? "border-cyan-400 bg-cyan-900/50 text-cyan-300" : "border-white/15 bg-white/5 text-slate-400"}`}>
            <Upload className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">{dragOver ? "Drop your image here!" : "Drag & drop your proof image"}</p>
            <p className="text-xs text-slate-400 mt-1">or <span className="text-cyan-400 font-semibold underline underline-offset-2">click to browse files</span></p>
            <p className="text-[11px] text-slate-500 mt-1.5">PNG, JPG, GIF, WebP — max ~5MB</p>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-black/50 shadow-inner">
          <img src={preview} alt="Upload preview" className="h-48 w-full object-cover opacity-95" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-3 right-3 rounded-full bg-black/80 border border-white/20 p-1.5 text-white hover:bg-black/95 transition shadow-lg"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <p className="text-xs text-white/80 font-medium">✅ Image ready — add a reflection below and submit!</p>
          </div>
        </div>
      )}

      {/* Reflection / Caption textarea */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Your Reflection <span className="text-slate-500 normal-case font-normal tracking-normal">(optional)</span></span>
        </label>
        <textarea
          rows={3}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          disabled={disabled}
          maxLength={400}
          placeholder="How did it feel completing this? What did you learn? Share your story with the guild…"
          className="w-full resize-none rounded-2xl border border-white/15 bg-black/40 p-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition leading-relaxed disabled:opacity-50"
        />
        <p className="text-right text-[11px] text-slate-500">{caption.length}/400</p>
      </div>

      {/* Disabled reason */}
      {disabled && disabledReason && (
        <p className="text-sm text-amber-400 font-semibold flex items-center gap-1.5">
          <span>⚠️</span>
          <span>{disabledReason}</span>
        </p>
      )}

      {/* Submit button */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || uploading || !selectedFile}
        className={`w-full inline-flex items-center justify-center gap-2.5 rounded-2xl py-3.5 text-sm font-bold transition-all duration-200 ${
          !selectedFile || disabled
            ? "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"
            : uploading
            ? "bg-cyan-700/80 border border-cyan-500/50 text-white cursor-wait"
            : "bg-gradient-to-r from-cyan-500 to-indigo-600 border border-cyan-300/30 text-white shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-[1.01] active:scale-[0.99]"
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Submitting to Guild…</span>
          </>
        ) : (
          <>
            <Camera className="h-4 w-4" />
            <span>{selectedFile ? "Submit Proof to Guild Feed" : "Select an Image First"}</span>
          </>
        )}
      </button>

      {error && (
        <div className="rounded-xl border border-rose-500/40 bg-rose-950/40 px-4 py-3 text-sm text-rose-300 font-medium">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}