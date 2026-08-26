#!/usr/bin/env node
/**
 * Erzeugt alle Theme-Varianten aus themes/alien-blood-contrast.json
 * und schreibt die passende contributes.themes-Liste in package.json.
 *
 *   node scripts/build-themes.js
 *
 * Die Basisdatei ist die einzige Quelle. Alles andere wird generiert —
 * Handänderungen an den abgeleiteten Dateien gehen beim nächsten Lauf verloren.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const THEMES_DIR = path.join(ROOT, 'themes');
const BASE_FILE = 'alien-blood-contrast.json';
const BASE_LABEL = 'Alien Blood Contrast';

// --- Kontrastverstärkung -------------------------------------------------
// Gleiche Alien-Blood-Farbtöne, nur Helligkeit und Sättigung angehoben.
// Hintergrundflächen bleiben unangetastet (siehe isBackground).

const UI = {
  '#1d4125': '#37793f', // Borders
  '#637d75': '#c2d8ce', // UI-Vordergrundtext
  '#647d75': '#c2d8ce', // Icons
  '#2f7e25': '#4fd93c', // Akzentgrün
  '#327f77': '#4fcfc2', // cyan
  '#2f6a7f': '#4fbadd', // blue
  '#47587f': '#8b9ae0', // magenta
  '#717f24': '#c3db3a', // yellow / warning
  '#3c4812': '#6e8526', // bright black
  '#7f2b27': '#f0554e', // error / red
  '#e08009': '#ffa62b', // orange
  '#0058e0': '#5f8dff', // bright magenta
  '#839496': '#d3dede', // editor.foreground
};

// Solarized Dark -> aufgehellte Werte
const TOKEN = {
  '#839496': '#d3dede', // base0 — normaler Text
  '#586E75': '#93a8ae', // base01 — Kommentare
  '#93A1A1': '#dce6e6', // base1
  '#2AA198': '#4fdcd0', // cyan
  '#DC322F': '#ff5f58', // red
  '#D33682': '#ff6bad', // magenta
  '#268BD2': '#63bdff', // blue
  '#859900': '#c3dd1a', // green
  '#CB4B16': '#ff7b30', // orange
  '#B58900': '#f0bd20', // yellow
  '#6C71C4': '#a3a8f5', // violet
};

const HIGH_OVERRIDES = {
  'terminal.foreground': '#d6e6de',
  'terminal.ansiWhite': '#d6e6de',
  'terminal.ansiBrightWhite': '#f2f8f5',
  'editorLineNumber.foreground': '#6cae7a',
  'editorLineNumber.activeForeground': '#e2f0e8',
};

const isBackground = (key) => /background|shadow/i.test(key);

/** mappt #rrggbb und behält ein evtl. angehängtes Alpha-Paar */
function remap(value, table) {
  if (typeof value !== 'string' || !value.startsWith('#')) return value;
  const base = value.slice(0, 7).toLowerCase();
  const alpha = value.slice(7);
  for (const [from, to] of Object.entries(table)) {
    if (from.toLowerCase() === base) return to + alpha;
  }
  return value;
}

function toHighContrast(src) {
  const colors = {};
  for (const [key, val] of Object.entries(src.colors)) {
    colors[key] = isBackground(key) ? val : remap(val, UI);
  }
  Object.assign(colors, HIGH_OVERRIDES);

  const tokenColors = src.tokenColors.map((rule) => {
    const next = JSON.parse(JSON.stringify(rule));
    if (next.settings && next.settings.foreground) {
      next.settings.foreground = remap(next.settings.foreground, TOKEN);
    }
    return next;
  });

  return { colors, tokenColors };
}

// --- Statusbar-Akzente ---------------------------------------------------
// Zum Unterscheiden mehrerer Fenster. Vordergrund ist jeweils der Wert mit
// dem besseren Kontrast auf der Akzentfarbe.

const ACCENTS = [
  { id: 'green', label: 'Green', bg: '#2f7e25', fg: '#f2f8f5' },
  { id: 'blue', label: 'Blue', bg: '#2f6a7f', fg: '#f2f8f5' },
  { id: 'orange', label: 'Orange', bg: '#e08009', fg: '#08120b' },
  { id: 'violet', label: 'Violet', bg: '#47587f', fg: '#f2f8f5' },
];

function applyAccent(colors, accent) {
  const dark = accent.fg.startsWith('#0');
  return {
    ...colors,
    'statusBar.background': accent.bg,
    'statusBar.foreground': accent.fg,
    'statusBar.border': accent.bg,
    'statusBar.debuggingBackground': accent.bg,
    'statusBar.debuggingBorder': accent.bg,
    'statusBar.debuggingForeground': accent.fg,
    'statusBar.noFolderBackground': accent.bg,
    'statusBar.noFolderBorder': accent.bg,
    'statusBar.noFolderForeground': accent.fg,
    'statusBarItem.hoverBackground': dark ? '#00000026' : '#ffffff26',
    'statusBarItem.activeBackground': dark ? '#0000003d' : '#ffffff3d',
    'statusBarItem.prominentBackground': dark ? '#00000030' : '#ffffff30',
    'statusBarItem.prominentHoverBackground': dark ? '#00000045' : '#ffffff45',
    'statusBarItem.remoteBackground': accent.bg,
    'statusBarItem.remoteForeground': accent.fg,
  };
}

// --- Erzeugen ------------------------------------------------------------

const base = JSON.parse(fs.readFileSync(path.join(THEMES_DIR, BASE_FILE), 'utf8'));
const high = toHighContrast(base);

/** [Dateisuffix, Label-Zusatz, colors, tokenColors] */
const VARIANTS = [];

for (const level of [
  { suffix: '', label: '', colors: base.colors, tokenColors: base.tokenColors, isBase: true },
  { suffix: '-high', label: ' High', colors: high.colors, tokenColors: high.tokenColors },
]) {
  if (!level.isBase) {
    VARIANTS.push({
      file: `alien-blood-contrast${level.suffix}.json`,
      label: `${BASE_LABEL}${level.label}`,
      colors: level.colors,
      tokenColors: level.tokenColors,
    });
  }
  for (const accent of ACCENTS) {
    VARIANTS.push({
      file: `alien-blood-contrast${level.suffix}-${accent.id}.json`,
      label: `${BASE_LABEL}${level.label} ${accent.label}`,
      colors: applyAccent(level.colors, accent),
      tokenColors: level.tokenColors,
    });
  }
}

for (const v of VARIANTS) {
  const theme = {
    name: v.label,
    type: 'dark',
    semanticHighlighting: true,
    colors: v.colors,
    tokenColors: v.tokenColors,
  };
  fs.writeFileSync(path.join(THEMES_DIR, v.file), JSON.stringify(theme, null, 2) + '\n');
}

// package.json: nur contributes.themes ersetzen, Rest unverändert lassen
const pkgPath = path.join(ROOT, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.contributes.themes = [
  { label: BASE_LABEL, uiTheme: 'vs-dark', path: `./themes/${BASE_FILE}` },
  ...VARIANTS.map((v) => ({
    label: v.label,
    uiTheme: 'vs-dark',
    path: `./themes/${v.file}`,
  })),
];
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`${VARIANTS.length} Varianten erzeugt, ${pkg.contributes.themes.length} Themes registriert:`);
for (const t of pkg.contributes.themes) console.log('  -', t.label);
