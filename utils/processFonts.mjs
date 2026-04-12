import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import * as fontkit from 'fontkit';
import wawoff2 from 'wawoff2';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const THEME_PATH  = path.join(ROOT, 'src/_data/theme.yml');
const FONT_OUT_DIR = path.join(ROOT, 'dist/assets/fonts/processed');
const CSS_OUT_PATH = path.join(ROOT, 'src/assets/styles/generated-fonts.scss');

// Which theme keys map to which CSS variable names
const FONT_SLOTS = [
  { key: 'heading_font', cssVar: '--heading-font' },
  { key: 'content_font', cssVar: '--content-font' },
  { key: 'logo_font',    cssVar: '--logo-font'    },
];


// ---------------------------------------------------------------------------
// WOFF → TTF decompressor
// WOFF tables are individually compressed with zlib compress() (with header),
// so Node's inflateSync handles them correctly.
// ---------------------------------------------------------------------------
function woffToTtf(buffer) {
  const numTables     = buffer.readUInt16BE(12);
  const sfVersion     = buffer.readUInt32BE(4);
  const totalSfntSize = buffer.readUInt32BE(16);

  const sfnt = Buffer.alloc(totalSfntSize);

  // --- SFNT offset table ---
  sfnt.writeUInt32BE(sfVersion, 0);
  sfnt.writeUInt16BE(numTables, 4);

  // searchRange / entrySelector / rangeShift
  let sr = 1, es = 0;
  while (sr * 2 <= numTables) { sr *= 2; es++; }
  sr *= 16;
  sfnt.writeUInt16BE(sr, 6);
  sfnt.writeUInt16BE(es, 8);
  sfnt.writeUInt16BE(numTables * 16 - sr, 10);

  // --- Parse WOFF table directory ---
  const tables = [];
  let woffDirOffset = 44;              // WOFF header is 44 bytes
  let sfntDataOffset = 12 + numTables * 16; // SFNT offset table + dir entries

  for (let i = 0; i < numTables; i++) {
    const tag        = buffer.toString('ascii', woffDirOffset,      woffDirOffset + 4);
    const offset     = buffer.readUInt32BE(woffDirOffset + 4);
    const compLength = buffer.readUInt32BE(woffDirOffset + 8);
    const origLength = buffer.readUInt32BE(woffDirOffset + 12);
    const checksum   = buffer.readUInt32BE(woffDirOffset + 16);

    tables.push({ tag, offset, compLength, origLength, checksum, sfntDataOffset });

    // SFNT tables must be 4-byte aligned
    sfntDataOffset += origLength + ((4 - (origLength % 4)) % 4);
    woffDirOffset  += 20;
  }

  // --- Write SFNT table directory + decompress table data ---
  let sfntDirOffset = 12;
  for (const t of tables) {
    sfnt.write(t.tag, sfntDirOffset, 'ascii');
    sfnt.writeUInt32BE(t.checksum,      sfntDirOffset + 4);
    sfnt.writeUInt32BE(t.sfntDataOffset, sfntDirOffset + 8);
    sfnt.writeUInt32BE(t.origLength,    sfntDirOffset + 12);
    sfntDirOffset += 16;

    const compData = buffer.subarray(t.offset, t.offset + t.compLength);
    const tableData = t.compLength === t.origLength
      ? compData                       // stored uncompressed
      : zlib.inflateSync(compData);    // inflate zlib stream

    tableData.copy(sfnt, t.sfntDataOffset);
  }

  return sfnt;
}


// ---------------------------------------------------------------------------
// Font metadata extraction via fontkit
// ---------------------------------------------------------------------------
async function inspectFont(filePath) {
  const font = await fontkit.open(filePath);

  const axes = Object.entries(font.variationAxes || {}).map(([tag, axis]) => ({
    tag,
    min:     axis.min,
    default: axis.default,
    max:     axis.max,
  }));

  return {
    family:     font.familyName,
    isVariable: axes.length > 0,
    axes,
  };
}


