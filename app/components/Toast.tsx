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
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-900 px-5 py-3.5 text-sm font-bold text-white shadow-neu-raised-lg">
        <ShieldCheck className="h-5 w-5 text-teal-400 shrink-0" />
        <span>{message}</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition ml-2"
          aria-label="Dismiss notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
