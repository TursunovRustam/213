import { useT } from '../../i18n/useT';
import { cx } from '../../utils/cx';
import styles from './Price.module.css';

// Цена «от $49» с зачёркнутой старой ценой. size: sm | md | lg
export default function Price({ amount, oldAmount, size = 'md', perPerson = true, className }) {
  const { t, fmt } = useT();
  return (
    <span className={cx(styles.price, styles[size], className)}>
      <span className={styles.top}>
        <span className={styles.from}>{t('price.from')}</span>
        {oldAmount ? (
          <s className={styles.old}>
            <span className="visually-hidden">{t('price.oldPrice')} </span>
            {fmt.price(oldAmount)}
          </s>
        ) : null}
      </span>
      <span className={styles.bottom}>
        <span className={cx(styles.amount, oldAmount && styles.sale)}>{fmt.price(amount)}</span>
        {perPerson && <span className={styles.per}>{t('price.perPerson')}</span>}
      </span>
    </span>
  );
}
