# CLAUDE.md

Tower Tools — a single-page React app that is a styled link directory for The Tower
(idle game): a list of community web apps and a list of community guides, with search,
filtering, favourites and a theme system. Published to https://thetower.tools.

## Stack

Vite 8 + React 18 + Sass, tested with Vitest + Testing Library. No router, no state
library, no backend, no API calls. `public/_redirects` is a Netlify SPA fallback.

`vite.config.js` sets `build.outDir` to `build` (not Vite's default `dist`) so the
Netlify publish directory inherited from Create React App keeps working. Don't change
it without updating the hosting config.

## Render tree

```
index.html          (repo root; inline pre-paint script applies the stored theme)
src/index.jsx       createRoot → <App/>
└── src/app.jsx     imports app.scss (which pulls in tokens + global), renders <Main/>
    └── src/pages/Main.jsx
        ├── <ThemeToggle/>  src/components/ThemeToggle.jsx
        ├── nav             view tabs from the VIEWS map
        ├── <Toolbar/>      src/components/Toolbar.jsx  (search, sort, author chips)
        └── <List/>         src/components/List.jsx → <Panel/> per item
```

`Main.jsx` owns all list state: view, sort, favourites, active author filters (all
persisted) and search (transient). `Panel` owns only its own expand toggle. `useTheme`
owns the theme.

## The common change: adding an app or a guide

Nearly every commit historically is "add an entry".

1. Drop the icon in `src/assets/apps/` (`.webp` convention). Guides have no icons.
2. Add a static `import` at the top of `src/utils/Applist.js` — **not** `require()`;
   Vite is ESM-only.
3. Append an object to the array in `src/utils/Applist.js` or `Guidelist.js`.

```js
{
  id: 17,               // unique within its own list; a test asserts this
  name: 'Thing Calculator',
  icon: thingIcon,
  description: 'What it does.',
  url: 'https://example.com/',
  author: 'Someone',
  status: 'Supported',  // any other value renders as a badge
}
```

Guides take the same shape minus `icon` and `status`. Array order is display order.
Author filter chips are derived from the data, so a new author appears automatically.

Ids are only unique _within_ a list, so favourites are keyed `` `${kind}:${id}` ``
(see `keyFor` in `Main.jsx`), and that composite lands on each item as `item.key`.

## Theming

Colours are CSS custom properties, not Sass variables — the toggle switches palettes at
runtime. `src/styles/tokens.scss` declares them in four layers:

1. `:root` — the complete light palette (every token gets a value here).
2. `@media (prefers-color-scheme: dark)` guarded by `:root:not([data-theme='light'])`.
3. `:root[data-theme='dark']` — so an explicit choice beats the OS in both directions.
4. `:root[data-theme='rng']` — a fallback; the real values arrive as inline properties.

`src/utils/useTheme.js` (built on the existing `useUpdatedState`) writes `data-theme`
onto the document root and, in RNG mode, sets each rolled token with `setProperty` —
clearing them on unmount so they can't leak into light/dark. The storage key is
`theme-1.0`, which the inline script in `index.html` also reads to avoid a flash of the
wrong palette on first paint. **If you change that key or the token names, change both
places.**

`src/utils/themeRng.js` generates RNG themes: a weighted rarity table (Common 50 →
Mythic 2) drives saturation and hue scheme, and every colour is verified against the
WCAG contrast formula and nudged until it clears 4.5:1. The token names it emits are a
contract with `tokens.scss` — adding a token means adding it in both files and to
`REQUIRED_TOKENS` in the test.

## Styling

Each component has its own `.scss` next to it, imported by the component. `app.scss` is
the only file that pulls in `styles/tokens.scss` and `styles/global.scss` (both emit
CSS, so importing them twice would duplicate output). `src/variables.scss` holds only
Sass-time helpers — breakpoints and the `below()`, `tap-target`, `focus-ring` mixins —
and emits nothing, so it's safe to `@use` anywhere. Use `@use`, not `@import`.

Layout is a CSS Grid with `repeat(auto-fill, minmax(min(100%, 300px), 1fr))` inside a
`--max-width: 1400px` container; that one rule carries most of the responsive
behaviour. Explicit breakpoints are 600px (`$bp-sm`) and 900px/1200px.

## Testing

`npm test` runs Vitest once. Two suites:

- `src/utils/themeRng.test.js` — colour maths plus a **property test that rolls 300
  themes and asserts every one clears 4.5:1** on text, muted text and accents. This is
  the guardrail on a feature whose whole point is unpredictability; keep it passing
  rather than loosening it.
- `src/App.test.jsx` — rendering, view switching, search, author chips, sorting,
  favourites persistence, and all three theme modes.

## Conventions

`.prettierrc.json`: 2-space, single quotes (incl. JSX), semicolons, trailing commas,
`arrowParens: avoid`, `printWidth: 160`. The repo **is** Prettier-clean — run
`npm run format` before committing.

JSX lives in `.jsx` files (required by Vite's esbuild transform); plain logic stays in
`.js`. Components are `export function Name()` (named); pages are arrow functions with
a default export. Data modules export a single `SCREAMING_CASE` const. External links
always carry `target="_blank" rel="noreferrer"`. Icons are inline SVG components in
`src/components/icons.jsx` so they inherit `currentColor` and re-theme for free.
