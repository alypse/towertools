import { describe, expect, it } from 'vitest';
import { RARITIES, contrastRatio, hslToHex, pickRarity, rollTheme } from './themeRng.js';

const ROLLS = 300;
const rolls = Array.from({ length: ROLLS }, () => rollTheme());

describe('colour maths', () => {
  it('converts HSL to hex', () => {
    expect(hslToHex(0, 100, 50)).toBe('#ff0000');
    expect(hslToHex(120, 100, 50)).toBe('#00ff00');
    expect(hslToHex(240, 100, 50)).toBe('#0000ff');
    expect(hslToHex(0, 0, 100)).toBe('#ffffff');
    expect(hslToHex(0, 0, 0)).toBe('#000000');
  });

  it('wraps hue values outside 0-360', () => {
    expect(hslToHex(360, 100, 50)).toBe(hslToHex(0, 100, 50));
    expect(hslToHex(-120, 100, 50)).toBe(hslToHex(240, 100, 50));
  });

  it('computes known WCAG contrast ratios', () => {
    expect(contrastRatio('#ffffff', '#000000')).toBeCloseTo(21, 1);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
    // Documented 4.54:1 pair from the WCAG examples.
    expect(contrastRatio('#767676', '#ffffff')).toBeGreaterThan(4.5);
  });
});

describe('rollTheme readability guarantee', () => {
  it('always produces body text with at least 4.5:1 against the background', () => {
    for (const theme of rolls) {
      const ratio = contrastRatio(theme.tokens['--text'], theme.tokens['--bg']);
      expect(ratio, `${theme.name} (${theme.rarity}) text on bg`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('always produces body text with at least 4.5:1 against card surfaces', () => {
    for (const theme of rolls) {
      const ratio = contrastRatio(theme.tokens['--text'], theme.tokens['--surface']);
      expect(ratio, `${theme.name} (${theme.rarity}) text on surface`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('always produces muted text with at least 4.5:1 against card surfaces', () => {
    for (const theme of rolls) {
      const ratio = contrastRatio(theme.tokens['--text-muted'], theme.tokens['--surface']);
      expect(ratio, `${theme.name} (${theme.rarity}) muted on surface`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('always produces an accent with at least 4.5:1 against every background it sits on', () => {
    for (const theme of rolls) {
      for (const surface of ['--bg', '--surface', '--surface-hover']) {
        const ratio = contrastRatio(theme.tokens['--accent'], theme.tokens[surface]);
        expect(ratio, `${theme.name} (${theme.rarity}) accent on ${surface}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('always picks an accent-contrast colour that is legible on the accent', () => {
    for (const theme of rolls) {
      const ratio = contrastRatio(theme.tokens['--accent-contrast'], theme.tokens['--accent']);
      expect(ratio, `${theme.name} (${theme.rarity}) accent-contrast on accent`).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe('rollTheme output shape', () => {
  const REQUIRED_TOKENS = [
    '--bg',
    '--bg-soft',
    '--surface',
    '--surface-hover',
    '--border',
    '--border-strong',
    '--text',
    '--text-muted',
    '--accent',
    '--accent-end',
    '--accent-gradient',
    '--accent-contrast',
    '--ring',
    '--shadow',
    '--glow',
  ];

  it('emits every token the stylesheet expects', () => {
    for (const theme of rolls) {
      for (const token of REQUIRED_TOKENS) {
        expect(theme.tokens[token], `${theme.name} missing ${token}`).toBeTruthy();
      }
    }
  });

  it('emits a valid rarity and a two-word name', () => {
    const names = RARITIES.map(rarity => rarity.name);
    for (const theme of rolls) {
      expect(names).toContain(theme.rarity);
      expect(theme.name.split(' ')).toHaveLength(2);
    }
  });

  it('produces both light and dark themes over many rolls', () => {
    expect(rolls.some(theme => theme.isDark)).toBe(true);
    expect(rolls.some(theme => !theme.isDark)).toBe(true);
  });

  it('varies the palette between rolls', () => {
    const distinct = new Set(rolls.map(theme => theme.tokens['--accent']));
    expect(distinct.size).toBeGreaterThan(ROLLS / 2);
  });
});

describe('pickRarity', () => {
  it('respects the weighted table across many rolls', () => {
    const counts = Object.fromEntries(RARITIES.map(rarity => [rarity.name, 0]));
    for (let i = 0; i < 20000; i += 1) counts[pickRarity().name] += 1;

    // Common should dominate and Mythic should be scarce, with generous bounds
    // so this never flakes.
    expect(counts.Common / 20000).toBeGreaterThan(0.44);
    expect(counts.Common / 20000).toBeLessThan(0.56);
    expect(counts.Mythic / 20000).toBeGreaterThan(0.005);
    expect(counts.Mythic / 20000).toBeLessThan(0.04);
  });

  it('is deterministic when given a fixed RNG', () => {
    expect(pickRarity(() => 0).name).toBe('Common');
    expect(pickRarity(() => 0.99).name).toBe('Mythic');
  });
});
