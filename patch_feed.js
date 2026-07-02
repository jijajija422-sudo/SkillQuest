const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname);

function patchFile(filePath, original, replacement) {
  const abs = path.join(root, filePath);
  const text = fs.readFileSync(abs, 'utf8');
  if (!text.includes(original)) {
    console.log(`SKIP: original block not found in ${filePath}`);
    return false;
  }
  fs.writeFileSync(abs, text.replace(original, replacement), 'utf8');
  console.log(`PATCHED: ${filePath}`);
  return true;
}

const feedOriginal = `  {
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
];
`;
const feedReplacement = `  {
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
`;

const mergeOriginal = `      const parsed = JSON.parse(raw) as GuildCompletion[];
      return parsed.length ? parsed : SEED;
`;
const mergeReplacement = `      const parsed = JSON.parse(raw) as GuildCompletion[];
      const feed = parsed.length ? parsed : SEED;
      const missingSeeds = SEED.filter((seed) => !feed.some((item) => item.id === seed.id));
      if (missingSeeds.length > 0) {
        const mergedFeed = [...feed, ...missingSeeds];
        localStorage.setItem(FEED_KEY, JSON.stringify(mergedFeed));
        return mergedFeed;
      }
      return feed;
`;

const guildCompactOriginal = '  const displayItems = compact ? items.slice(0, 2) : items;';
const guildCompactReplacement = '  const displayItems = compact ? items.slice(0, 3) : items;';

const guildFallbackOriginal = `                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23020617'/%3E%3Ctext x='50%25' y='50%25' font-family='monospace' font-size='14' font-weight='bold' fill='%2322d3ee' text-anchor='middle' dominant-baseline='middle'%3E[ DATA LINK BROKEN ]%3C/text%3E%3C/svg%3E";`;
const guildFallbackReplacement = `                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'%3E%3Crect width='400' height='240' fill='%23020617'/%3E%3Ctext x='200' y='120' font-family='ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace' font-size='18' fill='%2322d3ee' text-anchor='middle' dominant-baseline='middle'%3EProof unavailable%3C/text%3E%3C/svg%3E";`;

patchFile('lib/feed-storage.ts', feedOriginal, feedReplacement);
patchFile('lib/feed-storage.ts', mergeOriginal, mergeReplacement);
patchFile('app/components/GuildFeed.tsx', guildCompactOriginal, guildCompactReplacement);
patchFile('app/components/GuildFeed.tsx', guildFallbackOriginal, guildFallbackReplacement);
