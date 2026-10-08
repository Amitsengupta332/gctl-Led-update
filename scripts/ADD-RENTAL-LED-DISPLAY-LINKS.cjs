/**
 * ADD ONLY: six Rental LED Display product links.
 * Run from the GCTL-LED-main project root:
 *   node scripts/ADD-RENTAL-LED-DISPLAY-LINKS.cjs
 * Existing navbar, CSS, Kiosk and LCD links are never replaced/reformatted.
 */
const fs = require('node:fs');
const path = require('node:path');
const dataFile = path.join(process.cwd(), 'src', 'data', 'nav-data.js');
const links = [
  {
    "name": "Rental Outdoor P2.60 Event Waterproof LED Display",
    "link": "/products/rental-led-display/rental-outdoor-p2-60-led-display.html"
  },
  {
    "name": "Rental Outdoor P2.97 Event Waterproof LED Display",
    "link": "/products/rental-led-display/rental-outdoor-p2-97-led-display.html"
  },
  {
    "name": "Rental Outdoor P3.91 Event Waterproof LED Display",
    "link": "/products/rental-led-display/rental-outdoor-p3-91-led-display.html"
  },
  {
    "name": "Rental Indoor P2.60 Stage Concert Event Waterproof LED Display",
    "link": "/products/rental-led-display/rental-indoor-p2-60-led-display.html"
  },
  {
    "name": "Rental Indoor P2.97 Stage Concert Event Waterproof LED Display",
    "link": "/products/rental-led-display/rental-indoor-p2-97-led-display.html"
  },
  {
    "name": "Rental Indoor P3.91 Stage Concert Event Waterproof LED Display",
    "link": "/products/rental-led-display/rental-indoor-p3-91-led-display.html"
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
if (updated === 0) { console.log('All six Rental LED links are already present. Nothing changed.');process.exit(0); }
const backup=dataFile + '.before-rental-led-' + new Date().toISOString().replace(/[:.]/g,'-') + '.bak';
fs.copyFileSync(dataFile,backup,fs.constants.COPYFILE_EXCL);
fs.writeFileSync(dataFile,after,'utf8');
console.log('OK: added ' + updated + ' Rental LED links. Other products left untouched.');
console.log('Backup: ' + backup);
