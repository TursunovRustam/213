import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { animate, useInView, useReducedMotion } from 'framer-motion';
import { Languages, RotateCcw, Star, Wallet } from 'lucide-react';
import { site } from '../../config/site';
import { useT } from '../../i18n/useT';
import { selectTrustStats } from '../../store/slices/toursSlice';
import styles from './TrustBar.module.css';

// Полоса доверия под hero: рейтинг, отзывы, языки, отмена, оплата потом
export default function TrustBar() {
  const { t, fmt } = useT();
  const { rating, reviews } = useSelector(selectTrustStats);
  const languages = site.guide.languages.map((code) => code.toUpperCase()).join(' · ');

  return (
    <section className={`container ${styles.wrap}`} aria-label={t('home.trust.label')}>
      <ul role="list" className={styles.bar}>
        <li className={styles.item}>
          <Star aria-hidden="true" className={styles.star} />
          <span>
            <strong className={styles.big}>
              <AnimatedNumber value={rating} format={fmt.rating} />
            </strong>
            <span className={styles.caption}>{t('home.trust.rating')}</span>
          </span>
        </li>
        <li className={styles.item}>
          <span>
            <strong className={styles.big}>
              <AnimatedNumber value={reviews} format={(value) => fmt.number(Math.round(value))} />
            </strong>
            <span className={styles.caption}>{t('home.trust.reviews')}</span>
          </span>
        </li>
        <li className={styles.item}>
          <Languages aria-hidden="true" />
          <span>
            <strong>{languages}</strong>
            <span className={styles.caption}>{t('home.trust.languages')}</span>
          </span>
        </li>
        <li className={styles.item}>
          <RotateCcw aria-hidden="true" />
          <span>
            <strong>{t('home.trust.cancel', { hours: site.cancellation.hours })}</strong>
            <span className={styles.caption}>{t('home.trust.cancelText')}</span>
          </span>
        </li>
        <li className={styles.item}>
          <Wallet aria-hidden="true" />
          <span>
            <strong>{t('home.trust.payLater')}</strong>
            <span className={styles.caption}>{t('home.trust.payLaterText')}</span>
          </span>
        </li>
      </ul>
    </section>
  );
}

// Число, которое «досчитывает» до значения, когда появляется на экране
function AnimatedNumber({ value, format }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return undefined;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value]);

  return <span ref={ref}>{format(reduceMotion ? value : display)}</span>;
}
