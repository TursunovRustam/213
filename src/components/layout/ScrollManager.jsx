import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Прокрутка к якорю (#faq, #reviews, #contacts) после перехода.
// Наверх при смене страницы прокручивает App.jsx — после анимации ухода страницы.
export default function ScrollManager() {
  const { hash, key } = useLocation();

  useEffect(() => {
    if (!hash) return undefined;
    let attempts = 0;
    let timer;
    const scrollToTarget = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (attempts < 25) {
        attempts += 1;
        timer = setTimeout(scrollToTarget, 80);
      }
    };
    scrollToTarget();
    return () => clearTimeout(timer);
  }, [hash, key]);

  return null;
}
