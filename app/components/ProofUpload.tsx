"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Camera, Check, Loader2 } from "lucide-react";
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
}: ProofUploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { user, profile, login, awardXp } = useAuth();

  useEffect(() => {
    return () => {
      if (preview && !preview.startsWith("data:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  async function handleFile(file: File) {
    if (disabled) return;
    if (isFirebaseConfigured() && !user) {
      alert("Please sign in with your Google account to submit evidence and earn XP!");
      await login();
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      let finalImageUrl = "";
      try {
        if (isCloudinaryConfigured()) {
          finalImageUrl = await uploadToCloudinary(file);
        } else {
          throw new Error("No Cloudinary configured");
        }
      } catch {
        finalImageUrl = await fileToBase64(file);
      }

      const quest = questId ? QUESTS.find((q) => q.id === questId) : null;
      const title = questTitle ?? quest?.title ?? "General Quest";
      const badge = quest ? badgeForQuest(quest.level) : "Bronze";
      const activeName = propUserName || profile.name || "Adventurer";

      const payload = {
        userName: activeName,
        userId: profile.id,
        questId: questId ?? "general",
        questTitle: title,
        badge,
        imageUrl: finalImageUrl,
      };

      if (isFirebaseConfigured()) {
        await postCompletion(payload);
      } else {
        addLocalCompletion(payload);
      }

      await awardXp(quest ? quest.xpReward : 50, questId ?? "general");

      setSuccess(true);
      onSuccess?.(finalImageUrl);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Upload failed. Please try a smaller image.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" onChange={onChange} className="hidden" />

      {preview && (
        <div className="relative mb-4 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
          <img
            src={preview}
            alt="Upload preview"
            className="h-40 w-full object-cover opacity-90"
          />
        </div>
      )}

      {disabled && disabledReason && (
        <p className="mb-3 text-sm text-fuchsia-400">{disabledReason}</p>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || uploading}
        className={`inline-flex items-center gap-2 rounded-xl font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
          compact
            ? "bg-cyan-600/80 border border-cyan-400/50 px-4 py-2 text-sm hover:bg-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            : "bg-white/10 border border-white/10 px-5 py-3 text-sm hover:bg-white/20 backdrop-blur-md"
        }`}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin text-cyan-300" />
        ) : success ? (
          <Check className="h-4 w-4 text-emerald-400" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
        <span>
          {uploading ? "Encrypting..." : success ? "Verified!" : compact ? "Upload" : "Upload Evidence"}
        </span>
      </button>

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </div>
  );
}