// ---------------------------------------------------------------------------
// Convert source font to WOFF2, return output path + metadata
// ---------------------------------------------------------------------------
async function processFont(srcAbsPath) {
  const ext      = path.extname(srcAbsPath).toLowerCase();
  const basename = path.basename(srcAbsPath, ext);
  const outPath  = path.join(FONT_OUT_DIR, `${basename}.woff2`);

  // Grab metadata from the source (fontkit handles all formats natively)
  const meta = await inspectFont(srcAbsPath);

  if (fs.existsSync(outPath)) {
    console.log(`  [fonts] ✓ cached  — ${basename}.woff2`);
    return { outPath, meta };
  }

  const inputBuffer = fs.readFileSync(srcAbsPath);

  if (ext === '.woff2') {
    // Already the target format — copy as-is
    fs.copyFileSync(srcAbsPath, outPath);
    console.log(`  [fonts] ✓ copied  — ${basename}.woff2 (already woff2)`);

  } else {
    // Get a TTF-compatible buffer: decompress WOFF, or pass TTF/OTF directly
    const ttfBuffer = ext === '.woff' ? woffToTtf(inputBuffer) : inputBuffer;

    // wawoff2.compress returns a Uint8Array
    const woff2Data = await wawoff2.compress(ttfBuffer);
    fs.writeFileSync(outPath, Buffer.from(woff2Data));

    const savedKb = ((inputBuffer.length - woff2Data.length) / 1024).toFixed(1);
    const variable = meta.isVariable ? ' [variable]' : '';
    console.log(`  [fonts] ✓ encoded — ${basename}.woff2${variable} (saved ${savedKb}kb)`);
  }

  return { outPath, meta };
}


// ---------------------------------------------------------------------------
// CSS generation
// ---------------------------------------------------------------------------
function fontFaceCss(meta, woff2AbsPath) {
  // Make the path relative to the project root for the public URL
  const publicPath = '/' + path.relative(path.join(ROOT, 'dist'), woff2AbsPath).replace(/\\/g, '/');

  if (meta.isVariable) {
    const wght = meta.axes.find(a => a.tag === 'wght');
    const weightRange = wght ? `${wght.min} ${wght.max}` : '100 900';

    return `@font-face {
  font-family: '${meta.family}';
  src: url('${publicPath}') format('woff2 supports variations'),
       url('${publicPath}') format('woff2');
  font-weight: ${weightRange};
  font-style: normal;
  font-display: swap;
}`;
  }

  return `@font-face {
  font-family: '${meta.family}';
  src: url('${publicPath}') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}`;
}


// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
export async function processFonts() {
  const theme = yaml.load(fs.readFileSync(THEME_PATH, 'utf8'));

  fs.mkdirSync(FONT_OUT_DIR, { recursive: true });

  const fontFaceBlocks = [];
  const cssVarLines    = [];
  let processed        = 0;

  console.log('[fonts] Scanning theme.yml for custom font files…');

  const FONT_EXTS = new Set(['.woff', '.woff2', '.ttf', '.otf']);

  for (const { key, cssVar } of FONT_SLOTS) {
    const raw = theme[`${key}_file`];
    if (!raw || typeof raw !== 'string') continue; // No file configured — skip

    const ext = path.extname(raw).toLowerCase();
    if (!FONT_EXTS.has(ext)) {
      console.warn(`  [fonts] ⚠ skipping — "${raw}" is not a font file (slot: ${key})`);
      continue;
    }

    const fileValue = "src/" + raw;
    const srcAbsPath = path.join(ROOT, fileValue);

    if (!fs.existsSync(srcAbsPath) || !fs.statSync(srcAbsPath).isFile()) {
      console.warn(`  [fonts] ⚠ not found — ${fileValue} (slot: ${key})`);
      continue;
    }

    const { outPath, meta } = await processFont(srcAbsPath);
    fontFaceBlocks.push(fontFaceCss(meta, outPath));
    cssVarLines.push(`  ${cssVar}: '${meta.family}', sans-serif;`);
    processed++;
  }

  if (processed === 0) {
    console.log('[fonts] No custom font files found — nothing to do.');
    return;
  }

  // Write the CSS file
  const css = [
    '/* Auto-generated by process-fonts.mjs — do not edit */',
    '',
    ...fontFaceBlocks,
    '',
    ':root {',
    ...cssVarLines,
    '}',
    '',
  ].join('\n');

  fs.writeFileSync(CSS_OUT_PATH, css);
  console.log(`[fonts] CSS written → ${path.relative(ROOT, CSS_OUT_PATH)}`);
}

// Auto-run when executed directly (e.g. `node ./utils/processFonts.mjs`)
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) {
  processFonts();
}