export type ThemeName = "calm" | "forest" | "dusk" | "paper";
export type ThemeMode = "light" | "dark";

const THEME_KEY = "skillquest-theme";
const MODE_KEY = "skillquest-theme-mode";

export const THEMES: { id: ThemeName; label: string }[] = [
  { id: "calm", label: "Calm" },
  { id: "forest", label: "Forest" },
  { id: "dusk", label: "Dusk" },
  { id: "paper", label: "Paper" },
];

export function getStoredTheme(): ThemeName {
  if (typeof window === "undefined") return "calm";
  const stored = localStorage.getItem(THEME_KEY) as ThemeName | null;
  return stored && THEMES.some((theme) => theme.id === stored) ? stored : "calm";
}

export function getStoredThemeMode(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const stored = localStorage.getItem(MODE_KEY);
  return stored === "dark" ? "dark" : "light";
}

export function applyTheme(theme: ThemeName): void {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
}

export function applyThemeMode(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  if (mode === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem(MODE_KEY, mode);
}

export function initTheme(): void {
  applyTheme(getStoredTheme());
  applyThemeMode(getStoredThemeMode());
}
