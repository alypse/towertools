/**
 * TTG Theme RNG — rolls a randomly generated colour theme.
 *
 * Every roll produces a palette that is readable by construction: colours are
 * generated in HSL within safe lightness bands, then verified against the WCAG
 * contrast formula and nudged until they pass. `themeRng.test.js` enforces this
 * across a few hundred rolls, which is the only sane way to test a feature whose
 * whole point is that it is unpredictable.
 *
 * The token names produced here are the same ones declared in
 * `src/styles/tokens.scss`. If you add a token there, add it here too.
 */

const MIN_CONTRAST_TEXT = 4.5;
const MIN_CONTRAST_ACCENT = 4.5;

/** Weighted rarity table. Rarer rolls unlock more adventurous palettes. */
export const RARITIES = [
  { name: 'Common', weight: 50, saturation: [22, 40], scheme: 'mono' },
  { name: 'Rare', weight: 27, saturation: [40, 58], scheme: 'analogous' },
  { name: 'Epic', weight: 15, saturation: [55, 72], scheme: 'complementary' },
  { name: 'Legendary', weight: 6, saturation: [68, 85], scheme: 'triadic' },
  { name: 'Mythic', weight: 2, saturation: [78, 96], scheme: 'dual' },
];

const ADJECTIVES = [
  'Ancestral',
  'Devoted',
  'Golden',
  'Fractured',
  'Eternal',
  'Overclocked',
  'Radiant',
  'Hollow',
  'Gilded',
  'Wandering',
  'Superior',
  'Unstable',
  'Quantum',
  'Molten',
  'Frozen',
  'Ascended',
];

const NOUNS = [
  'Void',
  'Ember',
  'Nexus',
  'Bastion',
  'Coin',
  'Cell',
  'Shard',
  'Wave',
  'Orb',
  'Spotlight',
  'Thorn',
  'Chrono',
  'Bulwark',
  'Cascade',
  'Vault',
  'Horizon',
];

/* -------------------------------------------------------------------------- */
/* Colour maths                                                                */
/* -------------------------------------------------------------------------- */

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/** Converts HSL (h 0-360, s/l 0-100) to a `#rrggbb` string. */
export const hslToHex = (h, s, l) => {
  const hue = ((h % 360) + 360) % 360;
  const sat = clamp(s, 0, 100) / 100;
  const light = clamp(l, 0, 100) / 100;

  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = light - c / 2;

  const segment = Math.floor(hue / 60) % 6;
  const [r, g, b] = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][segment];

  const toChannel = value =>
    Math.round((value + m) * 255)
      .toString(16)
      .padStart(2, '0');

  return `#${toChannel(r)}${toChannel(g)}${toChannel(b)}`;
};

const channelLuminance = channel => {
  const srgb = channel / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
};

