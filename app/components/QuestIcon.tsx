"use client";

import {
  Code2,
  ChefHat,
  Music2,
  Dumbbell,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Code2,
  ChefHat,
  Music2,
  Dumbbell,
  BookOpen,
};

export function QuestIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? BookOpen;
  return <Icon className={className} />;
}
