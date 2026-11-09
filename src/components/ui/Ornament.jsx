import { cx } from '../../utils/cx';
import styles from './Ornament.module.css';

// Тонкий разделитель-гирих между секциями: звезда из двух квадратов и ромбы по бокам
export default function Ornament({ className }) {
  return (
    <div className={cx(styles.ornament, className)} aria-hidden="true">
      <span className={styles.line} />
      <svg className={styles.motif} viewBox="0 0 120 24">
        <path d="M4 12l5-5 5 5-5 5z" />
        <path d="M20 12h22M78 12h22" />
        <g transform="translate(60 12)">
          <rect x="-8" y="-8" width="16" height="16" />
          <rect x="-8" y="-8" width="16" height="16" transform="rotate(45)" />
          <circle r="2.6" />
        </g>
        <path d="M106 12l5-5 5 5-5 5z" />
      </svg>
      <span className={cx(styles.line, styles.lineEnd)} />
    </div>
  );
}
