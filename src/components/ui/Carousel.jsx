import { Children, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { cx } from '../../utils/cx';
import styles from './Carousel.module.css';

// Горизонтальная карусель на CSS scroll-snap. Свайп на телефоне, стрелки на десктопе.
// slideWidth — ширина одного слайда, например 'min(82vw, 360px)'
export default function Carousel({ label, slideWidth = 'min(82vw, 360px)', onDark = false, className, children }) {
  const { t } = useT();
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const updateEdges = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setEdges({
      start: track.scrollLeft <= 4,
      end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    const frame = requestAnimationFrame(updateEdges);
    track.addEventListener('scroll', updateEdges, { passive: true });
    window.addEventListener('resize', updateEdges);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener('scroll', updateEdges);
      window.removeEventListener('resize', updateEdges);
    };
  }, [updateEdges]);

  const scroll = (direction) => {
    const track = trackRef.current;
    track?.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <div className={cx(styles.carousel, onDark && styles.onDark, className)}>
      <ul ref={trackRef} className={styles.track} style={{ '--slide-w': slideWidth }} aria-label={label}>
        {Children.map(children, (child) => (
          <li className={styles.slide}>{child}</li>
        ))}
      </ul>
      <div className={styles.controls}>
        <button type="button" className={styles.arrow} onClick={() => scroll(-1)} disabled={edges.start} aria-label={t('common.previous')}>
          <ArrowLeft aria-hidden="true" />
        </button>
        <button type="button" className={styles.arrow} onClick={() => scroll(1)} disabled={edges.end} aria-label={t('common.next')}>
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
