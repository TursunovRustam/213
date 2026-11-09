import { cx } from '../../utils/cx';
import styles from './SectionHeader.module.css';

// Заголовок секции: крупный h2, необязательный подзаголовок и действие справа (ссылка/кнопки)
export default function SectionHeader({ id, title, lead, action, align = 'start', onDark = false, className }) {
  return (
    <div className={cx(styles.header, styles[align], onDark && styles.onDark, className)}>
      <div className={styles.text}>
        <h2 id={id} className={styles.title}>
          {title}
        </h2>
        {lead && <p className={styles.lead}>{lead}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
