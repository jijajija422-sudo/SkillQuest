"use client";

import { useEffect, useState } from "react";
import { Moon, SunMedium } from "lucide-react";
import { applyThemeMode, getStoredThemeMode, type ThemeMode } from "@/lib/theme";

export default function ThemeToggle() {
  const [mode, setMode] = useState<ThemeMode>(getStoredThemeMode());

  useEffect(() => {
    const stored = getStoredThemeMode();
    setMode(stored);
    applyThemeMode(stored);
  }, []);

  function toggle() {
    const next: ThemeMode = mode === "dark" ? "light" : "dark";
    setMode(next);
    applyThemeMode(next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
    >
      {mode === "dark" ? <Moon className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
      <span className="hidden sm:inline">{mode === "dark" ? "Dark" : "Light"}</span>
    </button>
  );
}
