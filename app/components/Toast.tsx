"use client";

import { useEffect } from "react";
import { X, ShieldCheck } from "lucide-react";

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export default function Toast({ message, visible, onClose }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(onClose, 4000);
    return () => clearTimeout(id);
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="flex items-center gap-3 rounded-xl border-2 border-[#d4af37] bg-[#162a1e] px-5 py-3.5 text-sm font-guild font-bold text-[#eafee8] shadow-[0_12px_32px_rgba(0,0,0,0.85)]">
        <ShieldCheck className="h-5 w-5 text-[#f5d77f] shrink-0" />
        <span>{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-1 text-[#c2b59b] hover:bg-[#235338] hover:text-white transition ml-2"
          aria-label="Dismiss proclamation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
