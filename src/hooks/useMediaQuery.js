import { useCallback, useSyncExternalStore } from 'react';

// true, если медиа-запрос выполняется, например useMediaQuery('(min-width: 1024px)')
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
