import { useCallback, useEffect } from 'react';
import { useUpdatedState } from './hooks.js';
import { rollTheme } from './themeRng.js';

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  RNG: 'rng',
};

const DEFAULT_THEME = { mode: null, rolled: null };

/**
 * Owns the active theme and mirrors it onto the document root.
 *
 * `mode: null` means "follow the OS", which is the default and is handled purely
 * in CSS by the `prefers-color-scheme` block in `styles/tokens.scss`.
 *
 * Persistence rides on the existing `useUpdatedState` hook, so the storage key
 * here (`theme-1.0`) matches the pre-paint inline script in `index.html` that
 * prevents a flash of the wrong palette on load.
 */
export const useTheme = () => {
  const [theme, setTheme] = useUpdatedState(DEFAULT_THEME, 'theme');

  useEffect(() => {
    const root = document.documentElement;

    if (theme.mode) {
      root.setAttribute('data-theme', theme.mode);
    } else {
      root.removeAttribute('data-theme');
    }

    // Inline custom properties are what actually paint an RNG roll; they must be
    // cleared when leaving RNG mode or they would leak into light/dark.
    const rolledTokens = theme.mode === THEME_MODES.RNG && theme.rolled ? theme.rolled.tokens : null;
    const applied = rolledTokens ? Object.keys(rolledTokens) : [];

    if (rolledTokens) {
      for (const [name, value] of Object.entries(rolledTokens)) {
        root.style.setProperty(name, value);
      }
    }

    return () => {
      for (const name of applied) root.style.removeProperty(name);
    };
  }, [theme]);

  const setMode = useCallback(
    mode => {
      setTheme(current => {
        // The last roll is kept when switching to light/dark so that returning
        // to RNG restores it rather than discarding it. Rolling again is the
        // reroll button's job.
        if (mode !== THEME_MODES.RNG) return { ...current, mode };
        return { mode, rolled: current.rolled ?? rollTheme() };
      });
    },
    [setTheme],
  );

  const reroll = useCallback(() => {
    setTheme({ mode: THEME_MODES.RNG, rolled: rollTheme() });
  }, [setTheme]);

  return { mode: theme.mode, rolled: theme.rolled, setMode, reroll };
};
