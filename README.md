# Alien Blood Contrast

A dark VS Code color theme that combines the deep green UI atmosphere of **Alien Blood** with the proven syntax highlighting palette of **Solarized Dark**.

![Theme Preview](https://img.shields.io/badge/theme-dark-0f1610?style=for-the-badge)

## Themes

This extension ships **two** themes:

| Theme | Description |
| --- | --- |
| **Alien Blood Contrast** | The original balance — Alien Blood UI, Solarized Dark syntax |
| **Alien Blood Contrast High** | Same look, more contrast — darker backgrounds, brighter foregrounds, Solarized Bright syntax values |

The high contrast variant keeps the exact same Alien Blood hues, it only raises brightness and saturation. Every syntax color clears the WCAG AA threshold of 4.5:1 against the editor background (lowest is 5.3:1, versus 3.4:1 in the standard variant).

## Concept

- **UI & Backgrounds** — The dark green tones, sidebar, activity bar, tabs, terminal, and status bar colors come from Alien Blood
- **Syntax Highlighting** — All code coloring (keywords, strings, comments, variables, etc.) uses the classic Solarized Dark palette

This gives you the distinctive Alien Blood look and feel while keeping the highly readable and well-balanced Solarized syntax colors.

## Installation

1. Open **Extensions** in VS Code (`Cmd+Shift+X` / `Ctrl+Shift+X`)
2. Search for **Alien Blood Contrast**
3. Click **Install**
4. Open **Color Theme** picker (`Cmd+K Cmd+T` / `Ctrl+K Ctrl+T`)
5. Select **Alien Blood Contrast** or **Alien Blood Contrast High**

## Telling windows apart

If you keep several VS Code windows open, you can give each project its own title bar color while staying on the same theme. Add this to the project's `.vscode/settings.json`:

```jsonc
{
  "workbench.colorCustomizations": {
    "[Alien Blood Contrast][Alien Blood Contrast High]": {
      "titleBar.activeBackground": "#2f6a7f",
      "titleBar.activeForeground": "#e8f0ec",
      "titleBar.inactiveBackground": "#2f6a7f99",
      "titleBar.inactiveForeground": "#e8f0ec99"
    }
  }
}
```

The theme scope in square brackets keeps the override from leaking into other themes.

Four distinguishable accents from the Alien Blood palette:

| Accent | `titleBar.activeBackground` | `titleBar.inactiveBackground` |
| --- | --- | --- |
| Green | `#2f7e25` | `#2f7e2599` |
| Blue | `#2f6a7f` | `#2f6a7f99` |
| Orange | `#e08009` | `#e0800999` |
| Violet | `#47587f` | `#47587f99` |

Use `#e8f0ec` as the foreground for all four.

Two notes:

- `window.titleBarStyle` has to be `"custom"` for VS Code to paint the title bar. It is the default on Windows and Linux; on macOS you may need to set it explicitly and reload.
- If the title bar alone is too subtle, tint `activityBar.background` as well — it is the larger surface.

## Credits

This theme is a combination of two excellent themes:

- **[Alien Blood](https://marketplace.visualstudio.com/items?itemName=thomasbishop.alien-blood)** by [Thomas Bishop](https://github.com/thomasbishop) — UI colors
- **[Solarized Dark](https://ethanschoonover.com/solarized/)** by [Ethan Schoonover](https://github.com/altercation) — Syntax highlighting (built into VS Code)

## License

MIT
