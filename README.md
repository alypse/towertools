# Tower Tools

A single-page React app linking to community tools, calculators and guides for
The Tower (not so) Idle game.

Published to [thetower.tools](https://thetower.tools)

## Getting started

```bash
npm install
npm run dev
```

## Scripts

| Script               | What it does                                        |
| -------------------- | --------------------------------------------------- |
| `npm run dev`        | Start the Vite dev server (`npm start` is an alias) |
| `npm run build`      | Production build into `build/`                      |
| `npm run preview`    | Serve the production build locally                  |
| `npm test`           | Run the test suite once with Vitest                 |
| `npm run test:watch` | Run the tests in watch mode                         |
| `npm run format`     | Format the repo with Prettier                       |

## Adding an app or a guide

1. Drop the icon into `src/assets/apps/` (`.webp` preferred). Guides have no icon.
2. Add an `import` for it at the top of `src/utils/Applist.js`.
3. Append an entry to the array:

```js
{
  id: 17,               // must be unique within its own list
  name: 'Thing Calculator',
  icon: thingIcon,
  description: 'What it does.',
  url: 'https://example.com/',
  author: 'Someone',
  status: 'Supported',  // any other value renders as a badge on the card
}
```

Guides live in `src/utils/Guidelist.js` and take the same shape minus `icon` and
`status`. Array order is display order.

## Theming

Colours are CSS custom properties declared in `src/styles/tokens.scss`. The site
follows the OS preference by default, and the header toggle offers Light, Dark
and **TTG RNG** — a randomly generated palette with a rarity roll. Generated
themes are guaranteed readable: `src/utils/themeRng.js` verifies every colour
against the WCAG contrast formula, and `themeRng.test.js` enforces that across
300 rolls.

## Deployment

Netlify serves the contents of `build/`, with `public/_redirects` providing the
SPA fallback. Vite is configured to output to `build/` so the hosting config
matches Create React App's old layout.
