$root = 'c:\Users\jija0\OneDrive\Desktop\web\SkillQuest'
Set-Location $root

# Normalize and patch feed-storage.ts
$feedPath = Join-Path $root 'lib\feed-storage.ts'
$feedText = Get-Content $feedPath -Raw
$feedText = $feedText -replace "\r\n", "\n"
$oldSeedBlock = @'
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
];
'@
$newSeedBlock = @'
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
'@
if ($feedText.Contains($oldSeedBlock)) {
    $feedText = $feedText.Replace($oldSeedBlock, $newSeedBlock)
    Write-Output 'feed seed block updated'
} else {
    Write-Output 'feed seed block not found; skipping'
}

$oldMerge = @'
      const parsed = JSON.parse(raw) as GuildCompletion[];
      return parsed.length ? parsed : SEED;
'@
$newMerge = @'
      const parsed = JSON.parse(raw) as GuildCompletion[];
      const feed = parsed.length ? parsed : SEED;
      const missingSeeds = SEED.filter((seed) => !feed.some((item) => item.id === seed.id));
      if (missingSeeds.length > 0) {
        const mergedFeed = [...feed, ...missingSeeds];
        localStorage.setItem(FEED_KEY, JSON.stringify(mergedFeed));
        return mergedFeed;
      }
      return feed;
'@
if ($feedText.Contains($oldMerge)) {
    $feedText = $feedText.Replace($oldMerge, $newMerge)
    Write-Output 'feed merge logic updated'
} else {
    Write-Output 'feed merge block not found; skipping'
}

$feedText = $feedText -replace "\n", "`r`n"
Set-Content $feedPath $feedText

# Patch GuildFeed.tsx
$guildPath = Join-Path $root 'app\components\GuildFeed.tsx'
$guildText = Get-Content $guildPath -Raw
$guildText = $guildText -replace "\r\n", "\n"
$oldCompact = '  const displayItems = compact ? items.slice(0, 2) : items;'
$newCompact = '  const displayItems = compact ? items.slice(0, 3) : items;'
if ($guildText.Contains($oldCompact)) {
    $guildText = $guildText.Replace($oldCompact, $newCompact)
    Write-Output 'compact display updated'
} else {
    Write-Output 'compact display line not found; skipping'
}

$oldFallback = @'
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23020617'/%3E%3Ctext x='50%25' y='50%25' font-family='monospace' font-size='14' font-weight='bold' fill='%2322d3ee' text-anchor='middle' dominant-baseline='middle'%3E[ DATA LINK BROKEN ]%3C/text%3E%3C/svg%3E";
'@
$newFallback = @'
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'%3E%3Crect width='400' height='240' fill='%23020617'/%3E%3Ctext x='200' y='120' font-family='ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace' font-size='18' fill='%2322d3ee' text-anchor='middle' dominant-baseline='middle'%3EProof unavailable%3C/text%3E%3C/svg%3E";
'@
if ($guildText.Contains($oldFallback)) {
    $guildText = $guildText.Replace($oldFallback, $newFallback)
    Write-Output 'fallback image updated'
} else {
    Write-Output 'fallback image block not found; skipping'
}

$guildText = $guildText -replace "\n", "`r`n"
Set-Content $guildPath $guildText
Write-Output 'PATCH_COMPLETE'