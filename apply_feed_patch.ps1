$root = 'c:\Users\jija0\OneDrive\Desktop\web\SkillQuest'
Set-Location $root

# Patch feed-storage.ts
$feedPath = Join-Path $root 'lib\feed-storage.ts'
$feedText = Get-Content $feedPath -Raw
$feedText = $feedText -replace "\n\]\;\n\nfunction readFeed\(\): GuildCompletion\[\] \{", "\n  {\n    id: \"seed-5\",\n    userName: \"Nia\",\n    questId: \"design\",\n    questTitle: \"Craft a Brand System\",\n    badge: \"Epic\",\n    imageUrl: \"https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop\",\n    applause: 7,\n    applaudedBy: [],\n    createdAt: Date.now() - 18000000,\n  },\n  {\n    id: \"seed-6\",\n    userName: \"Tariq\",\n    questId: \"fitness\",\n    questTitle: \"Complete a Workout Plan\",\n    badge: \"Gold\",\n    imageUrl: \"https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?w=600&h=400&fit=crop\",\n    applause: 11,\n    applaudedBy: [],\n    createdAt: Date.now() - 21600000,\n  },\n];\n\nfunction readFeed(): GuildCompletion[] {"
$feedText = $feedText -replace "const parsed = JSON.parse\(raw\) as GuildCompletion\[\];\r?\n      return parsed\.length \? parsed : SEED;", "const parsed = JSON.parse(raw) as GuildCompletion[];\n      const feed = parsed.length ? parsed : SEED;\n      const missingSeeds = SEED.filter((seed) => !feed.some((item) => item.id === seed.id));\n      if (missingSeeds.length > 0) {\n        const mergedFeed = [...feed, ...missingSeeds];\n        localStorage.setItem(FEED_KEY, JSON.stringify(mergedFeed));\n        return mergedFeed;\n      }\n      return feed;"
Set-Content $feedPath $feedText

# Patch GuildFeed.tsx
$guildPath = Join-Path $root 'app\components\GuildFeed.tsx'
$guildText = Get-Content $guildPath -Raw
$guildText = $guildText -replace "const displayItems = compact \? items\.slice\(0, 2\) : items;", "const displayItems = compact ? items.slice(0, 3) : items;"
$guildText = $guildText -replace "e\.currentTarget\.src = \"data:image/svg\+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23020617'/%3E%3Ctext x='50%25' y='50%25' font-family='monospace' font-size='14' font-weight='bold' fill='%2322d3ee' text-anchor='middle' dominant-baseline='middle'%3E\[ DATA LINK BROKEN \]%3C/text%3E%3C/svg%3E\";",
"e.currentTarget.src =\n                      \"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 240'%3E%3Crect width='400' height='240' fill='%23020617'/%3E%3Ctext x='200' y='120' font-family='ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace' font-size='18' fill='%2322d3ee' text-anchor='middle' dominant-baseline='middle'%3EProof unavailable%3C/text%3E%3C/svg%3E\";"
Set-Content $guildPath $guildText

Write-Output 'PATCH_SCRIPT_DONE'