/**
 * ADD ONLY: Portable Digital Signage Poster
 * Adds product URLs to CURRENT src/data/nav-data.js while preserving every other existing entry.
 * Run from project root: node scripts/ADD-PORTABLE-DIGITAL-SIGNAGE-POSTER-LINKS.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const file = path.join(process.cwd(), 'src', 'data', 'nav-data.js');
const links = [
  {
    "name": "43 Inch Portable Digital Signage Poster for Advertising",
    "link": "/products/portable-signage-poster/43-inch-portable-digital-signage-poster-for-advertising.html"
  },
  {
    "name": "43 Inch Advertising Recharge Portable Digital Signage Outdoor Waterproof",
    "link": "/products/portable-signage-poster/43-inch-advertising-recharge-outdoor-waterproof-poster.html"
  }
];
function escapeRegExp(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function abort(message) { console.error('ABORTED: ' + message); process.exit(1); }
if (!fs.existsSync(file)) abort('Cannot find src/data/nav-data.js. Run from GCTL-LED-main root.');
const before = fs.readFileSync(file, 'utf8');
if (!before.includes('export const navItems')) abort('Unexpected nav-data.js format; no changes saved.');
let after = before;
let count = 0;
for (const {name,link} of links) {
  const pattern = new RegExp('("name"\\s*:\\s*"'+escapeRegExp(name)+'"\\s*,\\s*"image"\\s*:\\s*"[^"]*"\\s*,\\s*"price"\\s*:\\s*"[^"]*")((?:\\s*,\\s*"link"\\s*:\\s*"[^"]*")?)(\\s*\\})', 'g');
  const matches = Array.from(after.matchAll(pattern));
  if (matches.length !== 1) abort('Expected exactly one nav entry for ' + name + ', found ' + matches.length + '. Nothing saved.');
  const found = matches[0];
  if (found[2]) {
    const existing = found[2].match(/"link"\s*:\s*"([^"]*)"/);
    if (existing?.[1] === link) { console.log('Already linked, skipped:',name); continue; }
    abort('Different link already exists on '+name+'; nothing saved.');
  }
  const insert = found[1]+',\n                    "link": "'+link+'"'+found[3];
  after = after.slice(0,found.index)+insert+after.slice(found.index+found[0].length);
  count++;
}
if (count === 0) { console.log('All Portable Digital Signage Poster links already exist; no change.'); process.exit(0); }
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backup = file+'.before-ADD-PORTABLE-DIGITAL-SIGNAGE-POSTER-LINKS-'+stamp+'.bak';
fs.copyFileSync(file, backup, fs.constants.COPYFILE_EXCL);
fs.writeFileSync(file, after, 'utf8');
console.log('SUCCESS: added '+count+' Portable Digital Signage Poster link(s); other products were not modified.');
console.log('Backup:', backup);
