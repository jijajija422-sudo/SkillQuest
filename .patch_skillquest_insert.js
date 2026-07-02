const fs = require('fs');
const path = require('path');
const file = path.join(process.cwd(), 'app/components/SkillQuestApp.tsx');
let text = fs.readFileSync(file, 'utf8');
if (text.includes('<Achievements />')) {
  console.log('Achievements already inserted');
  process.exit(0);
}
const regex = /(\r?\n)([ \t]*)<LiveChallenge \/>/;
if (!regex.test(text)) {
  console.error('LiveChallenge marker not found');
  process.exit(1);
}
text = text.replace(regex, '$1$2<Achievements />$1$2<LiveChallenge />');
fs.writeFileSync(file, text, 'utf8');
console.log('Inserted Achievements');
