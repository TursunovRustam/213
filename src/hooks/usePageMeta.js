import { useEffect } from 'react';
import { site } from '../config/site';

// Задаёт <title> и <meta name="description"> для каждой страницы
export function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} · ${site.brand}` : site.brand;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
  }, [title, description]);
}
