import type { GuildCompletion } from "./types";

const FEED_KEY = "skillquest-guild-feed";

const SEED: GuildCompletion[] = [
  {
    id: "seed-1",
    userName: "Aurora",
    questId: "nextjs",
    questTitle: "Master Next.js",
    badge: "Platinum",
    imageUrl: "https://images.unsplash.com/photo-1461749680684-dccba630e2f6?w=600&h=400&fit=crop",
    applause: 12,
    applaudedBy: [],
    createdAt: Date.now() - 3600000,
  },
  {
    id: "seed-2",
    userName: "Ronan",
    questId: "cooking",
    questTitle: "French Cooking Quest",
    badge: "Gold",
    imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop",
    applause: 8,
    applaudedBy: [],
    createdAt: Date.now() - 7200000,
  },
  {
    id: "seed-3",
    userName: "Mira",
    questId: "portfolio",
    questTitle: "Design a Portfolio",
    badge: "Gold",
    imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
    applause: 10,
    applaudedBy: [],
    createdAt: Date.now() - 10800000,
  },
  {
    id: "seed-4",
    userName: "Jae",
    questId: "podcast",
    questTitle: "Launch a Podcast",
    badge: "Silver",
    imageUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&h=400&fit=crop",
    applause: 9,
    applaudedBy: [],
    createdAt: Date.now() - 14400000,
  },
  {
    id: "seed-5",
    userName: "Nia",
    questId: "design",
    questTitle: "Craft a Brand System",
    badge: "Epic",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",
    applause: 7,
    applaudedBy: [],
    createdAt: Date.now() - 18000000,
  },
  {
    id: "seed-6",
    userName: "Tariq",
    questId: "fitness",
    questTitle: "Complete a Workout Plan",
    badge: "Gold",
    imageUrl: "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?w=600&h=400&fit=crop",
    applause: 11,
    applaudedBy: [],
    createdAt: Date.now() - 21600000,
  },
];

let listeners: ((feed: GuildCompletion[]) => void)[] = [];

function notifyListeners() {
  const feed = getLocalFeed();
  listeners.forEach((listener) => listener(feed));
}

const DELETED_KEY = "skillquest-deleted-feed-ids";

function getDeletedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(DELETED_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function addDeletedId(id: string): void {
  const current = getDeletedIds();
  if (!current.includes(id)) {
    localStorage.setItem(DELETED_KEY, JSON.stringify([...current, id]));
  }
}

function readFeed(): GuildCompletion[] {
  if (typeof window === "undefined") return SEED;
  try {
    const stored = localStorage.getItem(FEED_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as GuildCompletion[];
      const feed = parsed.length ? parsed : SEED;
      const deletedIds = getDeletedIds();
      const missingSeeds = SEED.filter((seed) => !feed.some((item) => item.id === seed.id) && !deletedIds.includes(seed.id));
      if (missingSeeds.length > 0) {
        const mergedFeed = [...feed, ...missingSeeds];
        localStorage.setItem(FEED_KEY, JSON.stringify(mergedFeed));
        return mergedFeed;
      }
      return feed;
    }
  } catch {
    // ignore malformed storage
  }

  localStorage.setItem(FEED_KEY, JSON.stringify(SEED));
  return SEED;
}

function writeFeed(items: GuildCompletion[]): void {
  localStorage.setItem(FEED_KEY, JSON.stringify(items));
  notifyListeners();
}

export function getLocalFeed(): GuildCompletion[] {
  return readFeed().sort((a, b) => b.createdAt - a.createdAt);
}

export function addLocalCompletion(
  payload: Omit<GuildCompletion, "id" | "createdAt" | "applause" | "applaudedBy">
) {
  const current = getLocalFeed();
  const newItem: GuildCompletion = {
    ...payload,
    id: `local-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: Date.now(),
    applause: 0,
    applaudedBy: [],
  };
  const updated = [newItem, ...current];
  writeFeed(updated);
  return newItem;
}

export function applaudLocal(itemId: string, userId: string) {
  const current = getLocalFeed();
  const updated = current.map((item) => {
    if (item.id === itemId && !item.applaudedBy.includes(userId)) {
      return {
        ...item,
        applause: item.applause + 1,
        applaudedBy: [...item.applaudedBy, userId],
      };
    }
    return item;
  });
  writeFeed(updated);
}

export function subscribeLocalFeed(callback: (feed: GuildCompletion[]) => void) {
  listeners.push(callback);
  callback(getLocalFeed());
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

export function deleteLocalCompletion(itemId: string) {
  addDeletedId(itemId);
  const current = getLocalFeed();
  const updated = current.filter((item) => item.id !== itemId);
  writeFeed(updated);
}
