export type QuestLevel = "Foundational" | "Advanced" | "Masterclass" | "Novice" | "Journeyman" | "Adventurer" | "Epic" | "Legendary";

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

export interface GuildComment {
  id: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  text: string;
  createdAt: number;
}

export interface GuildCompletion {
  id: string;
  userName: string;
  userId?: string;
  questId: string;
  questTitle: string;
  badge: string;
  imageUrl: string;
  caption?: string;       // reflection / description written by the user when posting
  isCustom?: boolean;     // true if this was a user-defined custom achievement
  comments?: GuildComment[];
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
  /** Skills / hobbies this person can teach or share */
  offering?: string[];
  /** Skills / hobbies this person wants to learn */
  seeking?: string[];
  /** Mutual connections (bi-directional follow) */
  connections?: string[];
  /** Users who have mentored this member */
  mentors?: string[];
}

export interface PrivateMessage {
  id: string;
  fromId: string;
  fromName: string;
  fromAvatar?: string;
  text: string;
  createdAt: number;
}

export interface MessageThread {
  peerId: string;
  peerName: string;
  peerAvatar?: string;
  messages: PrivateMessage[];
}
