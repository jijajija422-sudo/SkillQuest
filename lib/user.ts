import type { UserProfile } from "./types";
import { titleForLevel as titleForQuestLevel, xpForLevel as xpForQuestLevel, LEVEL_TITLES } from "./quests";

const PROFILE_KEY = "skillquest-profile";

export function getUserId(): string {
  if (typeof window === "undefined") return "guest";
  let id = localStorage.getItem("skillquest-user-id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("skillquest-user-id", id);
  }
  return id;
}

export function getProfile(): UserProfile {
  if (typeof window === "undefined") {
    return { id: "guest", name: "Adventurer", xp: 0, level: 1, completedQuests: [], followers: [], following: [] };
  }
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<UserProfile>;
      return {
        id: parsed.id || getUserId(),
        name: parsed.name || localStorage.getItem("skillquest-user-name") || "Adventurer",
        xp: typeof parsed.xp === "number" ? parsed.xp : 0,
        level:
          typeof parsed.level === "number" && parsed.level >= 1 && parsed.level <= LEVEL_TITLES.length
            ? parsed.level
            : 1,
        completedQuests: Array.isArray(parsed.completedQuests) ? parsed.completedQuests : [],
        avatarUrl: parsed.avatarUrl,
        bio: parsed.bio || "Exploring the digital realm and mastering new quests.",
        classTitle: parsed.classTitle || "Fullstack Paladin",
        followers: Array.isArray(parsed.followers) ? parsed.followers : [],
        following: Array.isArray(parsed.following) ? parsed.following : [],
      };
    }
  } catch {
    /* ignore */
  }
  const profile: UserProfile = {
    id: getUserId(),
    name: localStorage.getItem("skillquest-user-name") ?? "Adventurer",
    xp: 0,
    level: 1,
    completedQuests: [],
    bio: "Exploring the digital realm and mastering new quests.",
    classTitle: "Fullstack Paladin",
    followers: [],
    following: [],
  };
  saveProfile(profile);
  return profile;
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  localStorage.setItem("skillquest-user-name", profile.name);
}

export function getTotalXp(profile: UserProfile): number {
  const completedLevelXp = Array.from({ length: profile.level - 1 }, (_, index) => xpForQuestLevel(index + 1)).reduce(
    (sum, xp) => sum + xp,
    0
  );
  return completedLevelXp + profile.xp;
}

export function getXpToNextLevel(profile: UserProfile): number {
  if (profile.level >= LEVEL_TITLES.length) return 0;
  return xpForQuestLevel(profile.level) - profile.xp;
}

export function addXp(profile: UserProfile, amount: number): UserProfile {
  let { xp, level } = profile;
  xp += amount;
  while (level < LEVEL_TITLES.length && xp >= xpForQuestLevel(level)) {
    xp -= xpForQuestLevel(level);
    level += 1;
  }
  return { ...profile, xp, level };
}

export { titleForQuestLevel as titleForLevel, xpForQuestLevel as xpForLevel };
