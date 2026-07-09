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
      setError("Upload failed. Please try a smaller image or check your guild connection.");
    } finally {
      setUploading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border-2 border-[#8c6239] bg-[#ebdcc0] p-5 text-center space-y-2 shadow-inner">
        <Check className="mx-auto h-8 w-8 text-[#235338]" />
        <p className="font-bold font-guild text-[#4a2e18] text-base">Proof Inscribed Successfully</p>
        <p className="text-xs text-[#6e5338]">Your achievement deed is now recorded in the Activity Chronicle.</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div>
        <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />
        {preview && (
          <div className="relative mb-3 overflow-hidden rounded-lg border-2 border-[#8c6239]">
            <img src={preview} alt="preview" className="h-32 w-full object-cover" />
            <button onClick={clearImage} className="absolute top-2 right-2 rounded-lg bg-[#fff8ea]/90 border border-[#8c6239] p-1 text-[#5c3a1a] hover:bg-[#fff8ea] transition shadow-sm">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
        {disabled && disabledReason && (
          <p className="mb-3 text-sm font-guild font-semibold text-[#8c6239]">{disabledReason}</p>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
          className="inline-flex items-center gap-2 rounded-lg btn-bronze px-4 py-2 text-sm font-guild font-bold disabled:cursor-not-allowed disabled:opacity-50 transition"
        >
          <Camera className="h-4 w-4" />
          <span>Select Proof Illustration</span>
        </button>
        {error && <p className="mt-2 text-sm text-red-700 font-semibold">{error}</p>}
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
          className={`relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition ${
            disabled
              ? "border-[#c1b087] bg-[#ebdcc0]/60 cursor-not-allowed opacity-60"
              : dragOver
              ? "border-[#4a2e18] bg-[#ebdcc0]"
              : "border-[#8c6239] bg-[#fff8ea] hover:border-[#4a2e18] hover:bg-[#fdfaf3]"
          }`}
        >
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 transition ${dragOver ? "border-[#4a2e18] bg-[#d8caa8] text-[#4a2e18]" : "border-[#8c6239] bg-[#ebdcc0] text-[#5c3a1a]"}`}>
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <p className="font-bold font-guild text-[#4a2e18] text-sm">{dragOver ? "Unfurl illustration here" : "Drag & drop your visual proof"}</p>
            <p className="text-xs text-[#6e5338] mt-1">or <span className="text-[#4a2e18] font-bold underline underline-offset-2">inspect parchment folders</span></p>
            <p className="text-[11px] text-[#8c6239] mt-1.5">PNG, JPG, GIF, WebP</p>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-xl border-2 border-[#8c6239] shadow-md">
          <img src={preview} alt="Upload preview" className="h-48 w-full object-cover" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-3 right-3 rounded-lg bg-[#fff8ea]/90 border border-[#8c6239] p-1.5 text-[#5c3a1a] hover:bg-[#fff8ea] transition shadow-sm"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#24160d]/80 to-transparent p-3">
            <p className="text-xs text-[#f4ecd8] font-guild font-bold">Proof illustration prepared for inscription</p>
          </div>
        </div>
      )}

      {/* Reflection */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-xs font-guild font-bold text-[#5c3a1a]">
          <MessageSquare className="h-3.5 w-3.5 text-[#8c6239]" />
          <span>Adventurer Reflection <span className="text-[#8c6239] font-normal">(optional chronicle entry)</span></span>
        </label>
        <textarea
          rows={3}
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          disabled={disabled}
          maxLength={400}
          placeholder="Inscribe what you learned while sealing this deed..."
          className="w-full resize-none rounded-lg border border-[#8c6239] bg-[#fff8ea] p-3 text-sm text-[#2b2118] placeholder:text-[#9e886d] focus:outline-none focus:ring-2 focus:ring-[#4a2e18] transition leading-relaxed disabled:opacity-50 shadow-inner"
        />
        <p className="text-right text-[11px] text-[#8c6239] font-guild">{caption.length}/400</p>
      </div>

      {/* Disabled reason */}
      {disabled && disabledReason && (
        <p className="text-sm font-guild font-semibold text-[#8c6239]">{disabledReason}</p>
      )}

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || uploading || !selectedFile}
        className={`w-full inline-flex items-center justify-center gap-2 rounded-lg py-3.5 text-sm font-guild font-bold transition shadow-md ${
          !selectedFile || disabled
            ? "bg-[#ebdcc0] border border-[#c1b087] text-[#9e886d] cursor-not-allowed"
            : uploading
            ? "btn-bronze cursor-wait"
            : "btn-bronze"
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Inscribing Proof into Chronicle...</span>
          </>
        ) : (
          <>
            <Camera className="h-4 w-4" />
            <span>{selectedFile ? "Seal & Submit Proof" : "Select Visual Proof First"}</span>
          </>
        )}
      </button>

      {error && (
        <div className="rounded-lg border border-red-700 bg-red-100 px-4 py-3 text-sm font-semibold text-red-900 shadow-sm">
          {error}
        </div>
      )}
    </div>
  );
}