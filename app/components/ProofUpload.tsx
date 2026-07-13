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
      const activeName = propUserName || profile.name || "Member";

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
      setError("Upload failed. Please try a smaller image or check your network connection.");
    } finally {
      setUploading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-[#e6ecf2] p-5 text-center space-y-2 shadow-neu-inset-sm">
        <Check className="mx-auto h-8 w-8 text-teal-600" />
        <p className="font-bold text-slate-800 text-base">Project Verified Successfully</p>
        <p className="text-xs text-slate-600">Your project verification is now recorded in Recent Activity.</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div>
        <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />
        {preview && (
          <div className="relative mb-3 overflow-hidden rounded-xl border border-slate-200/80 shadow-neu-inset-sm">
            <img src={preview} alt="preview" className="h-32 w-full object-cover" />
            <button onClick={clearImage} className="absolute top-2 right-2 rounded-xl bg-[#e6ecf2]/90 border border-slate-200/80 p-1 text-slate-600 hover:bg-[#f0f4f8] transition shadow-neu-raised-sm">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        {disabled && disabledReason && (
          <p className="mb-3 text-sm font-semibold text-slate-500">{disabledReason}</p>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
          className="inline-flex items-center gap-2 rounded-xl btn-bronze px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50 transition shadow-neu-raised-sm"
        >
          <Camera className="h-4 w-4" />
          <span>Select Project Photo</span>
        </button>
        {error && <p className="mt-2 text-sm text-red-600 font-semibold">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />

      {/* Drop zone */}
      {!preview ? (
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition ${
            disabled
              ? "border-slate-300 bg-slate-100/60 cursor-not-allowed opacity-60"
              : dragOver
              ? "border-teal-500 bg-teal-50/50"
              : "border-slate-300 bg-[#e6ecf2] hover:border-teal-500 hover:bg-[#f0f4f8] shadow-neu-inset-sm"
          }`}
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl border transition shadow-neu-raised-sm ${dragOver ? "border-teal-500 bg-teal-100 text-teal-600" : "border-slate-200/80 bg-[#f0f4f8] text-slate-600"}`}>
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">{dragOver ? "Drop photo here" : "Drag & drop your verification photo"}</p>
            <p className="text-xs text-slate-600 mt-1">or <span className="text-slate-800 font-bold underline underline-offset-2">browse files</span></p>
            <p className="text-[11px] text-slate-500 mt-1.5">PNG, JPG, GIF, WebP</p>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 shadow-neu-inset-sm">
          <img src={preview} alt="Upload preview" className="h-48 w-full object-cover" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-3 right-3 rounded-xl bg-[#e6ecf2]/90 border border-slate-200/80 p-1.5 text-slate-600 hover:bg-[#f0f4f8] transition shadow-neu-raised-sm"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-3">
            <p className="text-xs text-white font-bold">Verification photo ready for submission</p>
          </div>
        </div>
      )}

      {/* Reflection */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <MessageSquare className="h-3.5 w-3.5 text-teal-600" />
          <span>Project Notes <span className="text-slate-500 font-normal">(optional description)</span></span>
        </label>
        <textarea
          rows={3}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          disabled={disabled}
          maxLength={400}
          placeholder="Describe your process, challenges overcome, or learnings..."
          className="w-full resize-none rounded-xl border border-slate-200/80 bg-[#e6ecf2] p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition leading-relaxed disabled:opacity-50 shadow-neu-inset-sm font-medium"
        />
        <p className="text-right text-[11px] text-slate-500 font-bold">{caption.length}/400</p>
      </div>

      {/* Disabled reason */}
      {disabled && disabledReason && (
        <p className="text-sm font-semibold text-slate-500">{disabledReason}</p>
      )}

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || uploading || !selectedFile}
        className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition shadow-neu-raised-sm ${
          !selectedFile || disabled
            ? "bg-[#e6ecf2] border border-slate-200/80 text-slate-400 cursor-not-allowed shadow-none"
            : uploading
            ? "btn-bronze cursor-wait"
            : "btn-bronze hover:scale-[1.01]"
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Submitting Verification...</span>
          </>
        ) : (
          <>
            <Camera className="h-4 w-4" />
            <span>{selectedFile ? "Submit Verification" : "Select Photo First"}</span>
          </>
        )}
      </button>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 shadow-sm">
          {error}
        </div>
      )}
    </div>
  );
}