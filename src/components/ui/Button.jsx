import { Link } from 'react-router-dom';
import { cx } from '../../utils/cx';
import styles from './Button.module.css';

/**
 * Кнопка. Если передан `to` — ссылка внутри сайта, `href` — внешняя ссылка, иначе <button>.
 * variant: primary | secondary | light | outline-light | ghost
 * size: sm | md | lg
 */
export default function Button({
  to,
  href,
  variant = 'primary',
  size = 'md',
  block = false,
  className,
  children,
  ...rest
}) {
  const classes = cx(styles.btn, styles[variant], styles[size], block && styles.block, className);

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
