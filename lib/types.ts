export type QuestLevel = "Novice" | "Journeyman" | "Adventurer" | "Epic" | "Legendary";

export interface QuestRequirement {
  id: string;
  label: string;
  description?: string;
}

export interface Quest {
  id: string;
  title: string;
  category: string;
  icon: string;
  level: QuestLevel;
  progress: number;
  xpReward: number;
  description: string;
  requirements: QuestRequirement[];
}

export interface GuildCompletion {
  id: string;
  userName: string;
  questId: string;
  questTitle: string;
  badge: string;
  imageUrl: string;
  applause: number;
  applaudedBy: string[];
  createdAt: number;
}

export interface UserProfile {
  id: string;
  name: string;
  xp: number;
  level: number;
  completedQuests: string[];
  avatarUrl?: string;
  bio?: string;
  classTitle?: string;
  followers?: string[];
  following?: string[];
}
