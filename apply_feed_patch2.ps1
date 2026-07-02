$root = 'c:\Users\jija0\OneDrive\Desktop\web\SkillQuest'
Set-Location $root

# Patch feed-storage.ts by line content
$feedPath = Join-Path $root 'lib\feed-storage.ts'
$feedLines = Get-Content $feedPath
$needle = '];'
$idx = $feedLines.IndexOf($needle)
if ($idx -lt 0) { throw 'Could not find end of SEED array' }
$insert = @(
'  {',
'    id: "seed-5",',
'    userName: "Nia",',
'    questId: "design",',
'    questTitle: "Craft a Brand System",',
'    badge: "Epic",',
'    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop",',
'    applause: 7,',
'    applaudedBy: [],',
'    createdAt: Date.now() - 18000000,',
'  },',
'  {',
'    id: "seed-6",',
'    userName: "Tariq",',
'    questId: "fitness",',
'    questTitle: "Complete a Workout Plan",',
'    badge: "Gold",',
'    imageUrl: "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?w=600&h=400&fit=crop",',
'    applause: 11,',
'    applaudedBy: [],',
'    createdAt: Date.now() - 21600000,',
'  },'
)
if ($feedLines -contains '    id: "seed-5",') { Write-Output 'Seed entries already present'; } else {
    $feedLines = $feedLines[0..($idx-1)] + $insert + $feedLines[$idx..($feedLines.Length-1)]
    Set-Content $feedPath $feedLines
    Write-Output 'Added seed entries'
}

# Patch readFeed merge logic
$feedLines = Get-Content $feedPath
$pattern = '      return parsed.length ? parsed : SEED;'
$idx = $feedLines.IndexOf($pattern)
if ($idx -lt 0) { throw 'Could not find parse return line' }
if ($feedLines[$idx - 1].Trim() -eq 'const parsed = JSON.parse(raw) as GuildCompletion[];') {
    if ($feedLines[$idx+1] -like '      const missingSeeds*') {
        Write-Output 'Merge logic already present'
    } else {
        $replacement = @(
'      const feed = parsed.length ? parsed : SEED;',
'      const missingSeeds = SEED.filter((seed) => !feed.some((item) => item.id === seed.id));',
'      if (missingSeeds.length > 0) {',
'        const mergedFeed = [...feed, ...missingSeeds];',
'        localStorage.setItem(FEED_KEY, JSON.stringify(mergedFeed));',
'        return mergedFeed;',
'      }',
'      return feed;'
        )
        $feedLines = $feedLines[0..($idx-1)] + $replacement + $feedLines[($idx+1)..($feedLines.Length-1)]
        Set-Content $feedPath $feedLines
        Write-Output 'Added merge logic'
    }
} else {
    throw 'Unexpected line before parse return'
}

# Patch GuildFeed.tsx
$guildPath = Join-Path $root 'app\components\GuildFeed.tsx'
$guildLines = Get-Content $guildPath
$compactLine = '  const displayItems = compact ? items.slice(0, 2) : items;'
$idx = $guildLines.IndexOf($compactLine)
if ($idx -lt 0) { throw 'Could not find compact display line' }
$guildLines[$idx] = '  const displayItems = compact ? items.slice(0, 3) : items;'

$oldFallback = '                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100%25\' height=\'100%25\'%3E%3Crect width=\'100%25\' height=\'100%25\' fill=\'%23020617\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' font-family=\'monospace\' font-size=\'14\' font-weight=\'bold\' fill=\'%2322d3ee\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3E[ DATA LINK BROKEN ]%3C/text%3E%3C/svg%3E";'
$idx = $guildLines.IndexOf($oldFallback)
if ($idx -lt 0) { Write-Output 'Could not find exact fallback string; skipping image fallback patch'; } else {
    $guildLines[$idx] = '                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 400 240\'%3E%3Crect width=\'400\' height=\'240\' fill=\'%23020617\'/%3E%3Ctext x=\'200\' y=\'120\' font-family=\'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace\' font-size=\'18\' fill=\'%2322d3ee\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3EProof unavailable%3C/text%3E%3C/svg%3E";'
    Set-Content $guildPath $guildLines
    Write-Output 'Updated image fallback'
}

Write-Output 'PATCH_COMPLETE'