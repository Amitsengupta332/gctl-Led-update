/**
 * GCTL LED — finish the already-completed PNG -> AVIF conversion.
 * Replaces ONLY image filename references that have verified AVIF counterparts.
 * No dependencies; does not modify product text, layouts, or route URLs.
 *
 * Install by REPLACING your current scripts/convert-png-to-avif.cjs with this file.
 * Run from your GCTL-LED-main root:
 *   node scripts/convert-png-to-avif.cjs                # Preview ONLY
 *   node scripts/convert-png-to-avif.cjs --apply        # Backup code, switch PNG URLs to AVIF
 *   node scripts/convert-png-to-avif.cjs --cleanup      # AFTER testing site, move old PNGs OUTSIDE project
 *
 * Backups are saved in a sibling directory outside the Vite project,
 * e.g. ../GCTL-LED-main-BEFORE-AVIF-CLEANUP/ (not inside public or dist).
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const publicDir = path.join(root, 'public');
const backupRoot = path.join(path.dirname(root), path.basename(root) + '-BEFORE-AVIF-CLEANUP');
const mode = process.argv[2] || '--preview';
const allowed = new Set(['--preview', '--apply', '--cleanup']);
if (!allowed.has(mode)) {
  console.error('Use --preview, --apply, or --cleanup.');
  process.exit(1);
}
if (!fs.existsSync(path.join(root, 'package.json')) || !fs.existsSync(publicDir)) {
  console.error('Run this command from the GCTL-LED-main project root (package.json and public/ required).');
  process.exit(1);
}

const skipDirs = new Set([
  'node_modules', '.git', '.vite', '.next', '.nuxt', '.vercel', '.cache',
  'dist', 'build', 'coverage', '.output', '.turbo', '.parcel-cache',
  'scripts', // migration scripts should not be rewritten as website image references
]);
const textExtensions = new Set([
  '.html', '.htm', '.css', '.scss', '.less', '.js', '.jsx',
  '.ts', '.tsx', '.mjs', '.cjs', '.json', '.vue', '.astro', '.svelte',
]);
function listFiles(dir, result = []) {
  if (!fs.existsSync(dir)) return result;
  for (const ent of fs.readdirSync(dir, {withFileTypes:true})) {
    if (ent.isSymbolicLink()) continue;
    const filename = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (!skipDirs.has(ent.name)) listFiles(filename, result);
    } else if (ent.isFile()) {
      result.push(filename);
    }
  }
  return result;
}
function isValidAvif(file) {
  try {
    const fd = fs.openSync(file, 'r');
    try {
      const buf = Buffer.alloc(12);
      if (fs.readSync(fd, buf, 0, 12, 0) < 12) return false;
      return buf.toString('ascii', 4, 8) === 'ftyp' &&
        ['avif', 'avis'].includes(buf.toString('ascii', 8, 12));
    } finally { fs.closeSync(fd); }
  } catch { return false; }
}
function escRegex(value) { return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
const pngFiles = listFiles(publicDir).filter(f => path.extname(f).toLowerCase() === '.png');
const pairs = [];
const invalid = [];
for (const png of pngFiles) {
  const avif = path.join(path.dirname(png), path.parse(png).name + '.avif');
  if (!fs.existsSync(avif) || !isValidAvif(avif)) {
    invalid.push(path.relative(root, png));
    continue;
  }
  const url = path.relative(publicDir, png).split(path.sep).join('/');
  pairs.push({png, avif, url, bytes:fs.statSync(png).size});
}
// Longest path first; do not substitute an image's basename alone, as it may be ambiguous.
pairs.sort((a, b) => b.url.length - a.url.length);
const expressions = pairs.map(asset => ({
  asset,
  // Exact public URL, optionally preceded by ./, ../, public/ or /public/.
  // Avoid replacing image filenames in remote http(s) URLs or unrelated words.
  re: new RegExp('(?<![A-Za-z0-9_:.\\/\\-])((?:(?:\\.\\.\\/)+|\\.\\/)?(?:\\/public\\/|public\\/|\\/)?' + escRegex(asset.url) + ')(?![A-Za-z0-9_.-])', 'g'),
}));
const sourceFiles = listFiles(root).filter(f =>
  textExtensions.has(path.extname(f).toLowerCase()) &&
  !f.endsWith('.min.js') &&
  !f.endsWith('.min.css') &&
  !/\.bak(?:\.|$)/i.test(path.basename(f)) &&
  path.basename(f) !== 'package-lock.json' &&
  path.basename(f) !== 'pnpm-lock.yaml'
);
let totalReferences = 0;
const changes = [];
const leftover = [];
for (const file of sourceFiles) {
  if (fs.statSync(file).size > 8 * 1024 * 1024) continue;
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  let replaced = 0;
  for (const {re} of expressions) {
    after = after.replace(re, match => {
      replaced++;
      return match.slice(0, -4) + '.avif';
    });
  }
  if (replaced) changes.push({file, before, after, count:replaced});
  totalReferences += replaced;
  // Remaining PNG text may be dynamically assembled or refer to missing images.
  // Block automated removal rather than risk broken links.
  const snippets = [];
  for (const [index, line] of after.split(/\r?\n/).entries()) {
    if (/\.png(?:\b|[?&#'"`\s)}\],])/i.test(line)) {
      if (snippets.length < 3) snippets.push(`${index + 1}: ${line.trim().slice(0, 160)}`);
    }
  }
  if (snippets.length) leftover.push({file, snippets});
}
const sizeMB = bytes => (bytes / (1024 * 1024)).toFixed(2);
const potentialSaved = pairs.reduce((sum, x) => sum + x.bytes, 0);
console.log('\nGCTL LED — AVIF migration (' + mode + ')');
console.log('PNG images found in public/:', pngFiles.length);
console.log('PNG+valid AVIF pairs:', pairs.length);
console.log('PNG without valid AVIF:', invalid.length);
console.log('Code files requiring PNG -> AVIF changes:', changes.length);
console.log('PNG references ready to switch:', totalReferences);
console.log('Source files with remaining .png mentions AFTER planned switching:', leftover.length);
console.log('Original PNG size movable out of project:', sizeMB(potentialSaved), 'MB');
console.log('Backup destination (OUTSIDE project):', backupRoot);
if (invalid.length) console.log('Missing/invalid AVIF examples:', invalid.slice(0, 12));
if (leftover.length) {
  console.log('\nRemaining .png references to check (first 12 files):');
  for (const item of leftover.slice(0, 12)) {
    console.log('  ' + path.relative(root, item.file));
    for (const snippet of item.snippets) console.log('    ' + snippet);
  }
}

if (mode === '--preview') {
  console.log('\nPREVIEW ONLY — NO FILES WERE CHANGED.');
  console.log('Next: node scripts/convert-png-to-avif.cjs --apply');
  process.exit(0);
}
if (mode === '--apply') {
  let updated = 0;
  for (const entry of changes) {
    const rel = path.relative(root, entry.file);
    const backup = path.join(backupRoot, 'original-code', rel);
    fs.mkdirSync(path.dirname(backup), {recursive:true});
    if (!fs.existsSync(backup)) fs.copyFileSync(entry.file, backup, fs.constants.COPYFILE_EXCL);
    // Recheck file has not changed while processing.
    if (fs.readFileSync(entry.file, 'utf8') !== entry.before) {
      console.error('STOP: File changed during processing:', rel);
      process.exitCode = 1;
      break;
    }
    fs.writeFileSync(entry.file, entry.after, 'utf8');
    updated++;
  }
  console.log('\nDONE:', updated, 'code files switched to AVIF references. Original code backed up.');
  console.log('PNG FILES ARE STILL PRESENT. Test your website before cleanup.');
  if (leftover.length) console.log('WARNING: Some .png mentions remain; --cleanup will refuse until resolved.');
  console.log('When tested: node scripts/convert-png-to-avif.cjs --cleanup');
  process.exit();
}
if (mode === '--cleanup') {
  if (changes.length || leftover.length || invalid.length) {
    console.error('\nCLEANUP REFUSED: URLs still need updating, unresolved .png references exist, or AVIF pairs are missing.');
    console.error('Nothing has been deleted or moved. Resolve warnings and rerun --apply/--preview.');
    process.exit(1);
  }
  // Preflight every destination first; never start a partial cleanup because of a backup collision.
  const existingBackups = pairs.filter(asset => {
    const rel = path.relative(root, asset.png);
    return fs.existsSync(path.join(backupRoot, 'original-png', rel));
  });
  if (existingBackups.length) {
    console.error('CLEANUP REFUSED: backup destinations already exist; no PNG files moved.');
    console.error(existingBackups.slice(0, 8).map(x => path.relative(root, x.png)));
    process.exit(1);
  }
  let moved = 0, movedBytes = 0;
  for (const asset of pairs) {
    const rel = path.relative(root, asset.png);
    const dest = path.join(backupRoot, 'original-png', rel);
    fs.mkdirSync(path.dirname(dest), {recursive:true});
    if (fs.existsSync(dest)) {
      console.error('Backup already exists; refusing to overwrite or remove:', dest);
      process.exitCode = 1;
      continue;
    }
    fs.renameSync(asset.png, dest); // Same drive: move, not copy. Removes PNG from public/.
    moved++;
    movedBytes += asset.bytes;
  }
  console.log('\nDONE:', moved, 'PNGs moved OUTSIDE the website project.');
  console.log('Project PNG space reduced by about:', sizeMB(movedBytes), 'MB');
  console.log('No PNGs permanently deleted. Restore from:',path.join(backupRoot, 'original-png'));
  console.log('Now run npm run dev and npm run build; check the Network tab for image 404s.');
}
