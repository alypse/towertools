import { useCallback, useEffect, useState } from 'react';

const versionCache = '1.0';

export const useInputEvent = setState => useCallback(({ target: { value } }) => setState(value), [setState]);

export const useUpdatedState = (initial, key) => {
  const cacheKey = `${key}-${versionCache}`;

  // Lazy initialiser: localStorage is read once on mount rather than on every
  // render.
  const [state, setState] = useState(() => {
    let fromStorage;
    try {
      const valueFromStorage = localStorage.getItem(cacheKey);
      if (valueFromStorage) fromStorage = JSON.parse(valueFromStorage);
    } catch (e) {
      // no storage;
    }
    return fromStorage === null || fromStorage === undefined ? initial : fromStorage;
  });

  const updateState = useCallback(
    newValue => {
      setState(oldValue => {
        const setValue = typeof newValue === 'function' ? newValue(oldValue) : newValue;
        try {
          if (key) localStorage.setItem(cacheKey, JSON.stringify(setValue));
        } catch (e) {
          // no storage;
        }
        return setValue;
      });
    },
    [key, cacheKey, setState],
  );
  return [state, updateState];
};

export const useInputState = (initial, key) => {
  const [state, setState] = useUpdatedState(initial, key);
  const updateState = useInputEvent(setState);
  return [state, updateState, setState];
};

/**
 * Tracks a media query from JS. Only worth reaching for when a breakpoint has to
 * move a node between two parents — anything CSS can express should stay in the
 * stylesheet with the `below()` mixin.
 */
export const useMediaQuery = query => {
  const supported = typeof window.matchMedia === 'function';

  // Read synchronously so the first paint is already on the right side of the
  // breakpoint rather than flipping layout on mount.
  const [matches, setMatches] = useState(() => supported && window.matchMedia(query).matches);

  useEffect(() => {
    if (!supported) return undefined;
    const list = window.matchMedia(query);
    setMatches(list.matches);

    const onChange = event => setMatches(event.matches);
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query, supported]);

  return matches;
};

export const capitalize = string => (!string?.length ? '' : string.charAt(0).toUpperCase() + string.substring(1).toLowerCase());
export const capitalizeAll = string => (!string?.length ? '' : string.split(' ').map(capitalize).join(' '));
