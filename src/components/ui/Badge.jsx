import { cx } from '../../utils/cx';
import styles from './Badge.module.css';

// variant: bestseller | new | likely-to-sell-out | sale | transfer | neutral
export default function Badge({ variant = 'neutral', icon: Icon, className, children }) {
  return (
    <span className={cx(styles.badge, styles[variant], className)}>
      {Icon && <Icon aria-hidden="true" className={styles.icon} />}
      {children}
    </span>
  );
}
