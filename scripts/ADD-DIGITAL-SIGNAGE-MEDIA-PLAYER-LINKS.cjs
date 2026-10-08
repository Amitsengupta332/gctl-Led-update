/**
 * ADD ONLY: Digital Signage Media Player
 * Adds product URLs to CURRENT src/data/nav-data.js while preserving every other existing entry.
 * Run from project root: node scripts/ADD-DIGITAL-SIGNAGE-MEDIA-PLAYER-LINKS.cjs
 */
const fs = require('node:fs');
const path = require('node:path');
const file = path.join(process.cwd(), 'src', 'data', 'nav-data.js');
const links = [
  {
    "name": "Digital Signage Media Player Box 2K 2G/32G",
    "link": "/products/digital-signage-media-player/digital-signage-media-player-box-2k-2g-32g.html"
  },
  {
    "name": "Digital Signage Media Player Box 2K 4G/32G",
    "link": "/products/digital-signage-media-player/digital-signage-media-player-box-2k-4g-32g.html"
  },
  {
    "name": "Digital Signage Media Player Box 2K 4G/64G",
    "link": "/products/digital-signage-media-player/digital-signage-media-player-box-2k-4g-64g.html"
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
if (count === 0) { console.log('All Digital Signage Media Player links already exist; no change.'); process.exit(0); }
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const backup = file+'.before-ADD-DIGITAL-SIGNAGE-MEDIA-PLAYER-LINKS-'+stamp+'.bak';
fs.copyFileSync(file, backup, fs.constants.COPYFILE_EXCL);
fs.writeFileSync(file, after, 'utf8');
console.log('SUCCESS: added '+count+' Digital Signage Media Player link(s); other products were not modified.');
console.log('Backup:', backup);
