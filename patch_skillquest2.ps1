$file = 'app/components/SkillQuestApp.tsx'
$text = Get-Content -Raw -Path $file
$old = @'
              <div class="rounded-[2rem] border border-theme bg-theme-surface p-8 shadow-xl shadow-slate-200/50 dark:border-theme dark:shadow-slate-950/30">
                <p class="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Guild Highlights</p>
                <div class="mt-6">
                  <GuildFeed />
                </div>
              </div>
              <div class="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800/90 dark:shadow-slate-950/30">
                <p class="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Quest Highlights</p>
'@
$new = @'
              <div class="rounded-[2rem] border border-theme bg-theme-surface p-8 shadow-xl shadow-slate-200/50 dark:border-theme dark:shadow-slate-950/30">
                <p class="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Guild Highlights</p>
                <div class="mt-6">
                  <GuildFeed />
                </div>
              </div>
              <Achievements />
              <div class="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800/90 dark:shadow-slate-950/30">
                <p class="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Quest Highlights</p>
'@
if ($text.IndexOf($old) -eq -1) {
  Write-Host 'Old block not found in SkillQuestApp.tsx'
  Write-Host 'Context:'
  $idx = $text.IndexOf('Guild Highlights')
  if ($idx -ge 0) {
    Write-Host $text.Substring([Math]::Max(0,$idx-200), [Math]::Min(400, $text.Length - $idx + 200))
  }
  exit 1
}
$text = $text.Replace($old, $new)
Set-Content -Path $file -Value $text -Encoding utf8
Write-Host 'Patched SkillQuestApp.tsx'
