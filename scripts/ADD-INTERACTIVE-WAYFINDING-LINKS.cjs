/** ADD ONLY — interactive-wayfinding; safe incremental link update for existing src/data/nav-data.js. */
const fs = require('node:fs');
const path = require('node:path');
const dataFile = path.join(process.cwd(), 'src', 'data', 'nav-data.js');
const links = [
  {
    "name": "Dual Screen Interactive Wayfinding Kiosk",
    "link": "/products/interactive-wayfinding/dual-screen-interactive-wayfinding-kiosk.html"
  },
  {
    "name": "Indoor Digital Directory Wayfinding Display",
    "link": "/products/interactive-wayfinding/indoor-digital-directory-wayfinding-display.html"
  },
  {
    "name": "Indoor Floor Standing Wayfinding Display",
    "link": "/products/interactive-wayfinding/indoor-floor-standing-wayfinding-display.html"
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
if (updated === 0) { console.log('All selected product links are already present. Nothing changed.');process.exit(0); }
const backup=dataFile + '.before-interactive-wayfinding-' + new Date().toISOString().replace(/[:.]/g,'-') + '.bak';
fs.copyFileSync(dataFile,backup,fs.constants.COPYFILE_EXCL);
fs.writeFileSync(dataFile,after,'utf8');
console.log('OK: added ' + updated + ' interactive-wayfinding links. Other products left untouched.');
console.log('Backup: ' + backup);
