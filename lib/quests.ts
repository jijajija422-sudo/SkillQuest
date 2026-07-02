import type { Quest } from "./types";

export const QUESTS: Quest[] = [
  {
    id: "nextjs",
    title: "Master Next.js",
    category: "Coding",
    icon: "Code2",
    level: "Epic",
    progress: 80,
    xpReward: 500,
    description:
      "Build and deploy a full-stack Next.js application. Prove your mastery with a screenshot of your live project.",
    requirements: [
      { id: "r1", label: "Set up App Router pages", description: "Create at least 3 routed pages with layouts." },
      { id: "r2", label: "Add dynamic data fetching", description: "Use server or client components with real data." },
      { id: "r3", label: "Deploy to production", description: "Deploy on Vercel, Netlify, or your host of choice." },
      { id: "r4", label: "Upload proof screenshot", description: "Share a screenshot of your deployed app or code." },
    ],
  },
  {
    id: "cooking",
    title: "French Cooking Quest",
    category: "Cooking",
    icon: "ChefHat",
    level: "Adventurer",
    progress: 45,
    xpReward: 350,
    description:
      "Research classic French recipes, cook a complete meal, and share a photo of your culinary creation with the guild.",
    requirements: [
      { id: "r1", label: "Research 3 French recipes", description: "Document ingredients and techniques." },
      { id: "r2", label: "Cook a complete meal", description: "Prepare appetizer, main, or dessert from your research." },
      { id: "r3", label: "Plate and photograph", description: "Present your dish and capture a clear photo." },
      { id: "r4", label: "Upload meal photo", description: "Submit your proof to earn guild recognition." },
    ],
  },
  {
    id: "music",
    title: "Compose a Song",
    category: "Music",
    icon: "Music2",
    level: "Journeyman",
    progress: 55,
    xpReward: 400,
    description:
      "Write an original melody, record a performance clip, and share it with your guildmates for applause.",
    requirements: [
      { id: "r1", label: "Write original melody", description: "Create at least 16 bars of original music." },
      { id: "r2", label: "Record performance clip", description: "Record 30+ seconds of your composition." },
      { id: "r3", label: "Share with the guild", description: "Upload a screenshot or photo from your session." },
    ],
  },
  {
    id: "fitness",
    title: "30-Day Fitness Streak",
    category: "Wellness",
    icon: "Dumbbell",
    level: "Legendary",
    progress: 20,
    xpReward: 750,
    description:
      "Commit to a 30-day movement streak. Log workouts and upload proof of your progress milestones.",
    requirements: [
      { id: "r1", label: "Define your routine", description: "Choose cardio, strength, or mobility focus." },
      { id: "r2", label: "Complete 7-day streak", description: "Log daily activity for one week." },
      { id: "r3", label: "Upload progress photo", description: "Share a gym selfie, tracker screenshot, or workout log." },
    ],
  },
  {
    id: "portfolio",
    title: "Design a Portfolio",
    category: "Design",
    icon: "BookOpen",
    level: "Adventurer",
    progress: 30,
    xpReward: 420,
    description:
      "Build a portfolio site that showcases your best projects, case studies, and creative voice.",
    requirements: [
      { id: "r1", label: "Choose a style direction", description: "Pick a visual theme and layout." },
      { id: "r2", label: "Showcase 3 projects", description: "Include screenshots, descriptions, and outcomes." },
      { id: "r3", label: "Publish live", description: "Deploy your portfolio to a public URL." },
    ],
  },
  {
    id: "podcast",
    title: "Launch a Podcast",
    category: "Creative",
    icon: "Music2",
    level: "Journeyman",
    progress: 50,
    xpReward: 390,
    description:
      "Plan, record, and publish your first podcast episode to share your story or expertise.",
    requirements: [
      { id: "r1", label: "Pick a concept", description: "Define your podcast theme and audience." },
      { id: "r2", label: "Record an episode", description: "Create at least 10 minutes of audio." },
      { id: "r3", label: "Share a promo clip", description: "Upload a screenshot of the publish page or waveform." },
    ],
  },
  {
    id: "ai",
    title: "Build an AI Companion",
    category: "Tech",
    icon: "Code2",
    level: "Epic",
    progress: 35,
    xpReward: 580,
    description:
      "Create a helpful chatbot or assistant that answers questions, solves a problem, or guides users.",
    requirements: [
      { id: "r1", label: "Define the use case", description: "Choose a specific audience or task." },
      { id: "r2", label: "Develop the assistant", description: "Use prompts, APIs, or local logic." },
      { id: "r3", label: "Show proof", description: "Share a screenshot of the chat or results." },
    ],
  },
  {
    id: "story-photo",
    title: "Capture a Story",
    category: "Photography",
    icon: "Camera",
    level: "Adventurer",
    progress: 25,
    xpReward: 340,
    description:
      "Create a visual story with photos, then share the final shot as proof of your journey.",
    requirements: [
      { id: "r1", label: "Choose a subject", description: "Find a moment, place, or person to document." },
      { id: "r2", label: "Take 5 strong photos", description: "Capture composition, mood, and detail." },
      { id: "r3", label: "Upload the selected shot", description: "Submit your favorite photo as proof." },
    ],
  },
];

export const LEVEL_TITLES = [
  "Novice Wanderer",
  "Apprentice Hero",
  "Journeyman Explorer",
  "Guild Champion",
  "Legendary Sage",
];

export function xpForLevel(level: number): number {
  return level * 1000;
}

export function titleForLevel(level: number): string {
  return LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length - 1)];
}

export function badgeForQuest(level: Quest["level"]): string {
  const map: Record<Quest["level"], string> = {
    Novice: "Bronze",
    Journeyman: "Silver",
    Adventurer: "Gold",
    Epic: "Platinum",
    Legendary: "Legendary",
  };
  return map[level];
}
