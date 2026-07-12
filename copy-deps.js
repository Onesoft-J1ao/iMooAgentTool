// copy-deps.js - Copy original asar's node_modules to build project
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASAR_TOOL = path.join(__dirname, 'node_modules', '@electron', 'asar', 'bin', 'asar.js');
const TMP = path.join(__dirname, 'tmp-asar-extract');
const SRC_ASAR = 'D:\\iMooDesktop\\resources\\app.asar';
const BUILD = __dirname;

console.log('Extracting original asar for dependencies...');
if (fs.existsSync(TMP)) fs.rmSync(TMP, { recursive: true, force: true });
execSync(`node "${ASAR_TOOL}" extract "${SRC_ASAR}" "${TMP}"`, { cwd: __dirname });

function copyDir(s, d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  const entries = fs.readdirSync(s, { withFileTypes: true });
  for (const e of entries) {
    const sp = path.join(s, e.name);
    const dp = path.join(d, e.name);
    if (e.isDirectory()) copyDir(sp, dp);
    else fs.copyFileSync(sp, dp);
  }
}

// Remove build project's node_modules (TypeScript deps - not needed)
const buildNM = path.join(BUILD, 'node_modules');
if (fs.existsSync(buildNM)) {
  console.log('Removing old node_modules...');
  fs.rmSync(buildNM, { recursive: true, force: true });
}

// Copy original asar's node_modules
const asarNM = path.join(TMP, 'node_modules');
if (fs.existsSync(asarNM)) {
  console.log('Copying original node_modules...');
  copyDir(asarNM, buildNM);
  const count = fs.readdirSync(buildNM).length;
  console.log(`Copied ${count} directories`);
} else {
  console.log('ERROR: node_modules not found in asar!');
  process.exit(1);
}

// Copy asar-unpacked resources
['bin', 'edl', 'scripts', 'data', 'assets'].forEach(d => {
  const src = path.join(TMP, 'resources', d);
  const dst = path.join(BUILD, 'resources', d);
  if (fs.existsSync(src)) {
    if (fs.existsSync(dst)) fs.rmSync(dst, { recursive: true, force: true });
    copyDir(src, dst);
    console.log(`Copied resources/${d}`);
  }
});

// Cleanup
fs.rmSync(TMP, { recursive: true, force: true });
console.log('Done');
