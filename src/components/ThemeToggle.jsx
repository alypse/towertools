import { useEffect, useState } from 'react';
import { THEME_MODES } from '../utils/useTheme.js';
import { RARITY_COLORS } from '../utils/themeRng.js';
import { DiceIcon, MoonIcon, SunIcon } from './icons.jsx';
import './ThemeToggle.scss';

const OPTIONS = [
  { mode: THEME_MODES.LIGHT, label: 'Light', Icon: SunIcon },
  { mode: THEME_MODES.DARK, label: 'Dark', Icon: MoonIcon },
  { mode: THEME_MODES.RNG, label: 'TTG RNG', Icon: DiceIcon },
];

/** Tracks the OS preference so the correct segment is highlighted before the
 *  user has made an explicit choice. */
const useSystemPrefersDark = () => {
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return undefined;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    setPrefersDark(query.matches);

    const onChange = event => setPrefersDark(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return prefersDark;
};

export function ThemeToggle({ mode, rolled, onSelect, onReroll }) {
  const prefersDark = useSystemPrefersDark();
  const [rolling, setRolling] = useState(false);

  // With no explicit choice the CSS follows the OS, so the highlight should too.
  const activeMode = mode ?? (prefersDark ? THEME_MODES.DARK : THEME_MODES.LIGHT);

  useEffect(() => {
    if (!rolling) return undefined;
    const timer = setTimeout(() => setRolling(false), 620);
    return () => clearTimeout(timer);
  }, [rolling, rolled]);

  const handleSelect = nextMode => {
    // Only animate when a roll actually happens — returning to a kept theme
    // shouldn't imply the palette changed.
    if (nextMode === THEME_MODES.RNG && !rolled) setRolling(true);
    onSelect(nextMode);
  };

  const handleReroll = () => {
    setRolling(true);
    onReroll();
  };

  return (
    <div className='theme-toggle'>
      <div className='theme-toggle__segments' role='group' aria-label='Colour theme'>
        {OPTIONS.map(({ mode: optionMode, label, Icon }) => (
          <button
            key={optionMode}
            type='button'
            className={`theme-toggle__segment${activeMode === optionMode ? ' is-active' : ''}`}
            aria-pressed={activeMode === optionMode}
            onClick={() => handleSelect(optionMode)}
          >
            <Icon />
            <span className='theme-toggle__label'>{label}</span>
          </button>
        ))}
      </div>

      {mode === THEME_MODES.RNG && rolled && (
        <div className={`theme-toggle__roll${rolling ? ' is-rolling' : ''}`}>
          <button type='button' className='theme-toggle__reroll' onClick={handleReroll} aria-label={`Reroll theme. Current roll: ${rolled.name}`}>
            <DiceIcon />
            Reroll
          </button>
          <span className='theme-toggle__result' aria-live='polite'>
            <span className='theme-toggle__rarity' style={{ '--rarity-color': RARITY_COLORS[rolled.rarity] }}>
              {rolled.rarity}
            </span>
            <span className='theme-toggle__name'>{rolled.name}</span>
          </span>
        </div>
      )}
    </div>
  );
}
