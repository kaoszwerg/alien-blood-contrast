# Alien Blood Contrast

A dark VS Code color theme that combines the deep green UI atmosphere of **Alien Blood** with the proven syntax highlighting palette of **Solarized Dark**.

![Theme Preview](https://img.shields.io/badge/theme-dark-0f1610?style=for-the-badge)

## Themes

This extension ships **ten** themes from one package — two contrast levels, each available neutral or with one of four status bar accents.

| | Neutral | Green | Blue | Orange | Violet |
| --- | --- | --- | --- | --- | --- |
| **Standard** | Alien Blood Contrast | … Green | … Blue | … Orange | … Violet |
| **High contrast** | … High | … High Green | … High Blue | … High Orange | … High Violet |

**Standard** is the original balance: Alien Blood UI, Solarized Dark syntax.

**High contrast** keeps every Alien Blood hue and every background surface untouched — it only raises the brightness of text, icons, borders and line numbers. Syntax moves to brighter Solarized values. Every syntax color clears WCAG AA against the editor background; the weakest is 6.15:1, versus 3.42:1 in the standard variant.

The accent variants are byte-identical to their neutral counterpart apart from the `statusBar*` keys. See [Telling windows apart](#telling-windows-apart).

## Concept

- **UI & Backgrounds** — The dark green tones, sidebar, activity bar, tabs, terminal, and status bar colors come from Alien Blood
- **Syntax Highlighting** — All code coloring (keywords, strings, comments, variables, etc.) uses the classic Solarized Dark palette

This gives you the distinctive Alien Blood look and feel while keeping the highly readable and well-balanced Solarized syntax colors.

## Installation

1. Open **Extensions** in VS Code (`Cmd+Shift+X` / `Ctrl+Shift+X`)
2. Search for **Alien Blood Contrast**
3. Click **Install**
4. Open **Color Theme** picker (`Cmd+K Cmd+T` / `Ctrl+K Ctrl+T`)
5. Pick any of the ten **Alien Blood Contrast** entries

## Telling windows apart

If you keep several VS Code windows open, give each project its own status bar color. The status bar suits this better than the title bar: a thinner strip, always visible, and no collision with the window controls.

Pick the accent variant in the project's `.vscode/settings.json` — one line, no color values to maintain:

```jsonc
{ "workbench.colorTheme": "Alien Blood Contrast High Blue" }
```

Available accent themes:

| Accent | Standard | High contrast | Status bar |
| --- | --- | --- | --- |
| Green | `Alien Blood Contrast Green` | `Alien Blood Contrast High Green` | `#2f7e25` on `#f2f8f5` — 4.72:1 |
| Blue | `Alien Blood Contrast Blue` | `Alien Blood Contrast High Blue` | `#2f6a7f` on `#f2f8f5` — 5.60:1 |
| Orange | `Alien Blood Contrast Orange` | `Alien Blood Contrast High Orange` | `#e08009` on `#08120b` — 6.59:1 |
| Violet | `Alien Blood Contrast Violet` | `Alien Blood Contrast High Violet` | `#47587f` on `#f2f8f5` — 6.57:1 |

Orange is the one carrying dark text; a light foreground would drop to 2.69:1 on it.

Each accent theme also pins `statusBar.debuggingBackground`, so the bar keeps the project's color while you debug instead of turning orange — which matters most when several debug sessions run side by side. `statusBarItem.remoteBackground` is pinned too, so the Remote/WSL indicator does not break the strip with its own green block.

### Any other color

If you need an accent outside those four, override the status bar per project instead. This works with any of the ten themes:

```jsonc
{
  "workbench.colorCustomizations": {
    "[Alien Blood Contrast High]": {
      "statusBar.background": "#7f2b27",
      "statusBar.foreground": "#f2f8f5",
      "statusBar.border": "#7f2b27",
      "statusBar.debuggingBackground": "#7f2b27",
      "statusBar.debuggingForeground": "#f2f8f5",
      "statusBar.noFolderBackground": "#7f2b27"
    }
  }
}
```

The theme name in square brackets keeps the override from leaking into other themes.

## Building

`themes/alien-blood-contrast.json` is the single source. Every other theme file, the `contributes.themes` list in `package.json`, and the preview page are generated:

```
npm run build
```

Edit the base theme, run the script, and everything stays in sync. Hand edits to the generated files are lost on the next run.

| Script | Output |
| --- | --- |
| `npm run build-themes` | the nine derived theme files, plus `contributes.themes` in `package.json` |
| `npm run build-preview` | `docs/index.html` |
| `npm run build` | both |

### Preview page

`docs/index.html` renders every variant side by side — editor sample, status bar, and the WCAG contrast ratio of each syntax color against its own background. It reads the theme JSON directly and resolves scopes the way VS Code does, so it is a check on the actual shipped values rather than a mockup. Open the file in a browser, or serve `docs/` via GitHub Pages.

Rerun `npm run build-preview` after changing the base theme, otherwise the page shows stale colors.

## Credits

This theme is a combination of two excellent themes:

- **[Alien Blood](https://marketplace.visualstudio.com/items?itemName=thomasbishop.alien-blood)** by [Thomas Bishop](https://github.com/thomasbishop) — UI colors
- **[Solarized Dark](https://ethanschoonover.com/solarized/)** by [Ethan Schoonover](https://github.com/altercation) — Syntax highlighting (built into VS Code)

## License

MIT
