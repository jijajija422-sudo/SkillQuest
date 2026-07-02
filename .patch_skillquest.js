const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'app/components/SkillQuestApp.tsx');
let text = fs.readFileSync(file, 'utf8');
const oldBlock = `              <div class="rounded-[2rem] border border-theme bg-theme-surface p-8 shadow-xl shadow-slate-200/50 dark:border-theme dark:shadow-slate-950/30">\r\n                <p class="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Guild Highlights</p>\r\n                <div class="mt-6">\r\n                  <GuildFeed />\r\n                </div>\r\n              </div>\r\n              <div class="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800/90 dark:shadow-slate-950/30">\r\n                <p class="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Quest Highlights</p>`;
const newBlock = `              <div class="rounded-[2rem] border border-theme bg-theme-surface p-8 shadow-xl shadow-slate-200/50 dark:border-theme dark:shadow-slate-950/30">\r\n                <p class="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Guild Highlights</p>\r\n                <div class="mt-6">\r\n                  <GuildFeed />\r\n                </div>\r\n              </div>\r\n              <Achievements />\r\n              <div class="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-800/90 dark:shadow-slate-950/30">\r\n                <p class="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Quest Highlights</p>`;

if (!text.includes(oldBlock)) {
  console.error('Old block not found in SkillQuestApp.tsx');
  const idx = text.indexOf('Guild Highlights');
  console.error('Snippet around Guild Highlights:', text.slice(Math.max(0, idx - 200), Math.min(text.length, idx + 300)));
  process.exit(1);
}
text = text.replace(oldBlock, newBlock);
fs.writeFileSync(file, text, 'utf8');
console.log('Patched SkillQuestApp.tsx');