/** WCAG 2.1 relative luminance of a `#rrggbb` string. */
export const relativeLuminance = hex => {
  const value = parseInt(hex.slice(1), 16);
  const r = channelLuminance((value >> 16) & 255);
  const g = channelLuminance((value >> 8) & 255);
  const b = channelLuminance(value & 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/** WCAG contrast ratio between two `#rrggbb` strings, from 1 to 21. */
export const contrastRatio = (foreground, background) => {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  const [lighter, darker] = a > b ? [a, b] : [b, a];
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Walks a colour's lightness in `step` increments until it clears `target`
 * contrast against every colour in `backgrounds`. Bounded, and returns the best
 * attempt if the target is never met, so this can never spin.
 */
const ensureContrast = ({ h, s, l }, backgrounds, target, step) => {
  let lightness = l;
  let best = { hex: hslToHex(h, s, lightness), ratio: 0 };

  for (let i = 0; i < 50; i += 1) {
    const hex = hslToHex(h, s, lightness);
    const ratio = Math.min(...backgrounds.map(bg => contrastRatio(hex, bg)));
    if (ratio > best.ratio) best = { hex, ratio };
    if (ratio >= target) return hex;
    lightness = clamp(lightness + step, 0, 100);
    if (lightness === 0 || lightness === 100) break;
  }

  return best.hex;
};

/* -------------------------------------------------------------------------- */
/* Rolling                                                                     */
/* -------------------------------------------------------------------------- */

const pick = (list, random) => list[Math.floor(random() * list.length)];
const between = (min, max, random) => min + random() * (max - min);

export const pickRarity = (random = Math.random) => {
  const total = RARITIES.reduce((sum, rarity) => sum + rarity.weight, 0);
  let roll = random() * total;
  for (const rarity of RARITIES) {
    roll -= rarity.weight;
    if (roll <= 0) return rarity;
  }
  return RARITIES[0];
};

/** Derives the accent hue(s) from the base hue according to the rarity scheme. */
const hueSchemeFor = (scheme, baseHue, random) => {
  switch (scheme) {
    case 'analogous':
      return [baseHue + (random() < 0.5 ? -34 : 34)];
    case 'complementary':
      return [baseHue + 180];
    case 'triadic':
      return [baseHue + 120, baseHue + 240];
    case 'dual':
      return [baseHue + between(60, 150, random), baseHue + between(180, 300, random)];
    case 'mono':
    default:
      return [baseHue];
  }
};

/**
 * Rolls a complete theme.
 *
 * @param {() => number} random Injectable RNG, so tests can be deterministic.
 * @returns {{name: string, rarity: string, isDark: boolean, tokens: Record<string, string>}}
 */
export const rollTheme = (random = Math.random) => {
  const rarity = pickRarity(random);
  const isDark = random() < 0.5;
  const baseHue = random() * 360;
  const saturation = between(rarity.saturation[0], rarity.saturation[1], random);
  const accentHues = hueSchemeFor(rarity.scheme, baseHue, random);

  // Backgrounds stay inside a narrow, safe band and carry only a whisper of the
  // base hue, which is what keeps every roll usable rather than lurid.
  const surfaceSaturation = clamp(saturation * 0.22, 4, 18);
  const bgLightness = isDark ? between(7, 13, random) : between(93, 97, random);
  const bgHex = hslToHex(baseHue, surfaceSaturation, bgLightness);

  const surfaceLightness = isDark ? bgLightness + between(4, 7, random) : bgLightness - between(2, 5, random);
  const surfaceHex = hslToHex(baseHue, surfaceSaturation, surfaceLightness);
  const surfaceHoverHex = hslToHex(baseHue, surfaceSaturation, isDark ? surfaceLightness + 5 : surfaceLightness - 4);
  const bgSoftHex = hslToHex(baseHue, surfaceSaturation, isDark ? bgLightness + 2.5 : bgLightness - 1.5);

  // Text is pinned toward the opposing extreme, then verified against both the
  // page background and the card surface.
  const textDirection = isDark ? 1 : -1;
  const textHex = ensureContrast({ h: baseHue, s: clamp(surfaceSaturation * 0.6, 0, 12), l: isDark ? 95 : 12 }, [bgHex, surfaceHex], 7, textDirection * 2);
  const textMutedHex = ensureContrast(
    { h: baseHue, s: clamp(surfaceSaturation * 0.8, 0, 20), l: isDark ? 72 : 38 },
    [bgHex, surfaceHex, surfaceHoverHex],
    MIN_CONTRAST_TEXT,
    textDirection * 2,
  );

  // Accents carry the personality, so they get the full saturation and are then
  // pushed until they are legible against every background they sit on.
  const accentHexes = accentHues.map(hue =>
    ensureContrast({ h: hue, s: saturation, l: isDark ? 66 : 40 }, [bgHex, surfaceHex, surfaceHoverHex], MIN_CONTRAST_ACCENT, textDirection * 2),
  );
  const accentHex = accentHexes[0];
  const accentEndHex = accentHexes[accentHexes.length - 1];

  // Whichever of black/white reads better on top of the accent itself.
  const accentContrastHex = contrastRatio('#ffffff', accentHex) >= contrastRatio('#111111', accentHex) ? '#ffffff' : '#111111';

  const borderHex = hslToHex(baseHue, surfaceSaturation, isDark ? surfaceLightness + 12 : surfaceLightness - 12);
  const borderStrongHex = hslToHex(baseHue, clamp(saturation * 0.5, 0, 60), isDark ? surfaceLightness + 26 : surfaceLightness - 26);

  const gradient = accentHexes.length > 1 ? `linear-gradient(135deg, ${accentHex}, ${accentEndHex})` : accentHex;

  return {
    name: `${pick(ADJECTIVES, random)} ${pick(NOUNS, random)}`,
    rarity: rarity.name,
    isDark,
    tokens: {
      '--bg': bgHex,
      '--bg-soft': bgSoftHex,
      '--surface': surfaceHex,
      '--surface-hover': surfaceHoverHex,
      '--border': borderHex,
      '--border-strong': borderStrongHex,
      '--text': textHex,
      '--text-muted': textMutedHex,
      '--accent': accentHex,
      '--accent-end': accentEndHex,
      '--accent-gradient': gradient,
      '--accent-contrast': accentContrastHex,
      '--ring': accentHex,
      '--shadow': isDark ? '0 8px 24px rgba(0, 0, 0, 0.45)' : '0 8px 24px rgba(15, 15, 25, 0.12)',
      '--glow': rarity.name === 'Mythic' ? `0 0 24px ${accentHex}66` : 'none',
    },
  };
};

/** Colour used to tint a rarity label in the UI. */
export const RARITY_COLORS = {
  Common: '#9aa0aa',
  Rare: '#4a9eff',
  Epic: '#b06cff',
  Legendary: '#ffb02e',
  Mythic: '#ff4d6d',
};
