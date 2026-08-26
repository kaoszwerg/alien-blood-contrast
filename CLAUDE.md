# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

alien-blood-contrast — eine VS Code Color Theme Extension, die Alien Blood UI mit Solarized Dark Syntax-Highlighting kombiniert. Sie liefert **zwei** Themes in einem Paket aus (`contributes.themes` ist ein Array): die Standard-Variante und eine kontrastverstärkte Variante.

## Merge-Strategie

- **UI-Farben** (`colors` in der Theme-JSON): aus **Alien Blood** (thomasbishop.alien-blood)
- **Syntax-Highlighting** (`tokenColors` in der Theme-JSON): aus **Solarized Dark** (VS Code built-in)
- `editor.foreground` wurde auf Solarized's `#839496` angepasst, damit Syntax-Text zum Highlighting passt

## Struktur

- `package.json` — Extension-Manifest, registriert das Theme unter `contributes.themes`
- `themes/alien-blood-contrast.json` — Standard-Variante
- `themes/alien-blood-contrast-high.json` — kontrastverstärkte Variante ("Alien Blood Contrast High")

Die High-Variante ist eine reine Ableitung der Standard-Variante: gleiche Keys, gleiche Reihenfolge, gleiche Alien-Blood-Farbtöne — nur Helligkeit und Sättigung angehoben (Syntax: Solarized Dark → Solarized Bright). Bei Änderungen an der Standard-Variante muss die High-Variante entsprechend nachgezogen werden.

## Testen

Theme lokal testen: `F5` in VS Code (startet Extension Development Host) oder:
```
code --extensionDevelopmentPath=E:\gitprojects\alien-blood-contrast
```
