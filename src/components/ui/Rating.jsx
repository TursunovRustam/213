import { Star } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { cx } from '../../utils/cx';
import styles from './Rating.module.css';

// Рейтинг со звездой: ★ 4.9 (312). compact — только число отзывов в скобках
export default function Rating({ value, count, compact = false, onDark = false, className }) {
  const { t, tp, fmt } = useT();
  return (
    <span className={cx(styles.rating, onDark && styles.onDark, className)}>
      <Star aria-hidden="true" className={styles.star} />
      <span className={styles.value} aria-hidden="true">
        {fmt.rating(value)}
      </span>
      {count != null && (
        <span className={styles.count} aria-hidden="true">
          {compact ? `(${fmt.number(count)})` : tp('plural.reviews', count)}
        </span>
      )}
      <span className="visually-hidden">
        {t('rating.label', { value: fmt.rating(value) })}
        {count != null && `, ${tp('plural.reviews', count)}`}
      </span>
    </span>
  );
}

// Ряд из пяти звёзд (для отзывов)
export function Stars({ value, className }) {
  const { t, fmt } = useT();
  const filled = Math.round(value);
  return (
    <span className={cx(styles.stars, className)} role="img" aria-label={t('rating.label', { value: fmt.rating(value) })}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} aria-hidden="true" className={n <= filled ? styles.filled : styles.empty} />
      ))}
    </span>
  );
}
