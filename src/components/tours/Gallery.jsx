import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Images, X } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { useEscape } from '../../hooks/useEscape';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { cx } from '../../utils/cx';
import SmartImage from '../ui/SmartImage';
import styles from './Gallery.module.css';

// Галерея тура: одно большое фото и 4 маленьких. По клику — лайтбокс со свайпом.
export default function Gallery({ images, scene }) {
  const { t, tr } = useT();
  const [openIndex, setOpenIndex] = useState(null);
  const preview = images.slice(0, 5);

  return (
    <>
      <div className={styles.grid}>
        {preview.map((image, index) => (
          <button
            key={image.src}
            type="button"
            className={cx(styles.cell, index === 0 && styles.main)}
            onClick={() => setOpenIndex(index)}
            aria-label={t('gallery.open', { n: index + 1, total: images.length, alt: tr(image.alt) })}
          >
            <SmartImage
              src={image.src}
              alt=""
              label={tr(image.alt)}
              showLabel={index === 0 || preview.length < 3}
              scene={scene}
              priority={index === 0}
              className={styles.image}
            />
          </button>
        ))}
        <button type="button" className={styles.showAll} onClick={() => setOpenIndex(0)}>
          <Images aria-hidden="true" />
          {t('gallery.showAll', { count: images.length })}
        </button>
      </div>

      <AnimatePresence>
        {openIndex !== null && (
          <Lightbox images={images} startIndex={openIndex} scene={scene} onClose={() => setOpenIndex(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

function Lightbox({ images, startIndex, scene, onClose }) {
  const { t, tr } = useT();
  const trackRef = useRef(null);
  const closeRef = useRef(null);
  const [current, setCurrent] = useState(startIndex);

  useLockBodyScroll(true);
  useEscape(true, onClose);

  // Открываем сразу на выбранном фото
  useEffect(() => {
    const track = trackRef.current;
    if (track) track.scrollTo({ left: startIndex * track.clientWidth, behavior: 'instant' });
    closeRef.current?.focus();
  }, [startIndex]);

  const goTo = (index) => {
    const track = trackRef.current;
    if (!track) return;
    const target = Math.max(0, Math.min(images.length - 1, index));
    track.scrollTo({ left: target * track.clientWidth, behavior: 'smooth' });
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') goTo(current + 1);
    if (event.key === 'ArrowLeft') goTo(current - 1);
  };

  return createPortal(
    <motion.div
      className={styles.lightbox}
      role="dialog"
      aria-modal="true"
      aria-label={t('gallery.title')}
      onKeyDown={handleKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className={styles.bar}>
        <span className={styles.counter} aria-live="polite">
          {current + 1} / {images.length}
        </span>
        <button ref={closeRef} type="button" className={styles.iconButton} onClick={onClose} aria-label={t('common.close')}>
          <X aria-hidden="true" />
        </button>
      </div>

      <div
        ref={trackRef}
        className={styles.track}
        onScroll={(event) => {
          const track = event.currentTarget;
          setCurrent(Math.round(track.scrollLeft / track.clientWidth));
        }}
      >
        {images.map((image) => (
          <figure key={image.src} className={styles.slide}>
            <SmartImage src={image.src} alt={tr(image.alt)} label={tr(image.alt)} scene={scene} className={styles.slideImage} />
            <figcaption className={styles.caption}>{tr(image.alt)}</figcaption>
          </figure>
        ))}
      </div>

      <button
        type="button"
        className={cx(styles.iconButton, styles.nav, styles.prev)}
        onClick={() => goTo(current - 1)}
        disabled={current === 0}
        aria-label={t('common.previous')}
      >
        <ChevronLeft aria-hidden="true" />
      </button>
      <button
        type="button"
        className={cx(styles.iconButton, styles.nav, styles.next)}
        onClick={() => goTo(current + 1)}
        disabled={current === images.length - 1}
        aria-label={t('common.next')}
      >
        <ChevronRight aria-hidden="true" />
      </button>
    </motion.div>,
    document.body,
  );
}
