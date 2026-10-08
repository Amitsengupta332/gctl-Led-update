/**
 * LCD Video Wall: add only six missing product links into your CURRENT nav-data.js.
 * Protects existing kiosk/wayfinding/nav data. Backs up nav-data.js before writing.
 * Run from GCTL-LED-main: node scripts/ADD-LCD-VIDEO-WALL-LINKS.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const file = path.join(process.cwd(), 'src', 'data', 'nav-data.js');
const links = [
  {
    "name": "46-inch LCD Video Wall Display 3.5mm Narrow Bezel",
    "link": "/products/lcd-video-wall/46-inch-lcd-video-wall-3-5mm.html"
  },
  {
    "name": "46-inch Ultra-Narrow Bezel 0.88mm LCD Video Wall Display",
    "link": "/products/lcd-video-wall/46-inch-lcd-video-wall-0-88mm.html"
  },
  {
    "name": "46-inch Ultra-Narrow Bezel 1.8mm LCD Video Wall Display",
    "link": "/products/lcd-video-wall/46-inch-lcd-video-wall-1-8mm.html"
  },
  {
    "name": "55-inch LCD Video Wall Display 3.5mm Narrow Bezel",
    "link": "/products/lcd-video-wall/55-inch-lcd-video-wall-3-5mm.html"
  },
  {
    "name": "55-inch Ultra-Narrow Bezel 0.88mm LCD Video Wall Display",
    "link": "/products/lcd-video-wall/55-inch-lcd-video-wall-0-88mm.html"
  },
  {
    "name": "55-inch Ultra-Narrow Bezel 1.8mm LCD Video Wall Display",
    "link": "/products/lcd-video-wall/55-inch-lcd-video-wall-1-8mm.html"
  }
];
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function fail(message) { console.error('ABORTED: ' + message); process.exit(1); }
if (!fs.existsSync(file)) fail('Cannot find src/data/nav-data.js; run from GCTL-LED-main root.');
const before = fs.readFileSync(file, 'utf8');
let after = before;
let changed = 0;
for (const {name, link} of links) {
  // Target only an exact product entry with existing name, image and price.
  const pattern = new RegExp('("name"\\s*:\\s*"' + escapeRegex(name) + '"\\s*,\\s*"image"\\s*:\\s*"[^"]*"\\s*,\\s*"price"\\s*:\\s*"[^"]*")((?:\\s*,\\s*"link"\\s*:\\s*"[^"]*")?)(\\s*\\})', 'g');
  const matches = Array.from(after.matchAll(pattern));
  if (matches.length !== 1) fail('Expected one matching entry for: ' + name + '; found ' + matches.length + '. No changes made.');
  const found = matches[0];
  if (found[2]) {
    if (found[2].includes('"link": "' + link + '"') || new RegExp('"link"\\s*:\\s*"'+escapeRegex(link)+'"').test(found[2])) {
      console.log('Already linked (skipped): ' + name);
      continue;
    }
    fail('A different URL is already set for ' + name + '. No changes made.');
  }
  const inserted = found[1] + ',\n                    "link": "' + link + '"' + found[3];
  after = after.slice(0,found.index) + inserted + after.slice(found.index+found[0].length);
  changed++;
}
// Validate that only six exact link entries were added; do not reformat or remove other data.
if (!after.includes('export const navItems')) fail('Unexpected nav-data.js contents.');
if (changed === 0) { console.log('All six LCD links are already present. No file changed.'); process.exit(0); }
const backup = file + '.before-lcd-video-wall-' + new Date().toISOString().replace(/[:.]/g,'-') + '.bak';
fs.copyFileSync(file,backup,fs.constants.COPYFILE_EXCL);
fs.writeFileSync(file,after,'utf8');
console.log('SUCCESS: added '+ changed +' LCD Video Wall product links; all other nav entries preserved.');
console.log('Backup: '+backup);
