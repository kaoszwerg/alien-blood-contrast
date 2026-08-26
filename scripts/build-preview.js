#!/usr/bin/env node
/**
 * Erzeugt docs/index.html — eine Vorschau aller Theme-Varianten mit Kontrastwerten.
 *
 *   node scripts/build-preview.js [ausgabedatei]
 *
 * Liest die Theme-Dateien aus themes/. Nach Änderungen am Theme neu ausführen,
 * sonst zeigt die Seite veraltete Farben.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

/**
 * Design-Plan
 * Farbe   Ground mit leichtem Grünstich (das Subjekt ist ein grünes Theme), damit die
 *         Neutralen gewählt statt geerbt wirken. Akzent ist das Alien-Blood-Grün #2f7e25
 *         bzw. #4fd93c im Dunklen — sparsam, weil die Theme-Panels selbst die Farbe tragen.
 * Type    IBM Plex Serif für Überschriften, IBM Plex Sans für Text, IBM Plex Mono für
 *         Code und Zahlen. Eine Familie, drei Rollen — technisch, kohärent, kein Default-Grotesk.
 * Layout  Zwei Sektionen: Kontraststufen als Zweispalter mit Fenster-Nachbildung,
 *         Akzente als volle Breite gestapelte Streifen. Eyebrows benennen die Sektionen,
 *         keine Nummerierung — es ist keine Sequenz.
 */

const LEVELS = [
  ['Standard', 'Alien Blood Contrast', 'themes/alien-blood-contrast.json'],
  ['Kontraststark', 'Alien Blood Contrast High', 'themes/alien-blood-contrast-high.json'],
];

const ACCENTS = [
  ['Grün', 'Green', 'themes/alien-blood-contrast-high-green.json'],
  ['Blau', 'Blue', 'themes/alien-blood-contrast-high-blue.json'],
  ['Orange', 'Orange', 'themes/alien-blood-contrast-high-orange.json'],
  ['Violett', 'Violet', 'themes/alien-blood-contrast-high-violet.json'],
];

const CODE = [
  [['// resolve the active color theme', 'comment']],
  [],
  [['export', 'keyword'], [' ', ''], ['class', 'storage'], [' ', ''], ['ThemeRegistry', 'entity.name.class'], [' {', '']],
  [['  private', 'storage'], [' themes = ', ''], ['new', 'keyword.other.new'], [' ', ''], ['Map', 'support.class'], ['<', ''], ['string', 'support.type'], [', Theme>();', '']],
  [],
  [['  ', ''], ['register', 'entity.name.function'], ['(id: ', ''], ['string', 'support.type'], [', theme: Theme): ', ''], ['void', 'support.type'], [' {', '']],
  [['    ', ''], ['if', 'keyword'], [' (!id) ', ''], ['throw', 'keyword'], [' ', ''], ['new', 'keyword.other.new'], [' ', ''], ['Error', 'support.type.exception'], ['(', ''], ['"id is required"', 'string'], [');', '']],
  [['    ', ''], ['this', 'variable.language'], ['.themes.set(id, theme);', '']],
  [['  }', '']],
  [],
  [['  get', 'storage'], [' ', ''], ['size', 'entity.name.function'], ['(): ', ''], ['number', 'support.type'], [' {', '']],
  [['    ', ''], ['return', 'keyword'], [' ', ''], ['this', 'variable.language'], ['.themes.size ?? ', ''], ['0', 'constant.numeric'], [';', '']],
  [['  }', '']],
  [['}', '']],
];

