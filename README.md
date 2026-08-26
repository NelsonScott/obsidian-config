# Obsidian config

Config for my Obsidian vault: hotkeys, a small plugin, CSS snippets, and
appearance settings. Obsidian keeps all of this inside the vault in a
`.obsidian/` folder, which is why the repo has that shape. The `.gitignore`
ignores everything by default and re-includes only the files listed below.

Started Aug 25 2026, on macOS, theme is Minimal.

## What is actually modified

### Hotkeys, `.obsidian/hotkeys.json`

| Key | Does |
| --- | --- |
| `Cmd+K` | Command palette. This is the whole reason I started poking at the config. `Cmd+P` still works too. |
| `Cmd+Shift+K` | Insert link. Moved here because `Cmd+K` used to be bound to it. |
| `Cmd+Shift+E` | Toggle raw source mode. `Cmd+E` for reading view is stock. |

### Slash commands, `.obsidian/core-plugins.json`

Typing `/` brings up a command menu. This is built into Obsidian, it just ships
turned off, so the only change here is the `slash-command` flag.

### Text color plugin, `.obsidian/plugins/text-color/`

Obsidian has no built in way to color text, so this is a small plugin I wrote
for it. Plain CommonJS, no build step, no dependencies. It adds commands like
"Text color: Red" and "Highlight: pick" that wrap the selection in a
`<span class="tc-red">`, and they show up in both the command palette and the
`/` menu like anything else. With nothing selected it colors the word under the
cursor.

The colors are CSS classes pointing at Obsidian's own palette variables rather
than hardcoded hex, so they follow the theme in light and dark.

### Snippets, `.obsidian/snippets/`

`beautiful-quotes.css` restyles blockquotes: a teal accent bar, a tinted panel,
Newsreader italic for the quote itself, and a small teal attribution line. To
get the attribution, leave a bare `>` line and put the name on the last line of
the quote.

`text-color.css` defines the `tc-*` classes the plugin above writes.

### Appearance, `.obsidian/appearance.json`

Accent color set to teal, `#0d9488`, and the two snippets enabled. The accent
drives the quote bars and a lot of the rest of the UI, so changing that one
value recolors most of the app.

## Using it on another machine

Obsidian expects this to live inside a vault, so clone it into the vault folder
rather than cloning it somewhere and pointing Obsidian at it:

```sh
cd /path/to/vault
git init
git remote add origin git@github.com:NelsonScott/obsidian-config.git
git fetch origin
git checkout -b main --track origin/main
```

Then open the vault and reload with `Cmd+R`. Community plugins have to be
allowed once in Settings before the text color plugin will load.

## Things worth remembering

- Callouts reuse the same `<blockquote>` element as quotes, so any blockquote
  CSS has to be scoped with `:not(.callout)` or it flattens every callout in
  the vault.
- Reading view and Live Preview are completely different DOM. Reading view has
  a real `<blockquote>`, Live Preview has one CodeMirror row per line and no box
  at all, so anything visual has to be written twice.
- Minimal defines its theme variables on `.theme-light` and `.theme-dark`, which
  beat a plain `body` selector on specificity. Snippets that set those variables
  need to match, otherwise nothing appears to happen.
- Newsreader is pulled from Google Fonts at runtime, so offline it falls back to
  Georgia. Fine, just not identical.
- Obsidian rewrites these JSON files when it quits. If I edit them by hand I
  have to reload with `Cmd+R` before closing, or the changes get overwritten.
