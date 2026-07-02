"use client";

import { useEffect, useState } from "react";
import { applyTheme, getStoredTheme, THEMES, type ThemeName } from "@/lib/theme";

export default function ThemeSelector() {
  const [theme, setTheme] = useState<ThemeName>(getStoredTheme());

  useEffect(() => {
    setTheme(getStoredTheme());
    applyTheme(getStoredTheme());
  }, []);

  function selectTheme(value: ThemeName) {
    setTheme(value);
    applyTheme(value);
  }

  return (
    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200">
      {THEMES.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => selectTheme(item.id)}
          className={`rounded-full px-3 py-1 transition ${theme === item.id ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900" : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"}`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
