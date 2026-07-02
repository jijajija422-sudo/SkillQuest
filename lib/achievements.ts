import type { UserProfile } from "./types";
import { getTotalXp } from "./user";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: (profile: UserProfile) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-quest",
    title: "First Quest Complete",
    description: "Complete your first quest and join the guild.",
    unlocked: (profile) => profile.completedQuests.length >= 1,
  },
  {
    id: "journey-builder",
    title: "Journey Builder",
    description: "Finish 3 quests to earn your journey badge.",
    unlocked: (profile) => profile.completedQuests.length >= 3,
  },
  {
    id: "guild-champion",
    title: "Guild Champion",
    description: "Earn 1,200 XP and prove your commitment.",
    unlocked: (profile) => getTotalXp(profile) >= 1200,
  },
  {
    id: "legendary-sage",
    title: "Legendary Sage",
    description: "Reach total XP of 2,200 to unlock the sage title.",
    unlocked: (profile) => getTotalXp(profile) >= 2200,
  },
  {
    id: "quest-master",
    title: "Quest Master",
    description: "Complete 5 quests and earn a master badge.",
    unlocked: (profile) => profile.completedQuests.length >= 5,
  },
];

export function getUnlockedAchievements(profile: UserProfile): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => achievement.unlocked(profile));
}

export function getNextAchievement(profile: UserProfile): Achievement | null {
  return ACHIEVEMENTS.find((achievement) => !achievement.unlocked(profile)) ?? null;
}
