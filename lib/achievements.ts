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
    title: "First Verification Complete",
    description: "Complete your first exploration and verify your skill.",
    unlocked: (profile) => profile.completedQuests.length >= 1,
  },
  {
    id: "journey-builder",
    title: "Portfolio Builder",
    description: "Finish 3 explorations to earn your portfolio badge.",
    unlocked: (profile) => profile.completedQuests.length >= 3,
  },
  {
    id: "guild-champion",
    title: "SkillHub Pro",
    description: "Earn 1,200 progress steps and prove your commitment.",
    unlocked: (profile) => getTotalXp(profile) >= 1200,
  },
  {
    id: "legendary-sage",
    title: "Master Contributor",
    description: "Reach total of 2,200 progress steps to unlock the Master Contributor title.",
    unlocked: (profile) => getTotalXp(profile) >= 2200,
  },
  {
    id: "quest-master",
    title: "Exploration Master",
    description: "Complete 5 explorations and earn a master badge.",
    unlocked: (profile) => profile.completedQuests.length >= 5,
  },
];

export function getUnlockedAchievements(profile: UserProfile): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => achievement.unlocked(profile));
}

export function getNextAchievement(profile: UserProfile): Achievement | null {
  return ACHIEVEMENTS.find((achievement) => !achievement.unlocked(profile)) ?? null;
}
