/**
 * ADD ONLY: three Wall Mount Android Display product links.
 * Run from the GCTL-LED-main project root:
 *   node scripts/ADD-WALL-MOUNT-ANDROID-DISPLAY-LINKS.cjs
 * Existing navbar, CSS, Kiosk, LCD and Rental links are never replaced/reformatted.
 */
const fs = require('node:fs');
const path = require('node:path');
const dataFile = path.join(process.cwd(), 'src', 'data', 'nav-data.js');
const links = [
  {
    "name": "21.5 Inch Wall Mount Android Display",
    "link": "/products/wall-mount-android-display/21-5-inch-wall-mount-android-display.html"
  },
  {
    "name": "32 Inch Wall Mount Android Display",
    "link": "/products/wall-mount-android-display/32-inch-wall-mount-android-display.html"
  },
  {
    "name": "43 Inch Wall Mount Android Display",
    "link": "/products/wall-mount-android-display/43-inch-wall-mount-android-display.html"
  }
];
function escaped(text) { return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function fail(message) { console.error('STOPPED: '+message); process.exit(1); }
if (!fs.existsSync(dataFile)) fail('src/data/nav-data.js not found. Run from project root.');
const before = fs.readFileSync(dataFile,'utf8');
let after = before;
let updated = 0;
for (const {name,link} of links) {
  const pattern = new RegExp('("name"\\s*:\\s*"' + escaped(name) + '"\\s*,\\s*"image"\\s*:\\s*"[^"]*"\\s*,\\s*"price"\\s*:\\s*"[^"]*")((?:\\s*,\\s*"link"\\s*:\\s*"[^"]*")?)(\\s*\\})', 'g');
  const matches = [...after.matchAll(pattern)];
  if (matches.length !== 1) fail('Expected exactly 1 product named: '+name+' (found '+matches.length+'). No changes saved.');
  const hit=matches[0];
  if (hit[2]) {
    const current = hit[2].match(/"link"\s*:\s*"([^"]*)"/);
    if (current && current[1] === link) { console.log('Already added, skipped:',name); continue; }
    fail('Different link exists on '+name+'; not overwriting. No changes saved.');
  }
  const replacement = hit[1] + ',\n                    "link": "' + link + '"' + hit[3];
  after=after.slice(0,hit.index)+replacement+after.slice(hit.index+hit[0].length);
  updated++;
}
if (!before.includes('export const navItems')) fail('Unsupported nav-data.js format. No changes saved.');
if (updated === 0) { console.log('All three Wall Mount Android Display links are already present. Nothing changed.');process.exit(0); }
const backup=dataFile + '.before-wall-mount-' + new Date().toISOString().replace(/[:.]/g,'-') + '.bak';
fs.copyFileSync(dataFile,backup,fs.constants.COPYFILE_EXCL);
fs.writeFileSync(dataFile,after,'utf8');
console.log('OK: added ' + updated + ' Wall Mount Android Display links. Other products left untouched.');
console.log('Backup: ' + backup);
