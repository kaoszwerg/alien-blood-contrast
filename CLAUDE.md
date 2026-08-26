# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

alien-blood-contrast — eine VS Code Color Theme Extension, die Alien Blood UI mit Solarized Dark Syntax-Highlighting kombiniert. Sie liefert **zehn** Themes in einem Paket aus (`contributes.themes` ist ein Array): zwei Kontraststufen, jeweils neutral oder mit einem von vier Statusbar-Akzenten.

## Merge-Strategie

- **UI-Farben** (`colors` in der Theme-JSON): aus **Alien Blood** (thomasbishop.alien-blood)
- **Syntax-Highlighting** (`tokenColors` in der Theme-JSON): aus **Solarized Dark** (VS Code built-in)
- `editor.foreground` wurde auf Solarized's `#839496` angepasst, damit Syntax-Text zum Highlighting passt

## Struktur

- `package.json` — Extension-Manifest, registriert die Themes unter `contributes.themes`
- `themes/alien-blood-contrast.json` — **die einzige handgepflegte Datei**, Quelle für alles andere
- `themes/alien-blood-contrast-{green,blue,orange,violet}.json` — generiert
- `themes/alien-blood-contrast-high*.json` — generiert
- `scripts/build-themes.js` — Theme-Generator
- `scripts/build-preview.js` — erzeugt `docs/index.html`
- `docs/index.html` — generierte Vorschau aller Varianten mit Kontrastwerten

## Generieren

```
npm run build
```

Der Generator liest die Basisdatei und schreibt neun abgeleitete Theme-Dateien plus die `contributes.themes`-Liste in `package.json`; `build-preview` erzeugt zusätzlich `docs/index.html`. Beide Skripte sind idempotent. **Änderungen gehören ausschließlich in die Basisdatei** — Handänderungen an den generierten Dateien gehen beim nächsten Lauf verloren.

Zwei Ableitungsregeln stecken im Generator:

- **High-Kontrast**: Keys mit `background` oder `shadow` im Namen behalten den Original-Alien-Blood-Wert, alle übrigen werden über eine Farbtabelle aufgehellt (Syntax: Solarized Dark → hellere Werte). Die Flächen bleiben dadurch exakt das Original-Theme.
- **Akzente**: setzen ausschließlich `statusBar*`-Keys, damit sich mehrere Fenster unterscheiden lassen.

## Testen

Theme lokal testen: `F5` in VS Code (startet Extension Development Host) oder:
```
code --extensionDevelopmentPath=E:\gitprojects\alien-blood-contrast
```
