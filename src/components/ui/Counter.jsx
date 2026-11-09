import { Minus, Plus } from 'lucide-react';
import { useT } from '../../i18n/useT';
import styles from './Counter.module.css';

// Счётчик «− 2 +» для взрослых и детей
export default function Counter({ id, label, hint, value, min = 0, max = 99, onChange }) {
  const { t } = useT();
  const labelId = `${id}-label`;
  return (
    <div className={styles.counter}>
      <div className={styles.text}>
        <span id={labelId} className={styles.label}>
          {label}
        </span>
        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
      <div className={styles.controls} role="group" aria-labelledby={labelId}>
        <button
          type="button"
          className={styles.button}
          onClick={() => onChange(value - 1)}
          disabled={value <= min}
          aria-label={t('counter.decrease', { label })}
        >
          <Minus aria-hidden="true" />
        </button>
        <output className={styles.value} aria-live="polite">
          {value}
        </output>
        <button
          type="button"
          className={styles.button}
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          aria-label={t('counter.increase', { label })}
        >
          <Plus aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