const lum = (hex) => {
  const c = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

function resolve(theme, scope) {
  let best = null;
  let bestLen = -1;
  for (const rule of theme.tokenColors) {
    const fg = rule.settings && rule.settings.foreground;
    if (!fg) continue;
    const scopes = rule.scope ? (Array.isArray(rule.scope) ? rule.scope : [rule.scope]) : [''];
    for (const s of scopes) {
      const hit = s === '' ? scope === '' : scope === s || scope.startsWith(s + '.');
      if (hit && s.length > bestLen) {
        best = rule;
        bestLen = s.length;
      }
    }
  }
  if (!best) {
    const dflt = theme.tokenColors.find((r) => !r.scope && r.settings.foreground);
    return { fg: dflt ? dflt.settings.foreground : theme.colors['editor.foreground'], style: '' };
  }
  return { fg: best.settings.foreground, style: best.settings.fontStyle || '' };
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const load = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const grade = (r) => (r >= 7 ? 'ok' : r >= 4.5 ? 'warn' : 'bad');

function statusbar(t) {
  const bg = t.colors['statusBar.background'].slice(0, 7);
  const fg = t.colors['statusBar.foreground'].slice(0, 7);
  return `<div class="sb" style="background:${bg};color:${fg}">
      <span class="sb-grp"><span>&#9095;&nbsp; main*</span><span>&#8593;1 &#8595;0</span><span>&#9888;&nbsp;0 &nbsp;&#10006;&nbsp;0</span></span>
      <span class="sb-grp"><span>Ln 12, Col 4</span><span>UTF-8</span><span>TypeScript</span></span>
    </div>`;
}

function editor(t) {
  const bg = t.colors['editor.background'].slice(0, 7);
  const gutter = t.colors['editorLineNumber.foreground'].slice(0, 7);
  const gutterActive = t.colors['editorLineNumber.activeForeground'].slice(0, 7);
  const hl = t.colors['editor.lineHighlightBackground'];

  let lines = '';
  CODE.forEach((line, i) => {
    const n = i + 1;
    const active = n === 7;
    let content = '';
    for (const [text, scope] of line) {
      const { fg, style } = resolve(t, scope);
      const italic = style.includes('italic') ? 'font-style:italic;' : '';
      const bold = style.includes('bold') ? 'font-weight:600;' : '';
      content += `<span style="color:${fg};${italic}${bold}">${esc(text)}</span>`;
    }
    lines += `<div class="ln"${active ? ` style="background:${hl}"` : ''}><span class="num" style="color:${active ? gutterActive : gutter}">${n}</span><span class="code">${content || '&nbsp;'}</span></div>`;
  });
  return `<div class="editor" style="background:${bg}">${lines}</div>`;
}

function panel(eyebrow, label, path) {
  const t = load(path);
  const bg = t.colors['editor.background'].slice(0, 7);

  const samples = [
    ['Normaler Text', resolve(t, '').fg],
    ['Kommentar', resolve(t, 'comment').fg],
    ['Keyword', resolve(t, 'keyword').fg],
    ['String', resolve(t, 'string').fg],
    ['Klassenname', resolve(t, 'entity.name.class').fg],
    ['Zahl', resolve(t, 'constant.numeric').fg],
    ['Zeilennummer', t.colors['editorLineNumber.foreground']],
  ];

  const rows = samples
    .map(([n, c]) => {
      const r = ratio(c.slice(0, 7), bg);
      return `<tr><th scope="row">${n}</th><td><span class="chip" style="background:${c}"></span><code>${c}</code></td><td class="num-cell ${grade(r)}">${r.toFixed(2)}</td></tr>`;
    })
    .join('');

  return `<article class="panel">
      <header class="panel-head">
        <p class="eyebrow">${eyebrow}</p>
        <h3>${label}</h3>
      </header>
      <div class="win">${editor(t)}${statusbar(t)}</div>
      <table>
        <caption class="sr-only">Kontrastwerte für ${label}</caption>
        <thead><tr><th scope="col">Element</th><th scope="col">Farbe</th><th scope="col">Kontrast</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </article>`;
}

function accentRow(de, en, path) {
  const t = load(path);
  const bg = t.colors['statusBar.background'].slice(0, 7);
  const fg = t.colors['statusBar.foreground'].slice(0, 7);
  const r = ratio(fg, bg);
  return `<article class="acc">
      <div class="acc-meta">
        <h3>${de}</h3>
        <p class="acc-name"><code>Alien Blood Contrast High ${en}</code></p>
        <p class="acc-nums">
          <span class="chip" style="background:${bg}"></span><code>${bg}</code>
          <span class="sep">auf</span>
          <span class="chip" style="background:${fg}"></span><code>${fg}</code>
          <span class="sep">&middot;</span>
          <span class="${grade(r)} num-cell">${r.toFixed(2)}:1</span>
        </p>
      </div>
      <div class="win acc-win">${statusbar(t)}</div>
    </article>`;
}

const html = `<title>Alien Blood Contrast Varianten</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Serif:wght@500;600&display=swap">
<style>
  :root {
    color-scheme: light;
    --ground:   #f4f7f4;
    --surface:  #ffffff;
    --ink:      #121a14;
    --muted:    #5b6d61;
    --line:     #dbe4dd;
    --line-soft:#e9efea;
    --accent:   #2f7e25;
    --ok:       #1a7f45;
    --warn:     #8a6500;
    --bad:      #bd332c;
    --serif: "IBM Plex Serif", Georgia, "Times New Roman", serif;
    --sans: "IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
    --mono: "IBM Plex Mono", "Cascadia Code", Consolas, "Liberation Mono", monospace;
  }
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme="light"]) {
      color-scheme: dark;
      --ground:   #0c110d;
      --surface:  #141b16;
      --ink:      #e3ece5;
      --muted:    #90a396;
      --line:     #242e27;
      --line-soft:#1b231d;
      --accent:   #56c944;
      --ok:       #4ed17f;
      --warn:     #d9b23c;
      --bad:      #ff6d63;
    }
  }
  :root[data-theme="dark"] {
    color-scheme: dark;
    --ground:   #0c110d;
    --surface:  #141b16;
    --ink:      #e3ece5;
    --muted:    #90a396;
    --line:     #242e27;
    --line-soft:#1b231d;
    --accent:   #56c944;
    --ok:       #4ed17f;
    --warn:     #d9b23c;
    --bad:      #ff6d63;
  }

  *, *::before, *::after { box-sizing: border-box; }

  body {
    background: var(--ground);
    color: var(--ink);
    margin: 0;
    padding: clamp(28px, 5vw, 56px) clamp(18px, 4vw, 44px) 72px;
    font: 400 15px/1.6 var(--sans);
    -webkit-font-smoothing: antialiased;
  }

  .wrap { max-width: 1180px; margin: 0 auto; display: flex; flex-direction: column; gap: 44px; }

  .masthead { display: flex; flex-direction: column; gap: 10px;
              border-bottom: 1px solid var(--line); padding-bottom: 22px; }
  h1 { font: 600 clamp(27px, 3.4vw, 37px)/1.15 var(--serif); margin: 0;
       letter-spacing: -0.015em; text-wrap: balance; }
  .lede { margin: 0; color: var(--muted); max-width: 64ch; font-size: 15.5px; }

  .eyebrow { font: 500 11px/1 var(--mono); letter-spacing: 0.13em;
             text-transform: uppercase; color: var(--accent); margin: 0; }

  section { display: flex; flex-direction: column; gap: 18px; }
  .sec-head { display: flex; flex-direction: column; gap: 7px;
              border-bottom: 1px solid var(--line-soft); padding-bottom: 13px; }
  h2 { font: 600 19px/1.25 var(--serif); margin: 0; letter-spacing: -0.01em; }
  .sec-head p { margin: 0; color: var(--muted); font-size: 14px; max-width: 68ch; }

  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(390px, 1fr)); gap: 20px; }

  .panel { background: var(--surface); border: 1px solid var(--line);
           border-radius: 9px; padding: 17px; min-width: 0;
           display: flex; flex-direction: column; gap: 14px; }
  .panel-head { display: flex; flex-direction: column; gap: 5px; }
  .panel-head h3 { font: 600 15.5px/1.2 var(--sans); margin: 0; }

  .win { border-radius: 6px; overflow: hidden; border: 1px solid var(--line-soft); }
  .editor { padding: 13px 0; overflow-x: auto; font: 400 12.5px/1.7 var(--mono); }
  .ln { display: flex; white-space: pre; min-width: max-content; }
  .num { flex: 0 0 46px; text-align: right; padding-right: 16px;
         user-select: none; font-variant-numeric: tabular-nums; }
  .code { flex: 1 1 auto; padding-right: 16px; }

  .sb { display: flex; justify-content: space-between; align-items: center; gap: 16px;
        padding: 0 11px; height: 27px; font: 400 11.5px/1 var(--sans);
        white-space: nowrap; overflow: hidden; }
  .sb-grp { display: flex; gap: 15px; align-items: center; }

  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  thead th { text-align: left; font: 500 10.5px/1 var(--mono); color: var(--muted);
             text-transform: uppercase; letter-spacing: 0.1em; padding: 0 10px 8px 0; }
  thead th:last-child, td.num-cell { text-align: right; padding-right: 0; }
  tbody th { text-align: left; font-weight: 400; }
  tbody th, td { padding: 6px 10px 6px 0; border-top: 1px solid var(--line-soft); }
  .num-cell { font: 500 13px/1 var(--mono); font-variant-numeric: tabular-nums; }
  code { font: 400 12px/1 var(--mono); color: var(--muted); }

  .chip { display: inline-block; width: 11px; height: 11px; border-radius: 3px;
          margin-right: 7px; vertical-align: -1px;
          box-shadow: inset 0 0 0 1px rgba(128,128,128,.4); }

  .ok { color: var(--ok); }
  .warn { color: var(--warn); }
  .bad { color: var(--bad); }

  .acc { background: var(--surface); border: 1px solid var(--line); border-radius: 9px;
         padding: 15px 17px; display: grid; grid-template-columns: minmax(230px, 300px) 1fr;
         gap: 20px; align-items: center; }
  .acc-meta { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .acc-meta h3 { font: 600 15px/1.2 var(--sans); margin: 0; }
  .acc-name { margin: 0; }
  .acc-nums { margin: 2px 0 0; display: flex; align-items: center; gap: 6px;
              flex-wrap: wrap; font-size: 12px; }
  .acc-nums .num-cell { font-size: 12px; }
  .sep { color: var(--muted); }
  .acc-win { min-width: 0; }
  @media (max-width: 700px) {
    .acc { grid-template-columns: 1fr; gap: 13px; align-items: stretch; }
  }

  .note { margin: 0; color: var(--muted); font-size: 13.5px; max-width: 70ch;
          border-left: 2px solid var(--accent); padding-left: 13px; }

  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
             overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
</style>

<div class="wrap">
  <header class="masthead">
    <p class="eyebrow">VS Code Extension &middot; zehn Themes, ein Paket</p>
    <h1>Alien Blood Contrast</h1>
    <p class="lede">Farben direkt aus den Theme-JSON-Dateien gelesen, Scope-Auflösung wie in VS Code. Kontrastwerte nach WCAG, jeweils gegen den eigenen Hintergrund der Variante.</p>
  </header>

  <section>
    <div class="sec-head">
      <h2>Kontraststufen</h2>
      <p>Beide teilen jede Hintergrundfläche — angehoben sind nur Text, Icons, Rahmen und Zeilennummern. Zeile&nbsp;7 zeigt zusätzlich das Zeilen-Highlight.</p>
    </div>
    <div class="grid">${LEVELS.map(([e, l, p]) => panel(e, l, p)).join('')}</div>
    <p class="note">In der Standard-Variante liegen fünf Elemente unter dem AA-Schwellwert von 4.5:1, in der kontraststarken keines — der schwächste Wert dort ist 6.15:1.</p>
  </section>

  <section>
    <div class="sec-head">
      <h2>Statusbar-Akzente</h2>
      <p>Zum Unterscheiden mehrerer Fenster. Jede Akzent-Variante ist mit ihrer Stufe identisch bis auf die <code>statusBar*</code>-Keys; gezeigt ist die kontraststarke Stufe, die Standard-Stufe trägt dieselben vier Farben.</p>
    </div>
    ${ACCENTS.map(([de, en, p]) => accentRow(de, en, p)).join('')}
    <p class="note">Orange trägt als einziges dunklen Text — auf dem hellen Orange käme Weiß nur auf 2.69:1 und wäre kaum lesbar.</p>
  </section>
</div>`;

const out = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, 'docs', 'index.html');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log('geschrieben:', path.relative(ROOT, out).split(path.sep).join('/'));
