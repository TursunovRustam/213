import { useCallback, useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('scroll', callback, { passive: true });
  return () => window.removeEventListener('scroll', callback);
}

// true, когда страница прокручена дальше threshold пикселей
export function useScrolled(threshold = 24) {
  const getSnapshot = useCallback(() => window.scrollY > threshold, [threshold]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
