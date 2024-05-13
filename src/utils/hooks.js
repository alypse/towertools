import { useCallback, useState } from 'react';

const versionCache = '23.01-0';

export const useInputEvent = setState => useCallback(({ target: { value } }) => setState(value), [setState]);

export const useUpdatedState = (initial, key) => {
    let fromStorage;
    const cacheKey = `${key}-${versionCache}`;
    try {
        const valueFromStorage = localStorage.getItem(cacheKey);
        if (valueFromStorage) fromStorage = JSON.parse(valueFromStorage);
    } catch (e) {
        // no storage;
    }
    const initialValue = fromStorage === null || fromStorage === undefined ? initial : fromStorage;
    const [state, setState] = useState(initialValue);

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

export const capitalize = string => (!string?.length ? '' : string.charAt(0).toUpperCase() + string.substring(1).toLowerCase());
export const capitalizeAll = string => (!string?.length ? '' : string.split(' ').map(capitalize).join(' '));
