# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

alien-blood-contrast — ein VS Code Color Theme Extension, das Alien Blood UI mit Solarized Dark Syntax-Highlighting kombiniert.

## Merge-Strategie

- **UI-Farben** (`colors` in der Theme-JSON): aus **Alien Blood** (thomasbishop.alien-blood)
- **Syntax-Highlighting** (`tokenColors` in der Theme-JSON): aus **Solarized Dark** (VS Code built-in)
- `editor.foreground` wurde auf Solarized's `#839496` angepasst, damit Syntax-Text zum Highlighting passt

## Struktur

- `package.json` — Extension-Manifest, registriert das Theme unter `contributes.themes`
- `themes/alien-blood-contrast.json` — die eigentliche Theme-Datei

## Testen

Theme lokal testen: `F5` in VS Code (startet Extension Development Host) oder:
```
code --extensionDevelopmentPath=/Users/steve/git-projects/private/alien-blood-contrast
```
