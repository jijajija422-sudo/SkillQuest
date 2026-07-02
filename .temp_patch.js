const fs = require('fs');
const path = require('path');

function patchFile(relativePath, replacement) {
  const filePath = path.join(process.cwd(), relativePath);
  let text = fs.readFileSync(filePath, 'utf8');
  const newText = replacement(text);
  if (newText === text) {
    console.log(`No change needed for ${relativePath}`);
    return;
  }
  fs.writeFileSync(filePath, newText, 'utf8');
  console.log(`Patched ${relativePath}`);
}

patchFile('app/components/SkillQuestApp.tsx', (text) => {
  if (text.includes('<Achievements />')) return text;
  const regex = /(\s+<div class="rounded-\[2rem\] border border-theme bg-theme-surface p-8 shadow-xl shadow-slate-200\/50 dark:border-theme dark:shadow-slate-950\/30">[\s\S]*?<\/div>\r?\n)(\s+<div class="rounded-\[2rem\] border border-slate-200 bg-white\/90 p-8 shadow-xl shadow-slate-200\/50 dark:border-slate-700 dark:bg-slate-800\/90 dark:shadow-slate-950\/30">)/;
  if (!regex.test(text)) {
    console.error('SkillQuestApp insertion point not found');
    return text;
  }
  return text.replace(regex, '$1              <Achievements />\r\n$2');
});
