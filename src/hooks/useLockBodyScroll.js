import { useEffect } from 'react';

// Блокирует прокрутку страницы, пока открыто меню, шторка или лайтбокс
export function useLockBodyScroll(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [locked]);
}
