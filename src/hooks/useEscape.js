import { useEffect } from 'react';

// Вызывает onEscape по клавише Esc, пока active === true
export function useEscape(active, onEscape) {
  useEffect(() => {
    if (!active) return undefined;
    const handleKey = (event) => {
      if (event.key === 'Escape') onEscape();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [active, onEscape]);
}
